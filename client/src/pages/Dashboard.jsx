import { useState, useRef } from "react";
import "./Dashboard.css";
import { uploadResume } from "../api/resumeApi";

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { label: "Dashboard", icon: "⬡" },
  { label: "Recommended", icon: "✦" },
  { label: "Resume AI", icon: "◈" },
  { label: "Analytics", icon: "⬡" },
  { label: "Settings", icon: "◎" },
];

const STATS = (jobs) => [
  { label: "Matched Jobs", value: jobs, sub: "AI-ranked for you", accent: "#22d3ee" },
  { label: "Applied", value: 38, sub: "This month", accent: "#a78bfa" },
  { label: "ATS Score", value: "92%", sub: "Optimisation", accent: "#34d399" },
  { label: "Interviews", value: 12, sub: "Scheduled", accent: "#fb923c" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const scoreColor = (s) =>
  s >= 90 ? "#34d399" : s >= 80 ? "#22d3ee" : "#fb923c";

const getJobTitle = (job) => job.title || job.role || "Job";

const getApplyUrl = (job) => {
  const rawUrl = job.applyLink || job.url || job.link;

  if (rawUrl && rawUrl !== "#") {
    try {
      return new URL(rawUrl, window.location.origin).href;
    } catch {
      // Use a search URL if the backend returns an invalid link.
    }
  }

  const query = [getJobTitle(job), job.company, job.location]
    .filter(Boolean)
    .join(" ");

  return `https://www.google.com/search?q=${encodeURIComponent(`${query} job apply`)}`;
};

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div className="section-label">
      <div className="section-label-bar" />
      <h2 className="section-label-text">{children}</h2>
    </div>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-accent" style={{ background: accent }} />
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: accent }}>{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

function JobCard({ job, index }) {

  const color =
    scoreColor(job.matchScore || 80);
  const applyUrl = getApplyUrl(job);

  return (

    <div className="job-card">

      <div className="rank-badge">
        #{index + 1}
      </div>

      {/* HEADER */}
      <div className="job-header">

        <div>

          {/* TITLE */}
          <div className="job-role">
            {getJobTitle(job)}
          </div>

          {/* COMPANY */}
          <div className="job-company">
            {job.company}
          </div>

          {/* LOCATION */}
          <div
            style={{
              color: "#94a3b8",
              marginTop: "6px",
              fontSize: "14px"
            }}
          >
            {job.location}
          </div>

        </div>

        {/* MATCH SCORE */}
        <div
          className="match-score"
          style={{
            color,
            borderColor: color + "44"
          }}
        >
          {job.matchScore || 80}%
        </div>

      </div>

      {/* MATCH BAR */}
      <div className="match-bar-bg">

        <div
          className="match-bar-fill"
          style={{
            width: `${job.matchScore || 80}%`,
            background: color
          }}
        />

      </div>

      {/* PLATFORM */}
      <div className="platform">
        {job.platform || "INDEED"}
      </div>

      {/* SKILLS */}
      {job.skills && (
        <div className="job-skills-row">

          {job.skills.map((sk, j) => (

            <span
              key={j}
              className="job-skill"
            >
              {sk}
            </span>

          ))}

        </div>
      )}

      {/* APPLY BUTTON */}
      <a
        href={applyUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Apply for ${getJobTitle(job)} at ${job.company || "company"}`}
        style={{
          textDecoration: "none",
          display: "block"
        }}
      > 

        <span
          className="
          block w-full mt-6 text-center
          py-4 rounded-2xl
          bg-gradient-to-r
          from-cyan-400
          to-indigo-500
          font-bold
          text-black
          hover:scale-[1.02]
          transition-all duration-300
          shadow-lg shadow-cyan-500/20
          "
        >
          Apply Now →
        </span>

      </a>

    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [active, setActive] = useState(0);
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  const handleFile =
  async (file) => {

    if (!file) return;

    setResume(file);

    setLoading(true);

    try {

      console.log(
        "Uploading..."
      );

      const data =
        await uploadResume(file);

      console.log(data);

      setSkills(data.skills);

      setJobs(
        data.matchedJobs
      );

    } catch (e) {

      console.error(e);

    } finally {

      setLoading(false);
    }
};

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="root">
      {/* ── background effects ── */}
      <div className="grain" />
      <div className="mesh" />

      {/* ── sidebar ── */}
      <aside className="sidebar">
        <div className="logo">
          Apply<span className="logo-cyan">King</span>
          <span className="logo-badge">AI</span>
        </div>

        <nav className="nav">
          {NAV.map((n, i) => (
            <button
              key={n.label}
              onClick={() => setActive(i)}
              className={`nav-item${active === i ? " active" : ""}`}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
              {active === i && <span className="nav-pip" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">JD</div>
          <div>
            <div className="footer-name">Jane Doe</div>
            <div className="footer-email">jane@email.com</div>
          </div>
        </div>
      </aside>

      {/* ── main ── */}
      <main className="main">
        {/* topbar */}
        <header className="topbar">
          <div>
            <div className="greeting">Welcome back, Jane 👋</div>
            <div className="greeting-sub">Here's your AI career command centre.</div>
          </div>
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input placeholder="Search jobs, skills…" className="search-input" />
          </div>
        </header>

        {/* content */}
        <div className="content">

          {/* hero heading */}
          <div className="hero-row">
            <div>
              <h1 className="h1">AI Career Dashboard</h1>
              <p className="h1-sub">Upload your résumé and discover perfectly-matched jobs in seconds.</p>
            </div>
            <div className="hero-badge">
              <span className="hero-badge-icon">◈</span>
              <span className="hero-badge-text">POWERED BY AI</span>
            </div>
          </div>

          {/* upload zone */}
          <div
            className={`upload-zone${drag ? " drag" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="upload-icon">{resume ? "✔" : "↑"}</div>
            {resume ? (
              <div style={{ textAlign: "center" }}>
                <div className="upload-success-title">{resume.name}</div>
                <div className="upload-subtitle">Resume uploaded — click to replace</div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div className="upload-title">Drag & drop your résumé</div>
                <div className="upload-subtitle">PDF, DOC, DOCX · Click to browse</div>
              </div>
            )}
          </div>

          {/* loading bar */}
          {loading && (
            <div className="loading-bar">
              <div className="loading-fill" />
              <span className="loading-text">Analysing résumé with AI…</span>
            </div>
          )}

          {/* extracted skills */}
          {skills.length > 0 && (
            <section className="skills-section">
              <SectionLabel>Extracted Skills</SectionLabel>
              <div className="skills-row">
                {skills.map((s, i) => (
                  <span key={i} className="skill-pill">{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* stat cards */}
          <div className="stats-grid">
            {STATS(jobs.length).map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* job cards */}
          {jobs.length > 0 && (
            <section className="jobs-section">
              <SectionLabel>AI Recommended Jobs</SectionLabel>
              <p className="jobs-subtitle">Ranked by résumé match score</p>
              <div className="jobs-grid">
                {jobs.map((job, i) => (
                  <JobCard key={i} job={job} index={i} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
