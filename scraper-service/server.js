const express = require("express");
const cors = require("cors");
const multer = require("multer");
const zlib = require("zlib");
const { chromium } = require("playwright");

const app = express();

app.use(cors());
app.use(express.json());

// Set up multer memory storage for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// --- SKILLS & TITLES DICTIONARY ---
const SKILLS_LIST = [
  "React", "React.js", "Angular", "Vue", "Vue.js", "Svelte", "Next.js", "Vite",
  "HTML", "CSS", "JavaScript", "TypeScript", "Tailwind", "TailwindCSS", "Bootstrap",
  "Node", "Node.js", "Express", "Express.js", "NestJS", "Django", "Flask", "FastAPI",
  "Python", "Java", "Spring Boot", "C++", "C#", ".NET", "PHP", "Laravel", "Ruby", "Rails",
  "Go", "Golang", "Rust", "Swift", "Kotlin", "React Native", "Flutter",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "Cassandra",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Git", "GitHub", "Linux",
  "Machine Learning", "Deep Learning", "AI", "NLP", "Data Science", "Pandas", "NumPy",
  "TensorFlow", "PyTorch", "UI/UX", "Figma", "Agile", "Scrum"
];

const JOB_TITLES = [
  "Full Stack Developer", "Full Stack Engineer",
  "Frontend Developer", "Frontend Engineer", "Web Developer",
  "Backend Developer", "Backend Engineer",
  "Software Engineer", "Software Developer",
  "Data Scientist", "Data Analyst", "Machine Learning Engineer",
  "DevOps Engineer", "Cloud Engineer",
  "Mobile Developer", "Android Developer", "iOS Developer",
  "UI/UX Designer", "Product Manager"
];

// --- PDF PARSING & EXTRACTOR HELPERS ---
function extractTextFromPDF(pdfBuffer) {
  let fullText = "";
  
  // 1. Scan the stream blocks (which contain text objects)
  let pos = 0;
  while (true) {
    const streamStart = pdfBuffer.indexOf("stream", pos);
    if (streamStart === -1) break;
    
    let dataStart = streamStart + 6;
    if (pdfBuffer[dataStart] === 0x0d && pdfBuffer[dataStart + 1] === 0x0a) {
      dataStart += 2;
    } else if (pdfBuffer[dataStart] === 0x0a || pdfBuffer[dataStart] === 0x0d) {
      dataStart += 1;
    }
    
    const streamEnd = pdfBuffer.indexOf("endstream", dataStart);
    if (streamEnd === -1) break;
    
    const streamData = pdfBuffer.slice(dataStart, streamEnd);
    let decompressed = null;
    
    // Try inflating with standard zlib header, then try raw deflate
    try {
      decompressed = zlib.inflateSync(streamData);
    } catch (e) {
      try {
        decompressed = zlib.inflateRawSync(streamData);
      } catch (err) {
        // Failed decompression
      }
    }
    
    if (decompressed) {
      const text = decompressed.toString("utf-8");
      // Extract matches within parentheses e.g. (text) Tj
      const matches = text.match(/\(([^)]*)\)/g);
      if (matches) {
        matches.forEach(m => {
          let content = m.substring(1, m.length - 1);
          content = content.replace(/\\([\(\)])/g, '$1').replace(/\\n/g, ' ').replace(/\\r/g, ' ');
          fullText += content + " ";
        });
      }
    } else {
      // If decompression failed, scan uncompressed stream chunk as raw text
      const rawText = streamData.toString("utf-8");
      const matches = rawText.match(/\(([^)]*)\)/g);
      if (matches) {
        matches.forEach(m => {
          let content = m.substring(1, m.length - 1);
          fullText += content + " ";
        });
      }
    }
    
    pos = streamEnd + 9;
  }
  
  // 2. Fallback: scan the entire buffer for simple ASCII strings
  const rawString = pdfBuffer.toString("binary");
  const rawMatches = rawString.match(/\(([^)]*)\)/g);
  if (rawMatches) {
    rawMatches.slice(0, 1500).forEach(m => {
      let content = m.substring(1, m.length - 1);
      // Filter out binary junk by requiring normal characters
      if (/^[a-zA-Z0-9\s\-\.\,\#\+\/]{2,40}$/.test(content)) {
        fullText += " " + content;
      }
    });
  }

  // Clean and deduplicate whitespace
  return fullText.replace(/\s+/g, ' ').trim();
}

