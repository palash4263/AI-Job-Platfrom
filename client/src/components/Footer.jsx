import { useState, useEffect } from "react";

const NAV_LINKS = {
  Product: ["Dashboard", "Resume AI", "Job Matching", "Analytics", "ATS Checker"],
  Company: ["About Us", "Blog", "Careers", "Press Kit", "Contact"],
  Resources: ["Documentation", "API Access", "Templates", "Community", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
};

const SOCIALS = [
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.261 5.635L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.112 18.1.13 18.115a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const footer = document.getElementById("applyking-footer");
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setGlowPos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        #applyking-footer {
          font-family: 'DM Sans', sans-serif;
          background: #080d14;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(0, 210, 255, 0.08);
        }

        .footer-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 195, 255, 0.04) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          transition: top 0.6s ease, left 0.6s ease;
        }

        .footer-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,195,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,195,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, transparent, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 70%, transparent);
        }

        .footer-top-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 48px 64px 0;
          position: relative;
          z-index: 2;
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 26px;
          letter-spacing: -0.5px;
          color: #fff;
        }

        .brand-name span {
          color: #00c8ff;
        }

        .ai-badge {
          background: linear-gradient(135deg, #00c8ff22, #0066ff22);
          border: 1px solid rgba(0, 200, 255, 0.3);
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: #00c8ff;
          text-transform: uppercase;
        }

        .footer-tagline {
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.3px;
          margin-top: 6px;
          padding: 0 64px;
          position: relative;
          z-index: 2;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 1.4fr repeat(4, 1fr);
          gap: 0;
          padding: 48px 64px 0;
          position: relative;
          z-index: 2;
        }

        .footer-newsletter {
          padding-right: 48px;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .newsletter-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #00c8ff;
          margin-bottom: 12px;
        }

        .newsletter-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 12px;
        }

        .newsletter-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .input-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .email-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 11px 16px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .email-input::placeholder { color: rgba(255,255,255,0.25); }
        .email-input:focus { border-color: rgba(0, 200, 255, 0.4); }

        .subscribe-btn {
          background: linear-gradient(135deg, #00c8ff, #0070f3);
          border: none;
          border-radius: 10px;
          padding: 11px 20px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          width: 100%;
        }

        .subscribe-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        .subscribed-msg {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #00c8ff;
          font-size: 13px;
          font-weight: 500;
          padding: 11px 16px;
          background: rgba(0,200,255,0.06);
          border: 1px solid rgba(0,200,255,0.2);
          border-radius: 10px;
        }

        .footer-col {
          padding: 0 32px;
        }

        .col-heading {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 20px;
        }

        .col-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .col-links li a {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 400;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .col-links li a:hover {
          color: #fff;
        }

        .col-links li a::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #00c8ff;
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
          transform: scale(0);
        }

        .col-links li a:hover::before {
          opacity: 1;
          transform: scale(1);
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,195,255,0.1) 30%, rgba(0,195,255,0.1) 70%, transparent);
          margin: 48px 64px 0;
          position: relative;
          z-index: 2;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 64px 40px;
          position: relative;
          z-index: 2;
        }

        .copyright {
          font-size: 12.5px;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.2px;
        }

        .copyright strong {
          color: rgba(255,255,255,0.45);
          font-weight: 500;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(0,255,128,0.05);
          border: 1px solid rgba(0,255,128,0.15);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 11.5px;
          color: rgba(0,255,128,0.7);
          font-weight: 500;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00ff80;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,255,128,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(0,255,128,0); }
        }

        .socials {
          display: flex;
          gap: 8px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
        }

        .social-link:hover {
          background: rgba(0,200,255,0.1);
          border-color: rgba(0,200,255,0.25);
          color: #00c8ff;
          transform: translateY(-2px);
        }

        .bottom-features {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 64px 32px;
          position: relative;
          z-index: 2;
        }

        .feature-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: rgba(255,255,255,0.3);
          font-weight: 400;
        }

        .feature-chip svg {
          color: rgba(0,200,255,0.6);
        }

        .chip-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
        }

        @media (max-width: 900px) {
          .footer-main { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-newsletter { border-right: none; padding-right: 0; }
          .footer-top-bar, .footer-tagline, .footer-main,
          .footer-divider, .footer-bottom, .bottom-features { padding-left: 24px; padding-right: 24px; }
          .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <footer id="applyking-footer">
        {/* Ambient glow that follows mouse */}
        <div
          className="footer-glow"
          style={{ left: `${glowPos.x}%`, top: `${glowPos.y}%` }}
        />
        {/* Grid texture */}
        <div className="footer-grid-bg" />

        {/* Brand */}
        <div className="footer-top-bar">
          <div className="brand-name">
            Apply<span>King</span>
          </div>
          <div className="ai-badge">AI</div>
        </div>
        <p className="footer-tagline">Your AI-powered career command centre.</p>

        {/* Main columns */}
        <div className="footer-main">
          {/* Newsletter */}
          <div className="footer-newsletter">
            <div className="newsletter-label">Stay ahead</div>
            <div className="newsletter-heading">
              Jobs delivered<br />to your inbox
            </div>
            <p className="newsletter-sub">
              Get AI-curated roles matched to your résumé every week. Zero spam.
            </p>
            <div className="input-row">
              {subscribed ? (
                <div className="subscribed-msg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  You're on the list!
                </div>
              ) : (
                <>
                  <input
                    className="email-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  />
                  <button className="subscribe-btn" onClick={handleSubscribe}>
                    Subscribe →
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(NAV_LINKS).map(([heading, links]) => (
            <div className="footer-col" key={heading}>
              <div className="col-heading">{heading}</div>
              <ul className="col-links">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" onMouseEnter={() => setHoveredLink(link)} onMouseLeave={() => setHoveredLink(null)}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Feature chips */}
        <div className="bottom-features" style={{ marginTop: 36 }}>
          {[
            { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, text: "SOC 2 Compliant" },
            { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, text: "Private processing" },
            { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, text: "Real-time matching" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="feature-chip">
                {f.icon}
                {f.text}
              </div>
              {i < 3 && <div className="chip-sep" />}
            </div>
          ))}
        </div>

        <div className="footer-divider" />

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2026 <strong>ApplyKing</strong>. All rights reserved. Built for job seekers, by AI.
          </p>

          <div className="status-pill">
            <div className="status-dot" />
            All systems operational
          </div>

          <div className="socials">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} className="social-link" title={s.name} aria-label={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}