const express = require("express");
const cors = require("cors");

const { chromium } = require("playwright");

const app = express();

app.use(cors());

app.use(express.json());


// TEST API
app.get("/", (req, res) => {

  res.json({
    message:
      "Scraper Service Running"
  });

});


// SCRAPE JOBS
app.get("/jobs", async (req, res) => {

  const { query } = req.query;

  try {

    const browser =
      await chromium.launch({
        headless: false,
      });

    const page =
      await browser.newPage();

    // Example:
    // Indeed Search

    await page.goto(
      `https://in.indeed.com/jobs?q=${query}`
    );

    await page.waitForTimeout(5000);

    // Extract jobs
    const jobs =
      await page.evaluate(() => {

        const jobCards =
          document.querySelectorAll(
            ".job_seen_beacon"
          );

        return Array.from(jobCards)
          .slice(0, 10)
          .map((job) => {

            const titleLink = job.querySelector(
              "a[data-jk]"
            );

            return {

              title:
                job.querySelector(
                  "h2"
                )?.innerText,

              company:
                job.querySelector(
                  "[data-testid='company-name']"
                )?.innerText,

              location:
                job.querySelector(
                  "[data-testid='text-location']"
                )?.innerText,

              applyLink:
                titleLink?.href || "#",

              platform: "INDEED",

              matchScore: 80,

              skills: [],

            };
          });
      });

    await browser.close();

    res.json(jobs);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Scraping failed"
    });
  }
});


app.listen(5000, () => {

  console.log(
    "Scraper running on port 5000"
  );

});