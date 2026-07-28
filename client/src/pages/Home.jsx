import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── Google Fonts + global keyframes injected once ── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --cyan:   #00f5ff;
    --blue:   #0066ff;
    --purple: #7c3aed;
    --green:  #00ff88;
    --red:    #ff0055;
    --bg:     #010409;
    --panel:  rgba(0, 245, 255, 0.03);
    --border: rgba(0, 245, 255, 0.15);
  }

  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes flicker {
    0%,100%{ opacity:1; } 92%{ opacity:1; } 93%{ opacity:0.6; } 95%{ opacity:1; } 96%{ opacity:0.8; } 97%{ opacity:1; }
  }
  @keyframes glitch {
    0%,100%{ clip-path:none; transform:none; }
    20%{ clip-path:polygon(0 10%,100% 10%,100% 30%,0 30%); transform:translateX(-3px); }
    40%{ clip-path:polygon(0 55%,100% 55%,100% 70%,0 70%); transform:translateX(3px); }
    60%{ clip-path:polygon(0 80%,100% 80%,100% 90%,0 90%); transform:translateX(-2px); }
    80%{ clip-path:none; transform:none; }
  }
  @keyframes glitchColor {
    0%,100%{ opacity:0; }
    20%,40%,60%{ opacity:0.6; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideRight {
    from { opacity:0; transform:translateX(-30px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(40px) rotateX(8deg); }
    to   { opacity:1; transform:translateY(0) rotateX(0); }
  }
  @keyframes neonPulse {
    0%,100%{ box-shadow: 0 0 6px var(--cyan), 0 0 20px rgba(0,245,255,0.3); }
    50%    { box-shadow: 0 0 12px var(--cyan), 0 0 50px rgba(0,245,255,0.6), 0 0 80px rgba(0,245,255,0.2); }
  }
  @keyframes borderTrace {
    0%   { stroke-dashoffset: 1000; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes dataPulse {
    0%,100%{ opacity:0.3; transform:scaleY(1); }
    50%    { opacity:1;   transform:scaleY(1.4); }
  }
  @keyframes orbFloat {
    0%,100%{ transform:translate(0,0) scale(1); }
    33%    { transform:translate(20px,-15px) scale(1.05); }
    66%    { transform:translate(-10px,10px) scale(0.97); }
  }
  @keyframes typeIn {
    from { width:0; }
    to   { width:100%; }
  }
  @keyframes blink {
    0%,100%{ opacity:1; } 50%{ opacity:0; }
  }
  @keyframes radarSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ping {
    0%,100%{ opacity:1; transform:scale(1); }
    50%    { opacity:0.3; transform:scale(1.6); }
  }
  @keyframes circuitFlow {
    0%   { stroke-dashoffset: 200; opacity:0; }
    10%  { opacity:1; }
    90%  { opacity:1; }
    100% { stroke-dashoffset: 0; opacity:0; }
  }
  @keyframes countUp {
    from { opacity:0; transform:scale(0.7) translateY(10px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes shimmer {
    from { transform:translateX(-200%); }
    to   { transform:translateX(200%); }
  }
  @keyframes hologramShift {
    0%,100%{ transform:translateY(0); opacity:1; }
    50%    { transform:translateY(-2px); opacity:0.85; }
  }

  .glitch-layer {
    position:absolute; inset:0;
    animation: glitch 6s infinite, glitchColor 6s infinite;
    pointer-events:none;
  }
  .neon-border { animation: neonPulse 2.5s ease-in-out infinite; }
  .job-row:hover {
    border-color: rgba(0,245,255,0.5) !important;
    background: rgba(0,245,255,0.06) !important;
    transform: translateX(6px) !important;
    box-shadow: 4px 0 20px rgba(0,245,255,0.15) !important;
  }
  .cta-primary:hover { transform:translateY(-2px) scale(1.03); }
  .cta-primary:hover .cta-shine { animation: shimmer 0.7s ease; }
  .cta-secondary:hover {
    border-color: rgba(0,245,255,0.6) !important;
    background: rgba(0,245,255,0.08) !important;
    transform: translateY(-2px);
  }
  html { scroll-behavior: smooth; }
`;

/* ── Data ── */
const jobs = [
  { title: "AI Software Engineer",   sub: "Remote · Full Time",    match: 94, hot: true  },
  { title: "Frontend Engineer",      sub: "Remote · Full Time",    match: 90, hot: false },
  { title: "React Developer",        sub: "Remote · Full Time",    match: 87, hot: false },
];

const stats = [
  { value: "10K+", label: "Active Jobs",    icon: "◈" },
  { value: "95%",  label: "Match Accuracy", icon: "◉" },
  { value: "5+",   label: "Platforms",      icon: "◫" },
];

/* ── Helpers ── */
function useTypingEffect(text, speed = 60, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return displayed;
}

/* ── Sub-components ── */

function ScanlineOverlay() {
  return (
    <div style={{
      position:"fixed", inset:0, pointerEvents:"none", zIndex:999,
      overflow:"hidden",
    }}>
      {/* Moving scanline */}
      <div style={{
        position:"absolute", left:0, right:0, height:"2px",
        background:"linear-gradient(transparent, rgba(0,245,255,0.06), transparent)",
        animation:"scanline 4s linear infinite",
      }}/>
      {/* CRT horizontal lines */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
        pointerEvents:"none",
      }}/>
      {/* Vignette */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
      }}/>
    </div>
  );
}

function CircuitSVG() {
  return (
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",overflow:"visible"}} xmlns="http://www.w3.org/2000/svg">
      {[
        "M 0 200 L 80 200 L 80 120 L 220 120",
        "M 0 400 L 60 400 L 60 340 L 180 340 L 180 280",
        "M 100% 150 L calc(100% - 80px) 150 L calc(100% - 80px) 80 L calc(100% - 220px) 80",
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(0,245,255,0.25)" strokeWidth="1"
          strokeDasharray="200" strokeDashoffset="200"
          style={{ animation:`circuitFlow ${3 + i}s ${i * 1.5}s linear infinite` }}
        />
      ))}
      {/* Nodes */}
      {[[80,200],[180,340],[60,400]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3" fill="var(--cyan)" opacity="0.6"
          style={{ animation:`ping ${1.5 + i * 0.5}s ${i*0.7}s ease-in-out infinite` }} />
      ))}
    </svg>
  );
}

function RadarRing() {
  return (
    <div style={{position:"relative", width:"120px", height:"120px", flexShrink:0}}>
      {[1,0.7,0.4].map((o,i)=>(
        <div key={i} style={{
          position:"absolute", inset:`${i*15}px`, borderRadius:"50%",
          border:"1px solid rgba(0,245,255," + o*0.3 + ")",
        }}/>
      ))}
      <div style={{
        position:"absolute", inset:0, borderRadius:"50%",
        overflow:"hidden",
      }}>
        <div style={{
          position:"absolute", inset:0,
          background:"conic-gradient(from 0deg, transparent 0deg, rgba(0,245,255,0.3) 60deg, transparent 60deg)",
          animation:"radarSpin 3s linear infinite",
        }}/>
      </div>
      <div style={{
        position:"absolute", inset:"50%", transform:"translate(-50%,-50%)",
        width:"6px", height:"6px", borderRadius:"50%",
        background:"var(--cyan)",
        boxShadow:"0 0 10px var(--cyan), 0 0 30px rgba(0,245,255,0.5)",
        animation:"ping 1.5s ease-in-out infinite",
      }}/>
    </div>
  );
}

function DataBars() {
  const heights = [30,50,70,45,80,55,65,40,75,60,85,50];
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:"3px",height:"40px",opacity:0.7}}>
      {heights.map((h,i)=>(
        <div key={i} style={{
          width:"4px", height:`${h}%`, borderRadius:"2px",
          background:`linear-gradient(to top, var(--cyan), rgba(0,245,255,0.3))`,
          animation:`dataPulse ${0.8 + i*0.1}s ${i*0.08}s ease-in-out infinite`,
        }}/>
      ))}
    </div>
  );
}

function HUDBadge() {
  const cmd = useTypingEffect(">> SYS.AI_MATCH_ENGINE v4.2 [ONLINE]", 45, 300);
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:"12px",
      padding:"8px 20px", borderRadius:"4px",
      border:"1px solid rgba(0,245,255,0.3)",
      background:"rgba(0,245,255,0.04)",
      backdropFilter:"blur(10px)",
      marginBottom:"2rem",
      opacity:0, animation:"fadeUp 0.5s 0.1s ease forwards",
    }}>
      <div style={{
        width:"8px", height:"8px", borderRadius:"50%",
        background:"var(--green)",
        boxShadow:"0 0 8px var(--green)",
        animation:"ping 1s ease-in-out infinite",
      }}/>
      <span style={{
        fontFamily:"'Share Tech Mono', monospace",
        fontSize:"11px", color:"var(--cyan)",
        letterSpacing:"0.12em",
        overflow:"hidden", whiteSpace:"nowrap",
      }}>
        {cmd}
        <span style={{animation:"blink 0.8s step-end infinite"}}>_</span>
      </span>
    </div>
  );
}

function GlitchTitle() {
  const text1 = "FIND YOUR";
  const text2 = "DREAM JOB";
  const layers = [
    { color:"#ff0055", offset:"-3px" },
    { color:"#00ff88", offset:"3px" },
  ];
  return (
    <div style={{ marginBottom:"1.5rem", lineHeight:1, position:"relative" }}>
      {/* Line 1 */}
      <div style={{
        fontFamily:"'Orbitron', sans-serif",
        fontWeight:400,
        fontSize:"clamp(1.4rem, 3.5vw, 2.4rem)",
        color:"rgba(200,230,255,0.7)",
        letterSpacing:"0.3em",
        opacity:0, animation:"slideRight 0.7s 0.4s ease forwards",
        marginBottom:"0.3rem",
      }}>
        {text1}
      </div>

      {/* Line 2 — glitch */}
      <div style={{ position:"relative", display:"inline-block" }}>
        <span style={{
          fontFamily:"'Orbitron', sans-serif",
          fontWeight:900,
          fontSize:"clamp(2.4rem, 6vw, 5rem)",
          letterSpacing:"0.08em",
          background:"linear-gradient(135deg, #00f5ff 0%, #0066ff 50%, #7c3aed 100%)",
          WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent",
          display:"block",
          opacity:0, animation:"fadeUp 0.8s 0.6s ease forwards",
          filter:"drop-shadow(0 0 30px rgba(0,245,255,0.4))",
        }}>
          {text2}
        </span>
        {/* Ghost layers */}
        {layers.map(({color, offset}, i) => (
          <span key={i} style={{
            fontFamily:"'Orbitron', sans-serif",
            fontWeight:900,
            fontSize:"clamp(2.4rem, 6vw, 5rem)",
            letterSpacing:"0.08em",
            color, position:"absolute", top:0,
            left: i === 0 ? offset : "auto",
            right: i === 1 ? offset : "auto",
            opacity:0,
            animation:`glitch 7s ${i * 0.5}s infinite, glitchColor 7s ${i*0.5}s infinite`,
            pointerEvents:"none", userSelect:"none",
          }}>
            {text2}
          </span>
        ))}

        {/* Underline circuit */}
        <svg style={{
          position:"absolute", bottom:"-6px", left:0, width:"100%", height:"4px",
          overflow:"visible",
        }}>
          <line x1="0" y1="2" x2="100%" y2="2"
            stroke="url(#lineGrad)" strokeWidth="2"
            strokeDasharray="600" strokeDashoffset="600"
            style={{ animation:"borderTrace 1.2s 1.4s ease forwards" }}
          />
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f5ff"/>
              <stop offset="100%" stopColor="#7c3aed"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* WITH AI tag */}
      <div style={{
        display:"inline-flex", alignItems:"center", gap:"8px",
        padding:"6px 14px", marginLeft:"1rem",
        border:"1px solid rgba(0,245,255,0.4)",
        borderRadius:"2px",
        fontFamily:"'Share Tech Mono', monospace",
        fontSize:"0.75rem", color:"var(--cyan)",
        letterSpacing:"0.2em",
        verticalAlign:"middle",
        position:"relative", top:"-0.5rem",
        opacity:0, animation:"fadeUp 0.6s 1s ease forwards",
        background:"rgba(0,245,255,0.06)",
      }}>
        ◈ WITH AI
      </div>
    </div>
  );
}

function MatchCard() {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{
  position:"relative",
  width:"clamp(300px, 28vw, 400px)",
  opacity:0,
  animation:"cardIn 1s 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
  perspective:"1000px",
  filter:"drop-shadow(0 0 25px rgba(0,245,255,0.35))",
}}>
      {/* Glow behind card */}
      <div style={{
        position:"absolute", inset:"-40px",
        background:"radial-gradient(ellipse, rgba(0,245,255,0.12) 0%, transparent 65%)",
        animation:"orbFloat 6s ease-in-out infinite",
        pointerEvents:"none",
      }}/>

      {/* Corner decoration SVG */}
      <svg style={{position:"absolute",top:0,left:0,width:"60px",height:"60px",pointerEvents:"none"}}>
        <polyline points="0,30 0,0 30,0" fill="none" stroke="var(--cyan)" strokeWidth="2"
          strokeDasharray="80" strokeDashoffset="80"
          style={{animation:"borderTrace 0.8s 1.4s ease forwards"}}/>
      </svg>
      <svg style={{position:"absolute",top:0,right:0,width:"60px",height:"60px",pointerEvents:"none"}}>
        <polyline points="60,30 60,0 30,0" fill="none" stroke="var(--cyan)" strokeWidth="2"
          strokeDasharray="80" strokeDashoffset="80"
          style={{animation:"borderTrace 0.8s 1.5s ease forwards"}}/>
      </svg>
      <svg style={{position:"absolute",bottom:0,left:0,width:"60px",height:"60px",pointerEvents:"none"}}>
        <polyline points="0,30 0,60 30,60" fill="none" stroke="var(--purple)" strokeWidth="2"
          strokeDasharray="80" strokeDashoffset="80"
          style={{animation:"borderTrace 0.8s 1.6s ease forwards"}}/>
      </svg>
      <svg style={{position:"absolute",bottom:0,right:0,width:"60px",height:"60px",pointerEvents:"none"}}>
        <polyline points="60,30 60,60 30,60" fill="none" stroke="var(--purple)" strokeWidth="2"
          strokeDasharray="80" strokeDashoffset="80"
          style={{animation:"borderTrace 0.8s 1.7s ease forwards"}}/>
      </svg>

      {/* Main panel */}
      <div style={{
        border:"2px solid rgba(0,245,255,0.55)",
        boxShadow:`
  0 0 15px rgba(0,245,255,0.25),
  0 0 35px rgba(0,245,255,0.12),
  inset 0 0 15px rgba(0,245,255,0.05)
`,
        background:"linear-gradient(135deg, rgba(0,245,255,0.04) 0%, rgba(0,0,0,0.6) 60%, rgba(124,58,237,0.06) 100%)",
        backdropFilter:"blur(24px)",
        borderRadius:"4px",
        padding:"2rem",
        animation:"hologramShift 4s ease-in-out infinite",
      }}>

        {/* Header row */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem"}}>
          <div>
            <div style={{
              fontFamily:"'Share Tech Mono', monospace",
              fontSize:"10px", color:"rgba(0,245,255,0.5)",
              letterSpacing:"0.2em", marginBottom:"0.5rem",
            }}>
              SYS::AI_MATCH_SCORE
            </div>
            <div style={{
              fontFamily:"'Orbitron', sans-serif",
              fontWeight:900, fontSize:"4rem",
              color:"var(--cyan)",
              lineHeight:1,
              textShadow:"0 0 20px rgba(0,245,255,0.5), 0 0 60px rgba(0,245,255,0.2)",
              opacity:0, animation:"countUp 0.8s 1.6s ease forwards",
            }}>
              92%
            </div>
          </div>
          <RadarRing/>
        </div>

        {/* Data bars */}
        <div style={{marginBottom:"1.5rem"}}>
          <div style={{
            fontFamily:"'Share Tech Mono', monospace",
            fontSize:"9px", color:"rgba(0,245,255,0.4)",
            letterSpacing:"0.15em", marginBottom:"0.5rem",
          }}>
            NEURAL_SIGNAL // LIVE
          </div>
          <DataBars/>
        </div>

        {/* Divider */}
        <div style={{
          height:"1px", marginBottom:"1.5rem",
          background:"linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)",
        }}/>

        {/* Job list */}
        <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
          {jobs.map(({title, sub, match, hot}, i) => (
            <div key={title}
              className="job-row"
              onMouseEnter={()=>setHovered(i)}
              onMouseLeave={()=>setHovered(null)}
              style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"12px 14px",
                border:"1px solid rgba(0,245,255,0.1)",
                background:"rgba(0,245,255,0.02)",
                borderRadius:"2px",
                cursor:"pointer",
                transition:"all 0.2s ease",
                opacity:0, animation:`fadeUp 0.5s ${1.8 + i*0.15}s ease forwards`,
                position:"relative", overflow:"hidden",
              }}>
              {/* Active shimmer */}
              {hovered === i && (
                <div style={{
                  position:"absolute", top:0, left:0, width:"30%", height:"100%",
                  background:"linear-gradient(90deg, transparent, rgba(0,245,255,0.06), transparent)",
                  animation:"shimmer 1s ease infinite",
                  pointerEvents:"none",
                }}/>
              )}
              <div>
                <div style={{display:"flex", alignItems:"center", gap:"8px", marginBottom:"3px"}}>
                  {hot && (
                    <span style={{
                      fontFamily:"'Share Tech Mono', monospace",
                      fontSize:"8px", color:"var(--green)",
                      border:"1px solid var(--green)",
                      padding:"1px 5px", letterSpacing:"0.1em",
                    }}>HOT</span>
                  )}
                  <span style={{
                    fontFamily:"'Rajdhani', sans-serif",
                    fontWeight:600, fontSize:"0.95rem", color:"rgba(255,255,255,0.9)",
                  }}>{title}</span>
                </div>
                <span style={{
                  fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"9px", color:"rgba(0,245,255,0.4)", letterSpacing:"0.1em",
                }}>{sub.toUpperCase()}</span>
              </div>
              <div style={{
                fontFamily:"'Orbitron', sans-serif",
                fontWeight:700, fontSize:"0.85rem",
                color: match >= 90 ? "var(--green)" : "var(--cyan)",
                textShadow: match >= 90 ? "0 0 10px var(--green)" : "0 0 10px var(--cyan)",
                border:`1px solid ${match >= 90 ? "rgba(0,255,136,0.4)" : "rgba(0,245,255,0.3)"}`,
                padding:"4px 10px", borderRadius:"2px",
                background: match >= 90 ? "rgba(0,255,136,0.06)" : "rgba(0,245,255,0.06)",
                flexShrink:0, marginLeft:"12px",
              }}>
                {match}%
              </div>
            </div>
          ))}
        </div>

        {/* Footer status */}
        <div style={{
          marginTop:"1.2rem", paddingTop:"1rem",
          borderTop:"1px solid rgba(0,245,255,0.08)",
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <span style={{
            fontFamily:"'Share Tech Mono', monospace",
            fontSize:"9px", color:"rgba(0,245,255,0.4)", letterSpacing:"0.15em",
          }}>
            SCANNING 10,000+ NODES...
          </span>
          <div style={{display:"flex", gap:"4px"}}>
            {[...Array(3)].map((_,i)=>(
              <div key={i} style={{
                width:"6px", height:"6px", borderRadius:"50%",
                background:"var(--cyan)", opacity: 0.3 + i*0.25,
                animation:`ping ${1 + i*0.3}s ${i*0.2}s ease-in-out infinite`,
              }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ MAIN COMPONENT ════════════════ */
export default function Home() {

  const navigate = useNavigate();
  
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const tag = document.createElement("style");
    tag.innerHTML = GLOBAL_CSS;
    document.head.appendChild(tag);
  }, []);

  const navItems = [
  { label: "DASHBOARD", path: "/dashboard" },
  { label: "JOBS", path: "/jobs" },
  { label: "PROFILE", path: "/profile" },
  { label: "APPLY", path: "/apply" },
];

  return (

    
    <div style={{
      minHeight:"100vh",
      background:"var(--bg)",
      color:"white",
      overflow:"hidden",
      position:"relative",
      fontFamily:"'Rajdhani', sans-serif",
      animation:"flicker 8s infinite",
    }}>
      <ScanlineOverlay/>

      {/* ── Deep space background ── */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
        {/* Stars */}
        {[...Array(60)].map((_,i)=>(
          <div key={i} style={{
            position:"absolute",
            width: Math.random()*2+1 + "px",
            height: Math.random()*2+1 + "px",
            borderRadius:"50%",
            left: Math.random()*100 + "%",
            top:  Math.random()*100 + "%",
            background:"white",
            opacity: Math.random()*0.7+0.1,
            animation:`ping ${1+Math.random()*3}s ${Math.random()*2}s ease-in-out infinite`,
          }}/>
        ))}

        {/* Orbs */}
        <div style={{
          position:"absolute", top:"-15%", right:"-5%",
          width:"50vw", height:"50vw", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 65%)",
          animation:"orbFloat 8s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute", bottom:"-20%", left:"-5%",
          width:"40vw", height:"40vw", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%)",
          animation:"orbFloat 10s 2s ease-in-out infinite reverse",
        }}/>
        <div style={{
          position:"absolute", top:"40%", left:"35%",
          width:"20vw", height:"20vw", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 65%)",
          animation:"orbFloat 6s 1s ease-in-out infinite",
        }}/>

        {/* Grid */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:`
            linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize:"60px 60px",
          maskImage:"radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
        }}/>

        {/* Horizontal accent lines */}
        {[20,45,75].map(top=>(
          <div key={top} style={{
            position:"absolute", left:0, right:0, top:`${top}%`,
            height:"1px",
            background:`linear-gradient(90deg, transparent, rgba(0,245,255,${top===45?0.12:0.06}), transparent)`,
          }}/>
        ))}

        <CircuitSVG/>
      </div>

      {/* ── Navbar placeholder ── */}
      {/* <Navbar /> */}

      {/* ── HUD top bar ── */}
      <div
  style={{
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 3rem",
    background: "rgba(0,8,20,0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "2px solid rgba(0,245,255,0.3)",
    boxShadow: `
      0 0 20px rgba(0,245,255,0.15),
      0 0 40px rgba(0,245,255,0.08)
    `,
  }}
>
        <div style={{
          fontFamily:"'Orbitron', sans-serif",
          fontWeight:700, fontSize:"1rem",
          color:"var(--cyan)",
          letterSpacing:"0.2em",
          textShadow:"0 0 20px rgba(0,245,255,0.4)",
        }}>
          JOB<span style={{color:"white"}}>SCAN</span>
          <span style={{
            fontFamily:"'Share Tech Mono', monospace",
            fontSize:"0.6rem", color:"rgba(0,245,255,0.5)",
            marginLeft:"8px", letterSpacing:"0.1em",
          }}>AI v4</span>
        </div>

        

        <div style={{display:"flex", gap:"2rem", alignItems:"center"}}>
          {navItems.map((item, i) => (
  <span
    key={item.label}
    onClick={() => navigate(item.path)}
    style={{
  fontFamily: "'Orbitron', sans-serif",
  fontSize: "15px",
  fontWeight: "700",
  color: "#ffffff",
  letterSpacing: "0.15em",
  cursor: "pointer",
  padding: "10px 18px",
  borderRadius: "8px",
  textShadow: "0 0 12px rgba(0,245,255,0.8)",
  transition: "all 0.3s ease",
  opacity: 0,
  animation: `fadeUp 0.4s ${0.1 + i * 0.08}s ease forwards`,
}}
    onMouseEnter={(e) => {
  e.target.style.color = "#00f5ff";
  e.target.style.background = "rgba(0,245,255,0.1)";
  e.target.style.boxShadow = "0 0 20px rgba(0,245,255,0.3)";
}}

onMouseLeave={(e) => {
  e.target.style.color = "#ffffff";
  e.target.style.background = "transparent";
  e.target.style.boxShadow = "none";
}}
  >
    {item.label}
  </span>
))}
          <div style={{
            padding:"6px 16px",
            border:"1px solid rgba(0,245,255,0.4)",
            borderRadius:"2px",
            fontFamily:"'Share Tech Mono', monospace",
            fontSize:"10px", color:"var(--cyan)",
            letterSpacing:"0.15em", cursor:"pointer",
            background:"rgba(0,245,255,0.06)",
            opacity:0, animation:"fadeUp 0.4s 0.4s ease forwards",
          }}>
            CONNECT
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{
        position:"relative", zIndex:10,
        maxWidth:"1400px", margin:"0 auto",
        padding:"clamp(3rem,8vh,6rem) clamp(1.5rem,5vw,4rem)",
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        gap:"4rem",
        minHeight:"calc(100vh - 70px)",
      }}>

        {/* ════ LEFT ════ */}
        <div style={{flex:"1 1 auto", maxWidth:"700px"}}>
          <HUDBadge/>
          <GlitchTitle/>

          {/* Subtitle */}
          <p style={{
  fontFamily:"'Rajdhani', sans-serif",
  fontWeight:500,
  fontSize:"1.25rem",
  color:"#dbeafe",
  lineHeight:1.9,
  maxWidth:"620px",
  marginBottom:"2.5rem",
  letterSpacing:"0.02em",
  textShadow:"0 0 10px rgba(255,255,255,0.15)",
  opacity:0,
  animation:"fadeUp 0.7s 1.1s ease forwards",
}}>Neural-powered <span style={{color:"#00f5ff"}}>job matching</span> across LinkedIn,
Naukri, Indeed, and <span style={{color:"#00f5ff"}}>5+ platforms</span>.
Upload your resume → AI analyzes, ranks, and deploys
<span style={{color:"#00f5ff"}}> bulk applications</span> autonomously.
          </p>

          {/* CTAs */}
          <div style={{
            display:"flex", flexWrap:"wrap", gap:"1rem", marginBottom:"3rem",
            opacity:0, animation:"fadeUp 0.7s 1.3s ease forwards",
          }}>
            <button
  className="cta-primary"
  onClick={() => navigate("/dashboard")}
  style={{
    position:"relative",
    overflow:"hidden",
    padding:"14px 36px",
    background:"linear-gradient(90deg, #00f5ff, #0066ff)",
    border:"none",
    borderRadius:"2px",
    fontFamily:"'Orbitron', sans-serif",
    fontWeight:700,
    fontSize:"0.85rem",
    color:"#000",
    letterSpacing:"0.15em",
    cursor:"pointer",
    boxShadow:"0 0 30px rgba(0,245,255,0.3)",
    transition:"all 0.2s ease",
  }}
>
  <span style={{position:"relative",zIndex:1}}>
    ◈ INITIATE SCAN
  </span>

  <span
    className="cta-shine"
    style={{
      position:"absolute",
      inset:0,
      background:"linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
      transform:"translateX(-200%)",
    }}
  />
</button>

           <button
  className="cta-secondary"
  onClick={() => navigate("/jobs")}
  style={{
    padding:"14px 36px",
    background:"rgba(0,245,255,0.04)",
    border:"1px solid rgba(0,245,255,0.25)",
    borderRadius:"2px",
    fontFamily:"'Share Tech Mono', monospace",
    fontSize:"0.8rem",
    color:"var(--cyan)",
    letterSpacing:"0.15em",
    cursor:"pointer",
    transition:"all 0.2s ease",
  }}
>
  EXPLORE NODES →
</button>
          </div>

          {/* Stats */}
          <div style={{
            display:"flex", flexWrap:"wrap", gap:"0",
            padding:"1.5rem 0",
            borderTop:"1px solid rgba(0,245,255,0.1)",
            opacity:0, animation:"fadeUp 0.7s 1.5s ease forwards",
          }}>
            {stats.map(({value, label, icon}, i) => (
              <div key={label} style={{
                flex:"1 1 120px",
                paddingRight:"2rem",
                marginRight:"2rem",
                borderRight: i < stats.length-1 ? "1px solid rgba(0,245,255,0.1)" : "none",
              }}>
                <div style={{
                  fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"10px", color:"rgba(0,245,255,0.4)",
                  letterSpacing:"0.2em", marginBottom:"0.5rem",
                }}>
                  {icon} {label.toUpperCase()}
                </div>
                <div style={{
                  fontFamily:"'Orbitron', sans-serif",
                  fontWeight:900, fontSize:"2.2rem",
                  lineHeight:1,
                  background:"linear-gradient(135deg, #00f5ff, #0066ff)",
                  WebkitBackgroundClip:"text",
                  WebkitTextFillColor:"transparent",
                  textShadow:"none",
                  filter:"drop-shadow(0 0 12px rgba(0,245,255,0.4))",
                  opacity:0, animation:`countUp 0.6s ${1.8+i*0.2}s ease forwards`,
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* System status row */}
         <div style={{
  marginTop:"1.5rem",
  display:"flex",
  gap:"1.5rem",
  flexWrap:"wrap",
  opacity:0,
  animation:"fadeUp 0.5s 2s ease forwards",
}}>
  {[
    {label:"LINKEDIN", status:"LIVE"},
    {label:"NAUKRI", status:"LIVE"},
    {label:"INDEED", status:"SYNC"},
    {label:"AI CORE", status:"◉ ONLINE", green:true},
  ].map(({label, status, green}) => (
    <div
      key={label}
      style={{
        display:"flex",
        alignItems:"center",
        gap:"8px",
        fontFamily:"'Share Tech Mono', monospace",
        fontSize:"12px",
        letterSpacing:"0.12em",
      }}
    >
      <span
        style={{
          color:"#d1d5db",
          fontWeight:"600",
          textShadow:"0 0 6px rgba(255,255,255,0.3)",
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: green ? "#00ff88" : "#00f5ff",
          fontWeight:"700",
          textShadow: green
            ? "0 0 12px #00ff88"
            : "0 0 12px #00f5ff",
        }}
      >
        {status}
      </span>
    </div>
  ))}
</div>
        </div>

        {/* ════ RIGHT CARD ════ */}
        <div className="hidden-mobile" style={{
          flexShrink:0,
          display:"flex", justifyContent:"flex-end",
        }}>
          <MatchCard/>
        </div>
      </div>

      {/* Bottom HUD bar */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:20,
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"8px clamp(1.5rem,5vw,4rem)",
        borderTop:"1px solid rgba(0,245,255,0.06)",
        background:"rgba(1,4,9,0.8)", backdropFilter:"blur(10px)",
      }}>
        <span style={{
          fontFamily:"'Share Tech Mono', monospace",
          fontSize:"9px", color:"rgba(0,245,255,0.3)", letterSpacing:"0.15em",
        }}>
          JOBSCAN_AI // NEURAL_MATCH_ENGINE // BUILD_4.2.1
        </span>
        <span style={{
          fontFamily:"'Share Tech Mono', monospace",
          fontSize:"9px", color:"rgba(0,245,255,0.3)", letterSpacing:"0.15em",
        }}>
          [SYS::ALL_NODES_ONLINE] ◈ LAT:28.6ms
        </span>
      </div>
    </div>
  );
}