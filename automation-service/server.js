const express = require("express");
const cors = require("cors");

const { chromium } =
  require("playwright");

const {
  applyIndeedJob,
} = require("./indeedBot");

const app = express();

app.use(cors());

app.use(express.json());

let browserContext = null;

// CREATE ONE SHARED BROWSER
async function getBrowser() {

  if (!browserContext) {

    browserContext =
      await chromium.launchPersistentContext(
        "C:/playwright-profile",
        {
          headless: false,

          channel: "chrome",

          slowMo: 300,

          args: [
            "--disable-blink-features=AutomationControlled",
          ],
        }
      );

    console.log(
      "Shared Browser Started"
    );
  }

  return browserContext;
}

app.post(
  "/apply",
  async (req, res) => {

    try {

      console.log(
        "Incoming Request:"
      );

      console.log(req.body);

      const context =
        await getBrowser();

      const result =
        await applyIndeedJob(
          context,
          req.body
        );

      res.json({
        success: true,
        result,
      });

    } catch (error) {

      console.log(
        "FULL ERROR:"
      );

      console.log(error);

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

app.listen(7000, () => {

  console.log(
    "Automation Service Running on 7000"
  );
});