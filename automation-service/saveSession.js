// saveIndeedSession.js
// Run this ONCE: node saveIndeedSession.js
// Complete the Google Sign-In manually in the browser window.
// After you're fully logged in to Indeed, press ENTER in the terminal.

async function saveSession() {
  const context = await chromium.launchPersistentContext(
    "C:/playwright-profile",
    {
      headless: false,
      channel: "chrome",
      slowMo: 200,
      args: [
        "--disable-blink-features=AutomationControlled",
        // Needed so Google Sign-In popup works properly
        "--no-sandbox",
        "--disable-web-security",
      ],
    }
  );

  const page = await context.newPage();

  // Go directly to Indeed India login
  await page.goto("https://in.indeed.com/account/login", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  console.log("==============================================");
  console.log("Browser is open.");
  console.log("1. Click 'Continue with Google'");
  console.log("2. Complete Google Sign-In in the popup");
  console.log("3. Wait until you are fully back on Indeed");
  console.log("4. Then come back here and press ENTER");
  console.log("==============================================");

  await new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.once("data", resolve);
  });

  // Verify session was saved
  const cookies = await context.cookies();
  const indeedCookies = cookies.filter((c) => c.domain.includes("indeed.com"));

  if (indeedCookies.length > 0) {
    console.log(`Session saved! (${indeedCookies.length} Indeed cookies stored)`);
    console.log("You can now run the main automation.");
  } else {
    console.log("WARNING: No Indeed cookies found. Login may not have completed.");
    console.log("Try again and make sure you reach the Indeed homepage after Google login.");
  }

  await context.close();
  process.exit(0);
}

saveSession();