function extractSkills(text) {
  const found = [];
  const lowerText = text.toLowerCase();
  
  for (const skill of SKILLS_LIST) {
    let regex;
    if (skill === "C++") {
      regex = /c\+\+/i;
    } else if (skill === ".NET") {
      regex = /\.net/i;
    } else if (skill === "C#") {
      regex = /c\#/i;
    } else {
      regex = new RegExp('\\b' + skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
    }
    
    if (regex.test(lowerText)) {
      found.push(skill);
    }
  }
  
  // Deduplicate and return
  const unique = Array.from(new Set(found));
  // Clean overlaps if both React and React.js are found, etc.
  if (unique.includes("React.js") && unique.includes("React")) {
    unique.splice(unique.indexOf("React.js"), 1);
  }
  if (unique.includes("Vue.js") && unique.includes("Vue")) {
    unique.splice(unique.indexOf("Vue.js"), 1);
  }
  if (unique.includes("Express.js") && unique.includes("Express")) {
    unique.splice(unique.indexOf("Express.js"), 1);
  }
  return unique;
}

function extractJobTitle(text) {
  const lowerText = text.toLowerCase();
  for (const title of JOB_TITLES) {
    const regex = new RegExp('\\b' + title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
    if (regex.test(lowerText)) {
      return title;
    }
  }
  return "Software Engineer"; // fallback
}

function generateAtsAnalysis(text, skills) {
  const lowerText = text.toLowerCase();
  let score = 65; // Base score
  
  const sections = {
    experience: /experience|work|history|employment|professional/i.test(lowerText),
    education: /education|university|college|degree|academic/i.test(lowerText),
    projects: /projects|portfolio|personal projects/i.test(lowerText),
    skillsSection: /skills|abilities|technologies|expertise/i.test(lowerText),
    contact: /contact|email|phone|address|linkedin/i.test(lowerText)
  };
  
  for (const key in sections) {
    if (sections[key]) score += 5;
  }
  
  if (skills.length > 8) score += 12;
  else if (skills.length > 5) score += 8;
  else if (skills.length > 2) score += 4;
  
  if (text.length > 1500) score += 6;
  
  score = Math.min(score, 97); // max cap
  
  const commonKeywords = ["Agile", "CI/CD", "Git", "Docker", "AWS", "Unit Testing", "REST API", "System Design", "Kubernetes"];
  const missingKeywords = commonKeywords.filter(kw => !lowerText.includes(kw.toLowerCase()));
  
  let feedback = "Your resume has a solid foundational structure. ";
  if (skills.length < 5) {
    feedback += "Consider detailing your tech stack with specific languages and frameworks to catch more automated search index queries. ";
  }
  if (!sections.projects) {
    feedback += "Adding a specific 'Projects' section highlighting your role and code repositories (GitHub) will make your resume much more actionable. ";
  }
  if (missingKeywords.length > 0) {
    feedback += `Adding industry-standard keywords like ${missingKeywords.slice(0, 3).join(", ")} could help optimize matching on major recruiters' portals.`;
  }
  
  return {
    score,
    feedback,
    missingKeywords
  };
}

function dedupeJobs(jobs) {
  const seen = new Set();
  return jobs.filter(job => {
    const key = `${job.title}-${job.company}`.toLowerCase().replace(/\s+/g, "");
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// --- BROWSER LAUNCH HELPER ---
async function launchScraperBrowser() {
  const launchOptions = [
    // Option 1: Headless, chrome channel (standard Chrome)
    { headless: true, channel: "chrome", args: ["--disable-blink-features=AutomationControlled"] },
    // Option 2: Headless, default Playwright Chromium
    { headless: true, args: ["--disable-blink-features=AutomationControlled"] },
    // Option 3: Headed, chrome channel (in case headless is blocked or errors)
    { headless: false, channel: "chrome", args: ["--disable-blink-features=AutomationControlled"] },
    // Option 4: Headed, default Playwright Chromium
    { headless: false, args: ["--disable-blink-features=AutomationControlled"] }
  ];

  for (let i = 0; i < launchOptions.length; i++) {
    try {
      const browser = await chromium.launch(launchOptions[i]);
      return browser;
    } catch (e) {
      console.warn(`[Browser Launch] Option ${i + 1} failed: ${e.message}`);
    }
  }
  throw new Error("Failed to launch browser with all configurations");
}

// --- SCRAPERS ---
async function scrapeIndeedJobs(query, location = "India") {
  let browser;
  try {
    browser = await launchScraperBrowser();
    const page = await browser.newPage();
    const url = `https://in.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
    console.log(`[Indeed] Navigating to ${url}`);
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    await page.waitForTimeout(4000);

    const cardCount = await page.locator(".job_seen_beacon").count();
    console.log("[Indeed] Cards found:", cardCount);

    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll(".job_seen_beacon");
      return Array.from(jobCards).slice(0, 20).map(job => {
        const titleLink = job.querySelector("a[data-jk]");
        return {
          title: job.querySelector("h2")?.innerText?.trim() || "Job Title",
          company: job.querySelector("[data-testid='company-name']")?.innerText?.trim() || "Company",
          location: job.querySelector("[data-testid='text-location']")?.innerText?.trim() || "Remote",
          applyLink: titleLink?.href || "#",
          platform: "INDEED"
        };
      });
    });

    await browser.close();
    return jobs;
  } catch (error) {
    console.error("[Indeed] Scrape Error:", error);
    if (browser) await browser.close().catch(() => {});
    return [];
  }
}

async function scrapeLinkedInJobs(query, location = "India") {
  let browser;
  try {
    browser = await launchScraperBrowser();
    const page = await browser.newPage();
    const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;
    console.log(`[LinkedIn] Navigating to ${url}`);
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    await page.waitForTimeout(4000);

    const jobs = await page.evaluate(() => {
      const cards = document.querySelectorAll(".base-card");
      return Array.from(cards).slice(0, 20).map(card => ({
        title: card.querySelector(".base-search-card__title")?.innerText?.trim() || "Job Title",
        company: card.querySelector(".base-search-card__subtitle")?.innerText?.trim() || "Company",
        location: card.querySelector(".job-search-card__location")?.innerText?.trim() || "Remote",
        applyLink: card.querySelector("a")?.href || "#",
        platform: "LINKEDIN"
      }));
    });

    await browser.close();
    return jobs;
  } catch (error) {
    console.error("[LinkedIn] Scrape Error:", error);
    if (browser) await browser.close().catch(() => {});
    return [];
  }
}

async function scrapeNaukriJobs(query, location = "India") {
  let browser;
  try {
    browser = await launchScraperBrowser();
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

    // Incorporate location into keyword search for Naukri query
    const url = `https://www.naukri.com/jobs-in-india?k=${encodeURIComponent(query + " " + location)}`;
    console.log(`[Naukri] Navigating to ${url}`);
    
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    await page.waitForTimeout(4000);
    await page.waitForSelector(".srp-job-tuple, .jobTuple, .cust-job-tuple", { timeout: 15000 }).catch(() => {});

    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll(".srp-job-tuple, .jobTuple, .cust-job-tuple");
      return Array.from(jobCards).slice(0, 20).map(job => {
        const titleEl = job.querySelector("a.title, .title, [class*='title']");
        const companyEl = job.querySelector(".comp-name, .subTitle, [class*='company']");
        const locEl = job.querySelector(".loc-wrap, .locWdth, [class*='location']");
        
        return {
          title: titleEl?.innerText?.trim() || "Job Title",
          company: companyEl?.innerText?.trim() || "Company",
          location: locEl?.innerText?.trim() || "India",
          applyLink: titleEl?.href || "#",
          platform: "NAUKRI"
        };
      });
    });

    await browser.close();
    return jobs;
  } catch (error) {
    console.error("[Naukri] Scrape Error:", error);
    if (browser) await browser.close().catch(() => {});
    return [];
  }
}


// --- API ROUTES ---

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Scraper & Parser Coordinator Service Running" });
});

// Search Jobs endpoint (explicit trigger)
app.get("/jobs", async (req, res) => {
  const { query, location } = req.query;
  const searchLocation = location || "India";
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const [indeedJobs, linkedInJobs, naukriJobs] = await Promise.all([
      scrapeIndeedJobs(query, searchLocation).catch(e => { console.error("Indeed Error:", e); return []; }),
      scrapeLinkedInJobs(query, searchLocation).catch(e => { console.error("LinkedIn Error:", e); return []; }),
      scrapeNaukriJobs(query, searchLocation).catch(e => { console.error("Naukri Error:", e); return []; })
    ]);

    const allJobs = [...indeedJobs, ...linkedInJobs, ...naukriJobs];
    const uniqueJobs = dedupeJobs(allJobs);

    res.json(uniqueJobs);
  } catch (error) {
    console.error("Jobs search error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Resume upload & parsing endpoint
app.post("/api/resume/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const location = req.body.location || "Noida";

  try {
    const pdfBuffer = req.file.buffer;
    
    // Parse resume text and metadata
    const text = extractTextFromPDF(pdfBuffer);
    const skills = extractSkills(text);
    const jobTitle = extractJobTitle(text);
    const atsAnalysis = generateAtsAnalysis(text, skills);

    console.log(`[Upload] Resume parsed. Title: "${jobTitle}", Skills: [${skills.join(", ")}]`);

    // Scrape matching jobs
    console.log(`[Upload] Scraping matching jobs for: "${jobTitle}" in location "${location}"`);
    const [indeedJobs, linkedInJobs, naukriJobs] = await Promise.all([
      scrapeIndeedJobs(jobTitle, location).catch(e => { console.error("Indeed Error:", e); return []; }),
      scrapeLinkedInJobs(jobTitle, location).catch(e => { console.error("LinkedIn Error:", e); return []; }),
      scrapeNaukriJobs(jobTitle, location).catch(e => { console.error("Naukri Error:", e); return []; })
    ]);

    const allJobs = [...indeedJobs, ...linkedInJobs, ...naukriJobs];
    const uniqueJobs = dedupeJobs(allJobs);

    // Calculate match score and attach relative skills for each job
    const matchedJobs = uniqueJobs.map(job => {
      const jobSkills = skills.filter(s => 
        job.title.toLowerCase().includes(s.toLowerCase())
      );

      // Score matching
      let score = 70;
      const lowerTitle = job.title.toLowerCase();
      let matchCount = 0;
      for (const skill of skills) {
        if (lowerTitle.includes(skill.toLowerCase())) {
          matchCount++;
        }
      }
      score += matchCount * 5;
      score = Math.min(score, 99);

      return {
        ...job,
        matchScore: score,
        skills: jobSkills.length > 0 ? jobSkills : skills.slice(0, 3)
      };
    });

    res.json({
      skills,
      matchedJobs,
      atsAnalysis
    });

  } catch (error) {
    console.error("Resume processing failed:", error);
    res.status(500).json({ error: "Failed to parse resume and match jobs" });
  }
});

// Proxy to Playwright Automation Service
app.post("/api/automation/apply", async (req, res) => {
  try {
    console.log("[Proxy Apply] Forwarding request to automation-service (port 7000)");
    const response = await fetch("http://localhost:7000/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("[Proxy Apply] Error forwarding apply request:", error);
    res.status(500).json({ error: "Failed to forward application to automation service" });
  }
});

// Interview prep questions generator endpoint
app.post("/api/interview/questions", (req, res) => {
  const { jobTitle, company, skills } = req.body;
  const techSkills = skills || ["JavaScript", "React", "Node.js"];

  const questions = [
    {
      category: "Technical - Core Frameworks",
      question: `How would you optimize a high-performance rendering list or backend query execution using ${techSkills[0] || "modern frameworks"}?`,
      difficulty: "Hard"
    },
    {
      category: "Technical - Integration & APIs",
      question: `Explain how you would design a rate limiter or cached API gateway using ${techSkills[1] || "Node.js"} and what strategy you would use to scale it.`,
      difficulty: "Medium"
    },
    {
      category: "System Design",
      question: `How would you architect a real-time event-driven job status tracker utilizing a stack based on ${techSkills.join(", ")}?`,
      difficulty: "Hard"
    },
    {
      category: "Behavioral & Experience",
      question: `Describe a challenging project where you integrated ${techSkills[0] || "modern tooling"} at ${company || "your last job"}. What bottlenecks did you run into and how did you resolve them?`,
      difficulty: "Medium"
    },
    {
      category: "Coding & Algorithms",
      question: `Given a stream of active job listings, how would you design an in-memory deduplication algorithm to filter out duplicate postings in O(1) space complexity?`,
      difficulty: "Hard"
    }
  ];

  res.json(questions);
});

// Bulk Apply action
app.post("/api/jobs/bulk-apply", async (req, res) => {
  const jobs = req.body;

  if (!jobs || jobs.length === 0) {
    return res.status(400).json({ error: "No jobs provided" });
  }

  try {
    const browser = await chromium.launch({ headless: false });

    for (const job of jobs) {
      const page = await browser.newPage();
      const applyLink = job.applyLink || job.url || job.link || "#";

      if (applyLink !== "#") {
        try {
          await page.goto(applyLink, {
            waitUntil: "commit", // load faster
            timeout: 15000
          });
          console.log(`Opened: ${job.title} - ${applyLink}`);
        } catch (error) {
          console.log(`Failed to open ${applyLink}: ${error.message}`);
        }
      }
    }

    // Auto-close after 5 minutes
    setTimeout(() => {
      browser.close().catch(() => {});
    }, 300000);

    res.json({
      success: true,
      message: `Started applying to ${jobs.length} jobs`,
      jobsCount: jobs.length,
      jobs: jobs.map(j => ({
        title: j.title,
        company: j.company,
        applyLink: j.applyLink || j.url || j.link
      }))
    });

  } catch (error) {
    console.error("[Bulk Apply] Error:", error);
    res.status(500).json({
      error: "Bulk apply failed",
      details: error.message
    });
  }
});

const server = app.listen(8081, () => {
  console.log("Scraper & Parsing Coordinator Server running on port 8081");
});

server.on("error", (err) => {
  console.error("SERVER ERROR EVENT:", err);
});

server.on("close", () => {
  console.log("SERVER CLOSED EVENT");
});

process.on("exit", (code) => {
  console.log(`PROCESS EXIT EVENT: code is ${code}`);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
});