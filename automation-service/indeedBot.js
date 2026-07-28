// applyIndeedJob.js

async function applyIndeedJob(data) {
  const context = await chromium.launchPersistentContext(
    "C:/playwright-profile",
    {
      headless: false,
      channel: "chrome",
      slowMo: 400,
      args: ["--disable-blink-features=AutomationControlled"],
    }
  );

  const page = await context.newPage();
  let activePage = page;

  try {
    console.log("Received Data:");
    console.log(data);

    if (!data.applyLink) {
      throw new Error("No apply link found");
    }

    // ─────────────────────────────
    // STEP 1: VERIFY LOGIN SESSION
    // ─────────────────────────────

    console.log("Verifying Indeed session...");
    await page.goto("https://in.indeed.com", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(3000);

    const homeContent = await page.content();
    const homeUrl = page.url();

    // If redirected to login or "Sign in" visible in nav = not logged in
    const notLoggedIn =
      homeUrl.includes("login") ||
      homeUrl.includes("signin") ||
      (homeContent.includes("Sign in") && !homeContent.includes("Sign out"));

    if (notLoggedIn) {
      console.log("─────────────────────────────────────────────");
      console.log("NOT LOGGED IN. Please run saveIndeedSession.js first:");
      console.log("  node saveIndeedSession.js");
      console.log("Log in with Google, then re-run the automation.");
      console.log("─────────────────────────────────────────────");
      await context.close();
      return {
        success: false,
        error: "Not logged in - run saveIndeedSession.js first",
      };
    }

    console.log("Session valid. Logged in to Indeed.");

    // ─────────────────────────────
    // STEP 2: OPEN JOB PAGE
    // ─────────────────────────────

    console.log("Opening job page:", data.applyLink);
    await page.goto(data.applyLink, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(5000);

    const jobPageUrl = page.url();
    console.log("Job page loaded:", jobPageUrl);

    // If Indeed redirected us to login even now, session is stale
    if (jobPageUrl.includes("login") || jobPageUrl.includes("signin") || jobPageUrl.includes("google")) {
      console.log("Session expired — redirected to login on job page.");
      console.log("Run saveIndeedSession.js to refresh your session.");
      await context.close();
      return {
        success: false,
        error: "Session expired - run saveIndeedSession.js again",
      };
    }

    await page.screenshot({ path: "debug.png", fullPage: true });

    // ─────────────────────────────
    // STEP 3: CLICK APPLY BUTTON
    // ─────────────────────────────

    try {
      // Indeed India uses "Apply with Indeed" or "Apply now" or indeedApplyButton
      const applySelectors = [
        '[data-testid="indeedApplyButton"]',
        'button:has-text("Apply with Indeed")',
        'button:has-text("Apply now")',
        'button:has-text("Apply Now")',
        'button:has-text("Easy Apply")',
        'button:has-text("Apply")',
        'a:has-text("Apply with Indeed")',
        'a:has-text("Apply now")',
      ];

      let clicked = false;

      for (const selector of applySelectors) {
        const btn = page.locator(selector).first();

        if ((await btn.count()) > 0 && (await btn.isVisible())) {
          console.log("Found Apply button:", selector);

          // Listen for popup BEFORE clicking
          const popupPromise = context
            .waitForEvent("page", { timeout: 8000 })
            .catch(() => null);

          await btn.click();
          console.log("Clicked Apply button");

          const newPage = await popupPromise;
          activePage = newPage || page;

          await activePage.waitForLoadState("domcontentloaded");
          await activePage.waitForTimeout(3000);

          const afterUrl = activePage.url();
          console.log("After Apply URL:", afterUrl);

          // Detect Google/login redirect — session not valid
          if (
            afterUrl.includes("accounts.google.com") ||
            afterUrl.includes("login") ||
            afterUrl.includes("signin") ||
            afterUrl.includes("google.com/o/oauth")
          ) {
            console.log("─────────────────────────────────────────────");
            console.log("Redirected to Google Sign-In after Apply click.");
            console.log("Your session is not saved properly.");
            console.log("Fix: run saveIndeedSession.js and complete Google login.");
            console.log("─────────────────────────────────────────────");
            await activePage.screenshot({ path: "google-redirect.png", fullPage: true });
            await context.close();
            return {
              success: false,
              error: "Google login redirect - run saveIndeedSession.js",
            };
          }

          await activePage.screenshot({ path: "after-apply.png", fullPage: true });
          clicked = true;
          console.log("Apply flow started successfully");
          break;
        }
      }

      if (!clicked) {
        console.log("No Apply button found on this job page");
        await page.screenshot({ path: "no-apply-btn.png", fullPage: true });
      }
    } catch (error) {
      console.log("Apply button error:", error.message);
    }

    // ─────────────────────────────
    // STEP 4: FILL FORM INPUTS
    // ─────────────────────────────

    try {
      await activePage.waitForTimeout(2000);
      const inputs = activePage.locator("input");
      const count = await inputs.count();
      console.log("Found inputs:", count);

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const name        = (await input.getAttribute("name"))        || "";
        const placeholder = (await input.getAttribute("placeholder")) || "";
        const type        = (await input.getAttribute("type"))        || "";
        const lower = (name + " " + placeholder + " " + type).toLowerCase();

        if (["hidden", "checkbox", "radio", "file"].includes(type)) continue;

        try {
          if (lower.includes("first") || (lower.includes("name") && !lower.includes("last"))) {
            await input.fill(data.firstName || data.name || "Palash");
            console.log("Filled First Name");
          } else if (lower.includes("last")) {
            await input.fill(data.lastName || "Mishra");
            console.log("Filled Last Name");
          } else if (lower.includes("email")) {
            await input.fill(data.email || "");
            console.log("Filled Email");
          } else if (lower.includes("phone") || lower.includes("mobile")) {
            await input.fill(data.phone || "");
            console.log("Filled Phone");
          } else if (lower.includes("experience") || lower.includes("years")) {
            await input.fill(data.experience || "2");
            console.log("Filled Experience");
          }
        } catch {}
      }
    } catch (error) {
      console.log("Input filling failed:", error.message);
    }

    // ─────────────────────────────
    // STEP 5: UPLOAD RESUME
    // ─────────────────────────────

    try {
      const uploadInput = activePage.locator('input[type="file"]').first();
      if ((await uploadInput.count()) > 0) {
        await uploadInput.setInputFiles(
          data.resumePath || "C:/Users/cnd44/OneDrive/Desktop/Resume.pdf"
        );
        console.log("Resume uploaded");
        await activePage.waitForTimeout(3000);
      } else {
        console.log("No file upload field found (resume may already be on profile)");
      }
    } catch (error) {
      console.log("Resume upload failed:", error.message);
    }

    // ─────────────────────────────
    // STEP 6: MULTI-STEP NEXT BUTTONS
    // ─────────────────────────────

    try {
      const nextSelectors = [
        'button:has-text("Next")',
        'button:has-text("Continue")',
        'button:has-text("Review your application")',
        'button:has-text("Review")',
      ];

      let keepGoing = true;
      let maxSteps = 10;

      while (keepGoing && maxSteps-- > 0) {
        keepGoing = false;
        for (const selector of nextSelectors) {
          const btn = activePage.locator(selector).first();
          if ((await btn.count()) > 0 && (await btn.isVisible())) {
            await btn.click();
            console.log("Clicked:", selector);
            await activePage.waitForTimeout(2500);
            keepGoing = true;
            break;
          }
        }
      }
    } catch (error) {
      console.log("Next buttons failed:", error.message);
    }

    // ─────────────────────────────
    // STEP 7: FINAL SUBMIT
    // ─────────────────────────────

    try {
      const submitSelectors = [
        'button:has-text("Submit your application")',
        'button:has-text("Submit application")',
        'button:has-text("Submit")',
        'button:has-text("Send Application")',
      ];

      let submitted = false;

      for (const selector of submitSelectors) {
        const submitBtn = activePage.locator(selector).last();
        if ((await submitBtn.count()) > 0 && (await submitBtn.isVisible())) {
          console.log("Submitting with:", selector);
          await submitBtn.click();
          await activePage.waitForTimeout(5000);
          console.log("Application Submitted!");
          submitted = true;
          break;
        }
      }

      if (!submitted) {
        console.log("No Submit button found - may need manual review");
        await activePage.screenshot({ path: "submit-debug.png", fullPage: true });
      }
    } catch (error) {
      console.log("Submit failed:", error.message);
    }

    return { success: true, applied: true };

  } catch (error) {
    console.log("Automation Error:", error.message);
    return { success: false, error: error.message };
  } finally {
    await context.close();
  }
}

module.exports = { applyIndeedJob };