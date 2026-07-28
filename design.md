# System Design Document - AI Job Platform

This document describes the design architecture, visual system, data flow, and component specifications for the **AI Job Platform**.

---

## 1. Design System & Visual Aesthetics

The application implements a premium, interactive **Cyberpunk/Sci-Fi Neon** design system, designed to feel alive, modern, and high-tech.

### 1.1 Color Palette
The CSS system utilizes custom HSL and hex variables defined in `:root`:

| Variable | Color Representation | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--bg` | Deep Space Black | `#010409` | Base application background |
| `--cyan` | Neon Cyan | `#00f5ff` | Highlighting, primary borders, and active status |
| `--purple` | Cyber Purple | `#7c3aed` | Accents, branding elements, and medium scores |
| `--green` | Matrix Green | `#00ff88` | Success states, high ATS match scores |
| `--red` | Laser Red | `#ff0055` | Error alerts, dangerous actions, and low scores |
| `--panel` | Glassmorphic Cyan | `rgba(0,245,255,0.03)` | Card/panel base background |
| `--border` | Subtle Cyan Glow | `rgba(0,245,255,0.15)` | Static panel borders |
| `--border2`| High Glow Cyan | `rgba(0,245,255,0.28)` | Hover/focused panel borders |

### 1.2 Typography
Custom Google Fonts are loaded dynamically:
- **Display Font (`--font-display`)**: `Orbitron`, sans-serif. Used for headers, telemetry numbers, and primary navigation buttons.
- **Body Font (`--font-body`)**: `Rajdhani`, sans-serif. Used for job details, descriptions, lists, and form content.
- **Monospace Font (`--font-mono`)**: `Share Tech Mono`, monospace. Used for live system logs, scrapers console output, and network diagnostics.

### 1.3 Key CSS Animations & Micro-Interactions
- **Scanlines (`scanline`)**: A translucent overlay scanning from top to bottom of the viewport to establish the CRT terminal feel.
- **Neon Pulse (`neonPulse`)**: Softly pulses box-shadow glow around active components.
- **Flicker (`flicker`)**: Subtle random opacity variations on titles to mimic terminal hardware.
- **Orbit Float (`orbFloat`)**: Interactive vector particles floating behind dashboard cards to simulate depth.

---

## 2. API Design & Data Schemas

The system coordinates three independent services over local networking.

```
       +---------------------------------------------+
       |             React / Vite Client             |
       +----------------------+----------------------+
                              |
         POST /upload-resume  |  POST /apply
         (Multipart File)     |  (JSON Body)
                              v
    +-------------------------+-------------------------+
    |                                                   |
    v                                                   v
+-----------------------------+   +-----------------------------+
|    Scraper Service (5000)   |   |   Automation Service (7000) |
+-----------------------------+   +-----------------------------+
| - Scraping Indeed/LinkedIn  |   | - Session loader (auth.json)|
| - PDF parsing (zlib stream) |   | - Playwright chrome browser |
| - ATS scoring algorithm     |   | - Easy-apply form filler    |
+-----------------------------+   +-----------------------------+
```

### 2.1 Scraper Service (Port 5000)
- **`GET /`**
  - **Description**: Verification endpoint confirming service status.
- **`POST /scrape`**
  - **Request Body**: `{"query": "React Developer"}`
  - **Response**: List of scraped jobs:
    ```json
    [
      {
        "title": "React JS Developer",
        "company": "Tech Solutions",
        "location": "Mumbai, India",
        "applyLink": "https://in.indeed.com/...",
        "platform": "INDEED"
      }
    ]
    ```
- **`POST /upload-resume`**
  - **Request Type**: `multipart/form-data` (Multer memory upload)
  - **Response**: Calculated metrics:
    ```json
    {
      "success": true,
      "score": 85,
      "feedback": "Your resume has a strong match for React developer positions.",
      "missingKeywords": ["Docker", "Kubernetes", "Next.js"]
    }
    ```

### 2.2 Automation Service (Port 7000)
- **`POST /apply`**
  - **Request Body**: `{"applyLink": "https://in.indeed.com/rc/clk?jk=...", "title": "React JS Developer", "company": "Tech Solutions"}`
  - **Response**: Status of application:
    ```json
    {
      "success": true,
      "result": {
        "applied": true,
        "message": "Form completed successfully"
      }
    }
    ```

---

## 3. Core Implementation Details

### 3.1 Custom PDF Parser (Zero-Dependency)
To avoid bulky node-gyp native packages like pdf-parse, the scraper service uses a custom parser:
1. Scans raw PDF buffers for block streams starting with `stream` and ending with `endstream`.
2. Attempts decompression using Node's native `zlib.inflateSync` (Standard FlateDecode) and fallback `zlib.inflateRawSync` (Raw Deflate).
3. Parses resulting text extraction matches using parentheses filters `\(([^)]*)\)` and strips slash escaped controls.
4. If compression is absent, it parses ASCII characters straight from raw buffers.

### 3.2 Automated Session Management & Anti-Detection
Applying automatically via Playwright requires mimicking human interaction to bypass cloudflare/antibot security:
- **Persistent Context**: Uses `chromium.launchPersistentContext` pointing to local Chrome profile directory (`C:/playwright-profile`).
- **User Agent Evasion**: Explicitly removes `--disable-blink-features=AutomationControlled` argument and injects stealth parameters to mimic a genuine browser instance.
- **Slow Motion**: Enforces a `slowMo` delay (300-400ms) on clicks, typing, and page navigation to prevent bot flags.
