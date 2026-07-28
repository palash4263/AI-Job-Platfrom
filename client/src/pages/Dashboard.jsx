import { useState, useRef, useEffect } from "react";
import {
  Menu, X, Upload, Zap, BarChart2, Settings, Star, Home,
  ChevronRight, CheckCircle2, Briefcase, MapPin, ExternalLink,
  Cpu, Activity, Radio,
} from "lucide-react";
import axios from "axios";
import { uploadResume } from "../services/resumeApi";
import AtsScoreCard from "../components/AtsScoreCard";

// ─── Nav & Static Data ──────────────────────────────────────────────────────
const NAV = [
  { label: "DASHBOARD",    icon: Home },
  { label: "RECOMMENDED",  icon: Star },
  { label: "RESUME AI",    icon: Zap },
  { label: "ANALYTICS",    icon: BarChart2 },
  { label: "SETTINGS",     icon: Settings },
];

const UPLOAD_HINTS = ["PDF / DOCX", "DRAG & DROP", "ENCRYPTED PIPELINE"];
    
const scoreColor = (s) =>
  s >= 90 ? "#00ff88" : s >= 80 ? "#00f5ff" : "#7c3aed";

const getJobTitle = (job) => job.title || job.role || "Job";

const getApplyUrl = (job) => {
  const raw = job.applyLink || job.url || job.link;
  if (raw && raw !== "#") {
    try { return new URL(raw, window.location.origin).href; } catch {}
  }
  const q = [getJobTitle(job), job.company, job.location].filter(Boolean).join(" ");
  return `https://www.google.com/search?q=${encodeURIComponent(`${q} job apply`)}`;
};

// ─── Fonts + Global Styles ──────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cyan:   #a78bfa; /* Light violet for accents */
      --blue:   #4f46e5; /* Indigo brand accent */
      --purple: #7c3aed; /* Violet primary brand */
      --green:  #10b981; /* Success green */
      --amber:  #fbbf24; /* Warning Amber */
      --red:    #ef4444; /* Error Red */
      --bg:     #020617; /* Deep midnight slate */
      --panel:  rgba(15, 23, 42, 0.85); /* Semi-transparent Slate panel */
      --border: rgba(255, 255, 255, 0.08); /* Subtle glass boundary */
      --border2: rgba(255, 255, 255, 0.15); /* Focus glass boundary */
      --text:   #f8fafc; /* Slate white */
      --muted:  #94a3b8; /* Slate gray */
      --font-display: 'Outfit', sans-serif;
      --font-body:    'Inter', sans-serif;
      --font-mono:    'Fira Code', monospace;
    }

    html, body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

    @keyframes scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes flicker {
      0%,100%{ opacity:1; } 92%{ opacity:1; } 93%{ opacity:0.6; } 95%{ opacity:1; } 96%{ opacity:0.8; } 97%{ opacity:1; }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(16px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes neonPulse {
      0%,100%{ box-shadow: 0 0 6px var(--cyan), 0 0 20px rgba(0,245,255,0.3); }
      50%    { box-shadow: 0 0 12px var(--cyan), 0 0 50px rgba(0,245,255,0.6); }
    }
    @keyframes ping {
      0%,100%{ opacity:1; transform:scale(1); }
      50%    { opacity:0.3; transform:scale(1.6); }
    }
    @keyframes orbFloat {
      0%,100%{ transform:translate(0,0) scale(1); }
      33%    { transform:translate(20px,-15px) scale(1.05); }
      66%    { transform:translate(-10px,10px) scale(0.97); }
    }
    @keyframes loadbar {
      0%   { width:0%; margin-left:0%; }
      50%  { width:60%; margin-left:20%; }
      100% { width:0%; margin-left:100%; }
    }
    @keyframes borderTrace {
      0%   { stroke-dashoffset: 1000; }
      100% { stroke-dashoffset: 0; }use
    }
    @keyframes dataPulse {
      0%,100%{ opacity:0.3; transform:scaleY(1); }
      50%    { opacity:1;   transform:scaleY(1.4); }
    }
    @keyframes shimmer {
      from { transform:translateX(-200%); }
      to   { transform:translateX(200%); }
    }
    @keyframes aurora {
      0%   { transform: translate(0,0) scale(1); }
      50%  { transform: translate(40px,-30px) scale(1.1); }
      100% { transform: translate(-30px,20px) scale(1.05); }
    }
    @keyframes radarSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes countUp {
      from { opacity:0; transform:scale(0.8) translateY(8px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    @keyframes sidebarItemIn {
      from { opacity:0; transform:translateX(-24px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes blink {
      0%,100%{ opacity:1; } 50%{ opacity:0; }
    }
    @keyframes statusFlicker {
      0%,100%{ opacity:1; } 85%{ opacity:1; } 87%{ opacity:0.3; } 89%{ opacity:1; } 91%{ opacity:0.6; } 93%{ opacity:1; }
    }
    @keyframes logoPulseAnim {
      0%,100%{ text-shadow: 0 0 20px rgba(0,245,255,0.6), 0 0 40px rgba(0,245,255,0.2); }
      50%    { text-shadow: 0 0 35px rgba(0,245,255,1), 0 0 70px rgba(0,245,255,0.5), 0 0 120px rgba(0,245,255,0.15); }
    }
    @keyframes borderScan {
      0%   { top:-2px; opacity:0; }
      5%   { opacity:1; }
      95%  { opacity:1; }
      100% { top:100%; opacity:0; }
    }
    @keyframes navDividerIn {
      from { opacity:0; transform:scaleX(0); transform-origin:left; }
      to   { opacity:1; transform:scaleX(1); }
    }
    @keyframes statusBarGrow {
      from { width:0; }
      to   { width:100%; }
    }
    @keyframes chipGlow {
      0%,100%{ box-shadow:0 0 8px rgba(0,245,255,0.15), inset 0 0 8px rgba(0,245,255,0.03); }
      50%    { box-shadow:0 0 24px rgba(0,245,255,0.35), inset 0 0 16px rgba(0,245,255,0.06); }
    }
    @keyframes avatarGlow {
      0%,100%{ box-shadow:0 0 12px rgba(0,245,255,0.4); }
      50%    { box-shadow:0 0 28px rgba(0,245,255,0.8), 0 0 50px rgba(0,245,255,0.3); }
    }
    @keyframes glitchLogo {
      0%,90%,100%{ clip-path:none; transform:none; }
      92%{ clip-path:polygon(0 20%,100% 20%,100% 40%,0 40%); transform:translateX(-3px); }
      94%{ clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%); transform:translateX(3px); }
      96%{ clip-path:none; transform:none; }
    }

    /* ── Root layout ── */
    .db-root {
      display: flex;
      min-height: 100vh;
      color: var(--text);
      font-family: var(--font-body);
      position: relative;
      background: var(--bg);
      overflow-x: hidden;
    }

    /* Deep-space bg */
    .db-root::before {
      content: '';
      position: fixed; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: 0;
    }

    /* Scanline */
    .db-scanline {
      display: none;
    }
    /* CRT lines */
    .db-crt {
      display: none;
    }
    /* Vignette */
    .db-vignette {
      position: fixed; inset: 0;
      background: radial-gradient(ellipse at center, transparent 60%, rgba(2,6,23,0.9) 100%);
      pointer-events: none;
      z-index: 997;
    }

    /* Orbs */
    .db-orb-1 {
      position: fixed; top: -15%; right: -5%;
      width: 50vw; height: 50vw; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 65%);
      animation: orbFloat 8s ease-in-out infinite;
      pointer-events: none; z-index: 0;
    }
    .db-orb-2 {
      position: fixed; bottom: -20%; left: -5%;
      width: 40vw; height: 40vw; border-radius: 50%;
      background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%);
      animation: orbFloat 10s 2s ease-in-out infinite reverse;
      pointer-events: none; z-index: 0;
    }

    /* ── SIDEBAR ── */
    .db-sidebar {
      width: 240px; min-width: 240px;
      background: linear-gradient(180deg,
        rgba(0, 22, 35, 0.99) 0%,
        rgba(0, 12, 22, 0.99) 60%,
        rgba(0, 8, 18, 0.99) 100%
      );
      border-right: 1px solid rgba(0,245,255,0.4);
      box-shadow:
        4px 0 60px rgba(0,245,255,0.1),
        inset -1px 0 0 rgba(0,245,255,0.15),
        inset 0 0 80px rgba(0,245,255,0.02);
      display: flex; flex-direction: column;
      position: fixed; top: 0; left: 0; bottom: 0;
      z-index: 100;
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
      overflow: hidden;
    }
    /* Sidebar inner grid pattern */
    .db-sidebar::before {
      content: '';
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px);
      background-size: 30px 30px;
      pointer-events: none;
      z-index: 0;
    }
    /* Sidebar cyan glow orb at top */
    .db-sidebar::after {
      content: '';
      position: absolute; top: -60px; left: -40px;
      width: 200px; height: 200px; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%);
      pointer-events: none; z-index: 0;
      animation: orbFloat 6s ease-in-out infinite;
    }
    .db-sidebar.closed { transform: translateX(-240px); }

    .db-logo-block {
      padding: 20px 22px;
      border-bottom: 1px solid rgba(0,245,255,0.2);
      background: rgba(0,245,255,0.05);
      display: flex; align-items: center; justify-content: space-between;
      position: relative; z-index: 1;
    }
    /* Horizontal scan line under logo */
    .db-logo-block::after {
      content: '';
      position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--cyan), transparent);
      box-shadow: 0 0 8px var(--cyan);
    }
    .db-logo {
      font-family: var(--font-display);
      font-weight: 700; font-size: 1rem;
      color: var(--cyan);
      letter-spacing: 0.2em;
      text-shadow: 0 0 20px rgba(0,245,255,0.6), 0 0 40px rgba(0,245,255,0.2);
      display: flex; align-items: center; gap: 10px;
      animation: logoPulseAnim 3s ease-in-out infinite, glitchLogo 9s infinite;
    }
    .db-logo span { color: white; text-shadow: none; }
    .db-logo-sub {
      font-family: var(--font-mono);
      font-size: 0.5rem; color: rgba(0,245,255,0.45);
      margin-left: 2px; letter-spacing: 0.12em;
      border: 1px solid rgba(0,245,255,0.2);
      padding: 1px 5px; border-radius: 2px;
    }
    .db-logo-dot {
      width: 9px; height: 9px; border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 10px var(--green), 0 0 20px rgba(0,255,136,0.4);
      animation: ping 1.5s ease-in-out infinite;
      flex-shrink: 0;
    }

    /* ── NAV SECTION DIVIDER ── */
    .db-nav-divider {
      font-family: var(--font-mono);
      font-size: 8px; letter-spacing: 0.25em;
      color: rgba(0,245,255,0.3);
      text-transform: uppercase;
      padding: 12px 14px 6px;
      display: flex; align-items: center; gap: 8px;
      opacity: 0;
      animation: sidebarItemIn 0.5s 0.1s ease forwards;
    }
    .db-nav-divider::after {
      content: ''; flex: 1; height: 1px;
      background: linear-gradient(90deg, rgba(0,245,255,0.2), transparent);
      animation: navDividerIn 0.8s 0.3s ease forwards;
      opacity: 0; transform: scaleX(0); transform-origin: left;
    }

    .db-nav { flex: 1; padding: 12px 14px; display: flex; flex-direction: column; gap: 3px; position: relative; z-index: 1; }
    .db-nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 14px;
      border-radius: 2px;
      font-family: var(--font-display);
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.14em;
      color: rgba(160, 210, 225, 0.6);
      background: none;
      border: 1px solid transparent;
      cursor: pointer; width: 100%; text-align: left;
      transition: all 0.25s ease;
      position: relative; overflow: hidden;
      opacity: 0;
    }
    /* Staggered entrance per item via inline style */
    .db-nav-item:nth-child(2) { animation: sidebarItemIn 0.45s 0.18s ease forwards; }
    .db-nav-item:nth-child(3) { animation: sidebarItemIn 0.45s 0.26s ease forwards; }
    .db-nav-item:nth-child(4) { animation: sidebarItemIn 0.45s 0.34s ease forwards; }
    .db-nav-item:nth-child(5) { animation: sidebarItemIn 0.45s 0.42s ease forwards; }
    .db-nav-item:nth-child(6) { animation: sidebarItemIn 0.45s 0.50s ease forwards; }
    /* Hover shimmer sweep */
    .db-nav-item::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(0,245,255,0.08), transparent);
      transform: translateX(-100%);
      transition: transform 0s;
    }
    .db-nav-item:hover::after {
      transform: translateX(100%);
      transition: transform 0.5s ease;
    }
    .db-nav-item:hover {
      color: #ffffff;
      background: rgba(0,245,255,0.07);
      border-color: rgba(0,245,255,0.25);
      text-shadow: 0 0 12px rgba(0,245,255,0.6);
      transform: translateX(4px);
    }
    .db-nav-item.active {
      color: var(--cyan);
      background: linear-gradient(90deg, rgba(0,245,255,0.12), rgba(0,245,255,0.04));
      border-color: rgba(0,245,255,0.45);
      box-shadow: inset 0 0 24px rgba(0,245,255,0.07), 0 0 16px rgba(0,245,255,0.1);
      text-shadow: 0 0 16px rgba(0,245,255,0.9);
    }
    /* Active left bar */
    .db-nav-item.active::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0;
      width: 3px;
      background: linear-gradient(180deg, var(--cyan), var(--blue));
      box-shadow: 0 0 10px var(--cyan), 0 0 20px rgba(0,245,255,0.4);
    }
    /* Scanning line that travels down the active item */
    .db-nav-item.active .nav-scan {
      position: absolute; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,245,255,0.5), transparent);
      animation: borderScan 2.5s ease-in-out infinite;
    }
    .db-nav-item.active .nav-arrow { opacity: 1; }
    .nav-arrow {
      margin-left: auto; font-size: 10px;
      color: var(--cyan); opacity: 0;
      transition: opacity 0.2s;
      animation: blink 1.5s ease-in-out infinite;
    }
    .nav-scan { display: none; }
    .db-nav-item.active .nav-scan { display: block; }

    .db-sidebar-close {
      background: rgba(0,245,255,0.04);
      border: 1px solid rgba(0,245,255,0.25);
      border-radius: 2px;
      color: rgba(0,245,255,0.5);
      cursor: pointer;
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .db-sidebar-close:hover {
      color: var(--cyan); border-color: var(--cyan);
      box-shadow: 0 0 12px rgba(0,245,255,0.3);
    }

    /* ── SIDEBAR STATUS STRIP ── */
    .db-sidebar-status {
      position: relative; z-index: 1;
      margin: 0 14px 12px;
      padding: 10px 12px;
      background: rgba(0,245,255,0.03);
      border: 1px solid rgba(0,245,255,0.12);
      border-radius: 2px;
      display: flex; flex-direction: column; gap: 6px;
    }
    .db-status-row {
      display: flex; align-items: center; justify-content: space-between;
      font-family: var(--font-mono);
      font-size: 8.5px; letter-spacing: 0.12em;
    }
    .db-status-label { color: rgba(0,245,255,0.4); }
    .db-status-val-live {
      color: var(--green);
      text-shadow: 0 0 8px var(--green);
      display: flex; align-items: center; gap: 4px;
    }
    .db-status-val-live::before {
      content: '';
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 6px var(--green);
      animation: ping 1.2s ease-in-out infinite;
    }
    .db-status-val-sync { color: var(--cyan); text-shadow: 0 0 8px rgba(0,245,255,0.5); }

    .db-sidebar-bottom {
      padding: 12px 14px 16px;
      border-top: 1px solid rgba(0,245,255,0.15);
      background: rgba(0,245,255,0.03);
      position: relative; z-index: 1;
    }
    .db-sidebar-bottom::before {
      content: '';
      position: absolute; top: -1px; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent);
    }
    .db-user-chip {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px;
      background: rgba(0,245,255,0.05);
      border: 1px solid rgba(0,245,255,0.25);
      border-radius: 2px;
      transition: all 0.2s;
    }
    .db-user-chip:hover {
      border-color: rgba(0,245,255,0.4);
      box-shadow: 0 0 16px rgba(0,245,255,0.1);
    }
    .db-avatar {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, var(--cyan), var(--blue));
      border-radius: 2px;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display);
      font-weight: 900; font-size: 12px;
      color: #010409;
      flex-shrink: 0;
      box-shadow: 0 0 16px rgba(0,245,255,0.5);
      position: relative;
    }
    /* Avatar corner brackets */
    .db-avatar::before, .db-avatar::after {
      content: '';
      position: absolute;
      width: 6px; height: 6px;
      border-color: rgba(255,255,255,0.5); border-style: solid;
    }
    .db-avatar::before { top: -2px; left: -2px; border-width: 1px 0 0 1px; }
    .db-avatar::after  { bottom: -2px; right: -2px; border-width: 0 1px 1px 0; }
    .db-user-name {
      font-family: var(--font-display);
      font-size: 10px; font-weight: 700;
      color: var(--cyan); letter-spacing: 0.12em;
      text-shadow: 0 0 10px rgba(0,245,255,0.4);
    }
    .db-user-role {
      font-family: var(--font-mono);
      font-size: 8.5px; color: rgba(0,245,255,0.4);
      letter-spacing: 0.15em; text-transform: uppercase;
      margin-top: 2px;
    }

    /* ── MAIN ── */
    .db-main {
      flex: 1; margin-left: 240px;
      display: flex; flex-direction: column;
      min-height: 100vh;
      position: relative; z-index: 1;
      transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .db-main.full { margin-left: 0; }

    /* ── TOPBAR ── */
    .db-topbar {
      height: 64px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 16px;
      padding: 0 2.5rem;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(20px);
      position: sticky; top: 0; z-index: 50;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    .db-menu-btn {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
      border-radius: 4px;
      color: var(--muted);
      cursor: pointer;
      width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .db-menu-btn:hover {
      color: var(--text); border-color: var(--border2);
      background: rgba(255, 255, 255, 0.05);
    }

    .db-breadcrumb {
      display: flex; align-items: center; gap: 8px;
      font-family: var(--font-mono);
      font-size: 11px; color: var(--muted);
      flex: 1; letter-spacing: 0.05em;
    }
    .db-breadcrumb strong {
      color: var(--cyan);
    }

    .db-search {
      display: flex; align-items: center; gap: 10px;
      background: rgba(0,245,255,0.03);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 0 14px; height: 34px;
      transition: all 0.2s;
    }
    .db-search:focus-within {
      border-color: rgba(0,245,255,0.5);
      box-shadow: 0 0 16px rgba(0,245,255,0.15);
    }
    .db-search input {
      background: none; border: none; outline: none;
      color: var(--cyan);
      font-family: var(--font-mono);
      font-size: 11px; width: 200px; letter-spacing: 0.06em;
    }
    .db-search input::placeholder { color: rgba(0,245,255,0.3); }

    .db-status-dot {
      width: 7px; height: 7px;
      background: var(--green); border-radius: 50%;
      box-shadow: 0 0 10px var(--green);
      animation: ping 1.5s ease-in-out infinite;
    }

    /* ── CONTENT ── */
    .db-content {
      padding: 40px 2.5rem 80px;
      max-width: 1280px;
      display: flex; flex-direction: column; gap: 32px;
      position: relative; z-index: 1;
    }

    /* ── PAGE HEADER ── */
    .db-page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 24px; padding-bottom: 8px;
      opacity: 0; animation: fadeUp 0.6s 0.1s ease forwards;
    }
    .db-page-eyebrow {
      font-family: var(--font-mono);
      font-size: 10px; letter-spacing: 0.2em;
      text-transform: uppercase; color: rgba(0,245,255,0.5);
      margin-bottom: 10px;
      display: flex; align-items: center; gap: 8px;
    }
    .db-page-eyebrow::before {
      content: ''; width: 24px; height: 1px;
      background: var(--cyan);
      box-shadow: 0 0 8px var(--cyan);
    }
    .db-page-title {
      font-family: var(--font-display);
      font-size: clamp(1.4rem, 3vw, 2.2rem);
      font-weight: 900; letter-spacing: 0.04em; line-height: 1.1;
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      -webkit-background-clip: text; background-clip: text;
      color: transparent;
      filter: drop-shadow(0 0 20px rgba(124,58,237,0.3));
    }
    .db-page-sub {
      font-family: var(--font-mono);
      font-size: 11px; color: rgba(0,245,255,0.4);
      margin-top: 8px; letter-spacing: 0.12em;
    }
    .db-ai-badge {
      flex-shrink: 0;
      display: flex; align-items: center; gap: 8px;
      padding: 8px 16px;
      background: rgba(0,245,255,0.04);
      border: 1px solid rgba(0,245,255,0.3);
      border-radius: 2px;
      font-family: var(--font-mono);
      font-size: 10px; font-weight: 600;
      letter-spacing: 0.18em;
      color: var(--cyan);
      text-transform: uppercase;
      animation: neonPulse 2.5s ease-in-out infinite;
    }

    /* ── PANEL (glass card) ── */
    .db-panel {
      background: rgba(0, 28, 42, 0.85);
      border: 1px solid rgba(0,245,255,0.3);
      border-radius: 2px;
      backdrop-filter: blur(20px);
      position: relative;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0,245,255,0.07);
    }
    .db-panel::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,245,255,0.5), transparent);
    }

    /* ── METRICS ROW ── */
    .db-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      opacity: 0; animation: fadeUp 0.6s 0.2s ease forwards;
    }
    .db-metric {
      background: rgba(0, 30, 45, 0.85);
      border: 1px solid rgba(0,245,255,0.35);
      border-radius: 2px;
      padding: 20px 22px;
      display: flex; flex-direction: column; gap: 6px;
      backdrop-filter: blur(20px);
      position: relative; overflow: hidden;
      transition: all 0.2s;
      box-shadow: 0 0 18px rgba(0,245,255,0.07), inset 0 0 20px rgba(0,245,255,0.04);
    }
    .db-metric:hover {
      border-color: rgba(0,245,255,0.6);
      box-shadow: 0 0 30px rgba(0,245,255,0.18), inset 0 0 24px rgba(0,245,255,0.07);
      transform: translateY(-2px);
    }
    .db-metric::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 1px;
      background: linear-gradient(90deg, transparent, var(--cyan), transparent);
      opacity: 0.9;
    }
    .db-metric-label {
      font-family: var(--font-mono);
      font-size: 9px; letter-spacing: 0.2em;
      text-transform: uppercase; color: rgba(0,245,255,0.65);
    }
    .db-metric-value {
      font-family: var(--font-display);
      font-size: 2rem; font-weight: 900; line-height: 1;
      color: var(--cyan);
      text-shadow: 0 0 20px rgba(0,245,255,0.7), 0 0 60px rgba(0,245,255,0.3);
      opacity: 0; animation: countUp 0.6s 0.5s ease forwards;
    }
    .db-metric-sub {
      font-family: var(--font-mono);
      font-size: 9px; color: rgba(0,245,255,0.45); letter-spacing: 0.1em;
    }

    /* ── UPLOAD ZONE ── */
    .db-upload {
      border: 1px dashed rgba(0,245,255,0.45);
      border-radius: 2px;
      background: rgba(0, 30, 45, 0.8);
      padding: 36px 32px;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative; overflow: hidden;
      opacity: 0; animation: fadeUp 0.6s 0.3s ease forwards;
      box-shadow: 0 0 20px rgba(0,245,255,0.07), inset 0 0 30px rgba(0,245,255,0.04);
    }
    .db-upload::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.1) 0%, transparent 70%);
      opacity: 0; transition: opacity 0.3s;
    }
    .db-upload:hover::before, .db-upload.drag::before { opacity: 1; }
    .db-upload:hover, .db-upload.drag {
      border-color: var(--cyan);
      box-shadow: 0 0 40px rgba(0,245,255,0.12), inset 0 0 30px rgba(0,245,255,0.04);
    }
    .db-upload-inner {
      display: flex; align-items: center; gap: 28px;
      position: relative; z-index: 1;
    }
    .db-upload-icon-wrap {
      width: 64px; height: 64px;
      border: 1px solid rgba(0,245,255,0.3);
      border-radius: 2px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,245,255,0.05);
      flex-shrink: 0; color: var(--cyan);
      transition: all 0.25s;
      box-shadow: 0 0 20px rgba(0,245,255,0.1);
    }
    .db-upload:hover .db-upload-icon-wrap {
      box-shadow: 0 0 30px rgba(0,245,255,0.3);
      border-color: var(--cyan);
    }
    .db-upload-title {
      font-family: var(--font-display);
      font-size: 1rem; font-weight: 700;
      color: rgba(255,255,255,0.9); margin-bottom: 6px;
      letter-spacing: 0.05em;
    }
    .db-upload-sub {
      font-family: var(--font-mono);
      font-size: 11px; color: rgba(0,245,255,0.4);
      letter-spacing: 0.1em; margin-bottom: 12px;
    }
    .db-upload-tags { display: flex; gap: 8px; flex-wrap: wrap; }
    .db-upload-tag {
      padding: 3px 10px;
      border: 1px solid rgba(0,245,255,0.2);
      border-radius: 2px;
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(0,245,255,0.4);
      background: rgba(0,245,255,0.03);
    }

    /* ── LOADING ── */
    .db-loading {
      display: flex;
  gap: 30px;
  align-items: center;
  padding: 30px;
  background: rgba(0,20,40,.7);
  border: 1px solid rgba(0,245,255,.25);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
    }
    .db-loading-bar {
      flex: 1; height: 2px;
      background: rgba(0,245,255,0.1);
      border-radius: 2px; overflow: hidden;
    }
    .db-loading-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--cyan), var(--blue));
      border-radius: 2px;
      animation: loadbar 1.8s ease-in-out infinite;
      box-shadow: 0 0 8px var(--cyan);
    }
    .db-loading-label {
      font-family: var(--font-mono);
      font-size: 11px; color: var(--cyan);
      white-space: nowrap; letter-spacing: 0.1em;
    }

    /* ── SECTION LABEL ── */
    .db-section-label {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 16px;
    }
    .db-section-line {
      width: 24px; height: 1px;
      background: linear-gradient(90deg, var(--cyan), var(--blue));
      box-shadow: 0 0 8px var(--cyan);
    }
    .db-section-text {
      font-family: var(--font-mono);
      font-size: 10px; letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--cyan);
      text-shadow: 0 0 10px rgba(0,245,255,0.5);
    }
    .db-section-count {
      margin-left: auto;
      font-family: var(--font-mono);
      font-size: 9px; color: rgba(0,245,255,0.35); letter-spacing: 0.1em;
    }

    /* ── SKILLS ── */
    .db-skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .db-skill-pill {
      padding: 5px 14px;
      border: 1px solid rgba(0,245,255,0.2);
      border-radius: 2px;
      font-family: var(--font-mono);
      font-size: 10px; color: rgba(0,245,255,0.7);
      background: rgba(0,245,255,0.03);
      letter-spacing: 0.1em;
      transition: all 0.15s;
    }
    .db-skill-pill:hover {
      border-color: var(--cyan);
      color: var(--cyan);
      box-shadow: 0 0 12px rgba(0,245,255,0.2);
      background: rgba(0,245,255,0.06);
    }

    /* ── JOBS HEADER ── */
    .db-jobs-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 18px;
    }
    .db-jobs-count {
      font-family: var(--font-mono);
      font-size: 10px; color: rgba(0,245,255,0.35); letter-spacing: 0.1em;
    }
    .db-bulk-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 24px;
      background: linear-gradient(90deg, var(--cyan), var(--blue));
      border: none;
      border-radius: 2px;
      font-family: var(--font-display);
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.15em;
      color: #010409;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 0 24px rgba(0,245,255,0.3);
    }
    .db-bulk-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 0 40px rgba(0,245,255,0.5);
    }
    .db-bulk-btn:disabled { opacity: 0.35; cursor: not-allowed; }

    /* ── JOB GRID ── */
    .db-jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 14px;
    }

  /* ── JOB CARD ───────────────────────────────────────── */

.db-job-card {
  background:
    linear-gradient(
      135deg,
      rgba(0, 28, 42, 0.95),
      rgba(0, 15, 25, 0.92)
    );

  border: 1px solid rgba(0,245,255,0.25);
  border-radius: 8px;

  padding: 22px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  position: relative;
  overflow: hidden;

  backdrop-filter: blur(18px);

  transition: all 0.35s ease;

  box-shadow:
      0 0 10px rgba(0,245,255,0.08),
      0 0 30px rgba(0,245,255,0.04),
      inset 0 0 25px rgba(0,245,255,0.02);
}

/* Animated top border */

.db-job-card::before {
  content: "";

  position: absolute;
  top: 0;
  left: -100%;

  width: 100%;
  height: 2px;

  background: linear-gradient(
    90deg,
    transparent,
    #00f5ff,
    transparent
  );

  transition: all 0.8s ease;
}

/* Glow orb */

.db-job-card::after {
  content: "";

  position: absolute;

  width: 180px;
  height: 180px;

  top: -100px;
  right: -100px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(0,245,255,0.12),
      transparent 70%
    );

  opacity: 0;

  transition: all 0.4s ease;
}

/* Hover */

.db-job-card:hover {

  transform:
      translateY(-6px)
      scale(1.01);

  border-color: rgba(0,245,255,0.65);

  box-shadow:
      0 0 20px rgba(0,245,255,0.18),
      0 0 50px rgba(0,245,255,0.12),
      inset 0 0 30px rgba(0,245,255,0.04);
}

.db-job-card:hover::before {
  left: 100%;
}

.db-job-card:hover::after {
  opacity: 1;
}

/* Selected Card */

.db-job-card.selected {

  border-color: #00f5ff;

  box-shadow:
      0 0 20px rgba(0,245,255,0.35),
      0 0 60px rgba(0,245,255,0.18),
      inset 0 0 30px rgba(0,245,255,0.05);
}

/* Applied Card */

.db-job-card.applied {

  opacity: 0.75;

  border-color: rgba(0,255,136,0.4);

  box-shadow:
      0 0 20px rgba(0,255,136,0.15);
}
    .db-job-card:hover {
      border-color: rgba(0,245,255,0.55);
      transform: translateY(-3px) translateX(4px);
      box-shadow: 4px 0 24px rgba(0,245,255,0.15), 0 0 40px rgba(0,245,255,0.1);
    }
    .db-job-card.selected {
      border-color: var(--cyan);
      box-shadow: 0 0 0 1px var(--cyan), 0 0 24px rgba(0,245,255,0.2);
    }
    .db-job-card.applied { opacity: 0.65; }

    /* Corner decorations */
    .db-job-card::before, .db-job-card::after {
      content: '';
      position: absolute; width: 12px; height: 12px;
      border-color: rgba(0,245,255,0.5); border-style: solid;
      pointer-events: none;
    }
    .db-job-card::before {
      top: 8px; left: 8px;
      border-width: 1px 0 0 1px;
    }
    .db-job-card::after {
      bottom: 8px; right: 8px;
      border-width: 0 1px 1px 0;
      border-color: rgba(124,58,237,0.5);
    }

    .db-job-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .db-job-check {
      width: 16px; height: 16px;
      border: 1px solid rgba(0,245,255,0.3);
      border-radius: 2px;
      background: rgba(0,245,255,0.03);
      cursor: pointer; flex-shrink: 0;
      appearance: none; -webkit-appearance: none;
      position: relative; margin-top: 3px;
      transition: all 0.15s;
    }
    .db-job-check:checked {
      background: var(--cyan);
      border-color: var(--cyan);
      box-shadow: 0 0 10px rgba(0,245,255,0.5);
    }
    .db-job-check:checked::after {
      content: '✓'; position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; color: #010409; font-weight: 800; line-height: 16px;
    }

    .db-job-info { flex: 1; min-width: 0; }
    .db-job-title {
      font-family: var(--font-body);
      font-size: 15px; font-weight: 600;
      color: rgba(255,255,255,0.9); line-height: 1.3;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .db-job-company {
      font-family: var(--font-mono);
      font-size: 10px; color: rgba(0,245,255,0.6);
      margin-top: 4px; letter-spacing: 0.1em;
    }
    .db-job-location {
      display: flex; align-items: center; gap: 5px;
      font-family: var(--font-mono);
      font-size: 9px;
      color: rgba(0,245,255,0.35); margin-top: 5px; letter-spacing: 0.08em;
    }

    .db-score-block { flex-shrink: 0; text-align: right; }
    .db-score-num {
      font-family: var(--font-display);
      font-size: 1.4rem; font-weight: 900; line-height: 1;
    }
    .db-score-label {
      font-family: var(--font-mono);
      font-size: 8px; letter-spacing: 0.2em;
      color: rgba(0,245,255,0.35); text-transform: uppercase; margin-top: 3px;
    }

    .db-score-bar-bg {
      height: 2px; background: rgba(0,245,255,0.08);
      border-radius: 2px; overflow: hidden;
    }
    .db-score-bar-fill {
      height: 100%; border-radius: 2px;
      transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
    }

    .db-job-meta { display: flex; align-items: center; justify-content: space-between; }
    .db-platform-tag {
      font-family: var(--font-mono);
      font-size: 8px; letter-spacing: 0.2em;
      text-transform: uppercase; color: rgba(0,245,255,0.35);
      padding: 3px 10px;
      border: 1px solid var(--border);
      border-radius: 2px;
      background: rgba(0,245,255,0.02);
    }
    .db-applied-badge {
      display: flex; align-items: center; gap: 5px;
      font-family: var(--font-mono);
      font-size: 9px; color: var(--green); font-weight: 500;
      letter-spacing: 0.1em;
      text-shadow: 0 0 8px var(--green);
    }

    .db-skills-mini { display: flex; flex-wrap: wrap; gap: 6px; }
    .db-skill-mini {
      padding: 3px 8px;
      border-radius: 2px;
      font-family: var(--font-mono);
      font-size: 9px; color: rgba(0,245,255,0.4);
      background: rgba(0,245,255,0.03);
      border: 1px solid var(--border);
      letter-spacing: 0.06em;
    }

    .db-apply-btn {
      width: 100%; padding: 10px;
      border-radius: 2px;
      font-family: var(--font-display);
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.15em;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all 0.2s; border: 1px solid;
      position: relative; overflow: hidden;
    }
    .db-apply-btn.default {
      background: rgba(0,245,255,0.04);
      border-color: rgba(0,245,255,0.25);
      color: var(--cyan);
    }
    .db-apply-btn.default:hover {
      background: linear-gradient(90deg, var(--cyan), var(--blue));
      border-color: transparent;
      color: #010409;
      box-shadow: 0 0 24px rgba(0,245,255,0.35);
    }
    .db-apply-btn.default:hover::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
      animation: shimmer 0.7s ease;
    }
    .db-apply-btn.applied-btn {
      background: transparent;
      border-color: rgba(0,255,136,0.3);
      color: var(--green);
      cursor: default;
      text-shadow: 0 0 8px var(--green);
    }

    /* ── DIALOG ── */
    .db-overlay {
      position: fixed; inset: 0;
      background: rgba(1,4,9,0.85);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(12px);
    }
    .db-dialog {
      background: rgba(1,4,9,0.95);
      border: 1px solid rgba(0,245,255,0.3);
      border-radius: 2px;
      padding: 32px;
      width: 440px; max-width: 90vw;
      backdrop-filter: blur(30px);
      box-shadow: 0 0 40px rgba(0,245,255,0.15), 0 30px 80px rgba(0,0,0,0.6);
      position: relative; overflow: hidden;
    }
    .db-dialog::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    }
    .db-dialog-title {
      font-family: var(--font-display);
      font-size: 1rem; font-weight: 700;
      color: var(--cyan); margin-bottom: 10px;
      letter-spacing: 0.1em;
      text-shadow: 0 0 12px rgba(0,245,255,0.4);
    }
    .db-dialog-body {
      font-family: var(--font-mono);
      font-size: 12px; color: rgba(0,245,255,0.5);
      line-height: 1.8; margin-bottom: 24px; letter-spacing: 0.06em;
    }
    .db-dialog-body strong { color: var(--cyan); }
    .db-dialog-btns { display: flex; gap: 10px; }
    .db-dialog-cancel {
      flex: 1; padding: 10px;
      border: 1px solid var(--border);
      border-radius: 2px;
      background: rgba(0,245,255,0.03);
      color: rgba(0,245,255,0.4);
      font-family: var(--font-mono);
      font-size: 11px; letter-spacing: 0.1em;
      cursor: pointer; transition: all 0.15s; text-transform: uppercase;
    }
    .db-dialog-cancel:hover { color: var(--cyan); border-color: rgba(0,245,255,0.4); }
    .db-dialog-confirm {
      flex: 1; padding: 10px; border: none;
      border-radius: 2px;
      background: linear-gradient(90deg, var(--cyan), var(--blue));
      color: #010409;
      font-family: var(--font-display);
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.15em;
      cursor: pointer; transition: all 0.15s;
      box-shadow: 0 0 20px rgba(0,245,255,0.35);
    }
    .db-dialog-confirm:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 30px rgba(0,245,255,0.5);
    }

    /* Bottom HUD bar */
    .db-hud-bar {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 20;
      display: flex; justify-content: space-between; align-items: center;
      padding: 7px 2.5rem;
      border-top: 1px solid rgba(0,245,255,0.06);
      background: rgba(1,4,9,0.85); backdrop-filter: blur(10px);
    }
    .db-hud-text {
      font-family: var(--font-mono);
      font-size: 9px; color: rgba(0,245,255,0.3); letter-spacing: 0.15em;
    }

    @media (max-width: 900px) {
      .db-sidebar { width: 220px; min-width: 220px; }
      .db-main { margin-left: 0 !important; }
      .db-content { padding: 24px 16px; }
      .db-metrics { grid-template-columns: repeat(2, 1fr); }
      .db-jobs-grid { grid-template-columns: 1fr; }
    }
  `}</style>
);

// ─── Sub-components ─────────────────────────────────────────────────────────
function SectionLabel({ children, count }) {
  return (
    <div className="db-section-label">
      <span className="db-section-line" />
      <span className="db-section-text">{children}</span>
      {count !== undefined && (
        <span className="db-section-count">// {count} results</span>
      )}
    </div>
  );
}

function MetricsRow({ jobs, skills }) {
  const top = jobs.length ? Math.max(...jobs.map(j => j.matchScore || 80)) : null;
  const avg = jobs.length
    ? Math.round(jobs.reduce((a, j) => a + (j.matchScore || 80), 0) / jobs.length)
    : null;

  const metrics = [
    { label: "JOBS MATCHED",  value: jobs.length || "—",         sub: "from resume scan",   icon: "◈" },
    { label: "SKILLS FOUND",  value: skills.length || "—",       sub: "auto-extracted",     icon: "◉" },
    { label: "TOP MATCH",     value: top ? `${top}%` : "—",      sub: "best fit score",     icon: "◫" },
    { label: "AVG SCORE",     value: avg ? `${avg}%` : "—",      sub: "across all roles",   icon: "◌" },
  ];

  return (
    <div className="db-metrics">
      {metrics.map(({ label, value, sub, icon }) => (
        <div key={label} className="db-metric">
          <span className="db-metric-label">{icon} {label}</span>
          <span className="db-metric-value">{value}</span>
          <span className="db-metric-sub">{sub}</span>
        </div>
      ))}
    </div>
  );
}

function JobCard({
  job,
  selected,
  toggleJobSelection,
  isApplied,
  showConfirmDialog,
  generateInterviewQuestions
}) {

  const score = job.matchScore || 80;
  const color = scoreColor(score);
  const applyUrl = getApplyUrl(job);

  const handleApply = () => {
    window.open(applyUrl, "_blank");
    setTimeout(() => showConfirmDialog(job), 800);
  };

  return (
    <div
      className={`db-job-card ${
        selected ? "selected" : ""
      } ${
        isApplied ? "applied" : ""
      }`}
    >
      <div className="db-job-top">

        <div className="db-job-info">

          <div className="db-job-title">
            {getJobTitle(job)}
          </div>

          <div className="db-job-company">
            {job.company}
          </div>

          <div className="db-job-location">
            <MapPin size={10} />
            {job.location || "Remote"}
          </div>

        </div>

        <div className="db-score-block">

          <div
            className="db-score-num"
            style={{
              color,
              textShadow: `0 0 12px ${color}`
            }}
          >
            {score}%
          </div>

          <div className="db-score-label">
            MATCH
          </div>

        </div>

      </div>

      <div className="db-score-bar-bg">

        <div
          className="db-score-bar-fill"
          style={{
            width: `${score}%`,
            background: `linear-gradient(
              90deg,
              ${color},
              var(--cyan)
            )`,
            boxShadow: `0 0 8px ${color}`
          }}
        />

      </div>

      <div className="db-job-meta">

        <span className="db-platform-tag">
          {job.platform || "INDEED"}
        </span>

        {isApplied && (
          <span className="db-applied-badge">
            <CheckCircle2 size={11} />
            APPLIED
          </span>
        )}

      </div>

      {job.skills?.length > 0 && (

        <div className="db-skills-mini">

          {job.skills.slice(0, 4).map((skill, index) => (

            <span
              key={index}
              className="db-skill-mini"
            >
              {skill}
            </span>

          ))}

          {job.skills.length > 4 && (
            <span className="db-skill-mini">
              +{job.skills.length - 4}
            </span>
          )}

        </div>

      )}

      <button
        onClick={handleApply}
        disabled={isApplied}
        className={`db-apply-btn ${
          isApplied
            ? "applied-btn"
            : "default"
        }`}
      >
        {isApplied ? (
          <>
            <CheckCircle2 size={13} />
            APPLIED
          </>
        ) : (
          <>
            <ExternalLink size={13} />
            APPLY NOW
          </>
        )}
      </button>

      <button
        className="db-apply-btn default"
        onClick={() =>
          generateInterviewQuestions(job)
        }
        style={{ marginTop: "10px" }}
      >
        PREPARE INTERVIEW
      </button>

    </div>
  );
}

function NeuralWaitingPanel() {
  return (
    <div className="db-neural-panel">

      <div className="db-neural-grid">
        <div className="node n1"></div>
        <div className="node n2"></div>
        <div className="node n3"></div>

        <div className="node n4"></div>
        <div className="node n5"></div>
        <div className="node n6"></div>

        <div className="node n7"></div>
        <div className="node n8"></div>
        <div className="node n9"></div>

      </div>

      <div className="db-neural-content">
        <div className="db-neural-title">
          NEURAL MATCH ENGINE READY
        </div>

        <div className="db-neural-sub">
          WAITING FOR RESUME INPUT...
        </div>
      </div>

    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [active, setActive] = useState(0);
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [bulkStatus, setBulkStatus] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useState("Noida");
  const [selectedFile, setSelectedFile] =useState(null);
  const [scanStage, setScanStage] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [atsData, setAtsData] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [selectedJobForInterview, setSelectedJobForInterview] = useState(null);
  const [loadingInterview, setLoadingInterview] = useState(false);
  const [error, setError] = useState(null);

  const fileRef = useRef();

const handleFile = async (file) => {
  if (!file) return;

  setResume(file);
  setLoading(true);
  setError(null);
  setSkills([]);
  setJobs([]);
  setAtsData(null);

  try {
    const data = await uploadResume(file, location);
    console.log("API Response:", data);
    console.log("ATS Data:", data.atsAnalysis);
    setSkills(data.skills || []);
    setJobs(data.matchedJobs || []);
    setAtsData(data.atsAnalysis);
  } catch (e) {
    console.error("Upload Error:", e);
    const msg = e.response?.data?.error || e.message || "Failed to communicate with the scanner service at port 8080. Please make sure the service is running.";
    setError(msg);
  } finally {
    setLoading(false);
  }
};

  
  const formData = new FormData();

formData.append("file", selectedFile);

formData.append(
  "location",
  location
);

const stages = [
  "Parsing Resume...",
  "Extracting Skills...",
  "Analyzing Experience...",
  "Matching Jobs...",
  "Ranking Candidates...",
  "Generating Recommendations..."
];

const logs = [
  "Resume uploaded",
  "Extracting skills",
  "Analyzing experience",
  "Matching jobs",
  "Ranking candidates",
  "Generating recommendations"
];

useEffect(() => {
  if (!loading) {
    setVisibleLogs([]);
    return;
  }

  const logsData = [
    "Resume uploaded",
    "Extracting skills",
    "Analyzing experience",
    "Matching jobs",
    "Ranking candidates",
    "Generating recommendations"
  ];

  
  let index = 0;

  const interval = setInterval(() => {
    if (index < logsData.length) {
      setVisibleLogs(prev => [...prev, logsData[index]]);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 700);

  return () => clearInterval(interval);
}, [loading]);

useEffect(() => {
  if (!loading) return;

  const interval = setInterval(() => {
    setScanStage(prev => (prev + 1) % stages.length);
  }, 1000);

  return () => clearInterval(interval);
}, [loading]);
  const toggleJobSelection = (job) => {
    const exists = selectedJobs.find(j => j.applyLink === job.applyLink);
    setSelectedJobs(exists
      ? selectedJobs.filter(j => j.applyLink !== job.applyLink)
      : [...selectedJobs, job]
    );
  };

  const handleBulkApply = async () => {
    if (selectedJobs.length === 0) { alert("Select at least one job"); return; }
    setBulkStatus("loading");
    const updated = { ...appliedJobs };
    try {
      for (const job of selectedJobs) {
        if (job.applyLink?.startsWith("http")) {
          await axios.post("http://localhost:8081/api/automation/apply", {
            applyLink: job.applyLink,
            title: job.title,
            company: job.company,
            location: job.location,
            resumePath: "C:/Users/cnd44/OneDrive/Desktop/resume.pdf",
            name: "Palash Mishra",
            email: "yourmail@gmail.com",
          }, { timeout: 120000 });
          updated[job.applyLink] = true;
        }
      }
      setAppliedJobs(updated);
      setSelectedJobs([]);
      setBulkStatus("success");
    } catch (err) {
      console.error("Automation Error:", err);
      setBulkStatus("error");
    } finally {
      setTimeout(() => setBulkStatus(null), 2500);
    }
  };

const generateInterviewQuestions = async (job) => {

  console.log("Function entered");

  try {

    console.log("Job Data:", job);

    const payload = {
      jobTitle: job.title || job.role,
      skills: job.skills || []
    };

    console.log("Payload:", payload);

    const response = await axios.post(
      "http://localhost:8081/api/interview/questions",
      payload
    );

    console.log("API Success");
    console.log(response.data);

    setInterviewQuestions(response.data);
    setSelectedJobForInterview(job);

  } catch (error) {

    console.error("API ERROR", error);

  }
};

  const markJobAsApplied = (job) => {
    setAppliedJobs(prev => ({ ...prev, [job.applyLink]: true }));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <>
      <FontLoader />
      <div className="db-root">
        {/* Atmosphere layers */}
        <div className="db-scanline" />
        <div className="db-crt" />
        <div className="db-vignette" />
        <div className="db-orb-1" />
        <div className="db-orb-2" />

        {/* ── SIDEBAR ── */}
        <aside className={`db-sidebar ${sidebarOpen ? "" : "closed"}`}>
          <div className="db-logo-block">
            <div className="db-logo">
              <div className="db-logo-dot" />
              JOB<span>SCAN</span>
              <span className="db-logo-sub">AI v4</span>
            </div>
            <button className="db-sidebar-close" onClick={() => setSidebarOpen(false)}>
              <X size={13} />
            </button>
          </div>

          <nav className="db-nav">
            <div className="db-nav-divider">NAVIGATION</div>
            {NAV.map((n, i) => {
              const Icon = n.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`db-nav-item ${active === i ? "active" : ""}`}
                >
                  <Icon size={13} />
                  {n.label}
                  <span className="nav-arrow">▶</span>
                </button>
              );
            })}
          </nav>

          {/* Status strip */}
          <div className="db-sidebar-status">
            <div className="db-status-row">
              <span className="db-status-label">LINKEDIN</span>
              <span className="db-status-val-live">LIVE</span>
            </div>
            <div className="db-status-row">
              <span className="db-status-label">NAUKRI</span>
              <span className="db-status-val-live">LIVE</span>
            </div>
            <div className="db-status-row">
              <span className="db-status-label">INDEED</span>
              <span className="db-status-val-sync">SYNC</span>
            </div>
            <div className="db-status-row">
              <span className="db-status-label">AI CORE</span>
              <span className="db-status-val-live">ONLINE</span>
            </div>
          </div>

          <div className="db-sidebar-bottom">
            <div className="db-user-chip">
              <div className="db-avatar">PM</div>
              <div>
                <div className="db-user-name">PALASH MISHRA</div>
                <div className="db-user-role">// job seeker</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className={`db-main ${sidebarOpen ? "" : "full"}`}>

          {/* TOPBAR */}
          <div className="db-topbar">
            <button className="db-menu-btn" onClick={() => setSidebarOpen(s => !s)}>
              <Menu size={15} />
            </button>
            <div className="db-breadcrumb">
              <strong>JOBSCAN AI v4</strong>
              <ChevronRight size={11} />
              <span>DASHBOARD</span>
            </div>
            <div className="db-status-dot" />
            <div className="db-search">
              <Radio size={11} color="rgba(0,245,255,0.4)" />
              <input placeholder="search jobs, skills, companies…" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="db-content">

            {/* PAGE HEADER */}
            <div className="db-page-header">
              <div>
                <div className="db-page-eyebrow">career.intelligence // v2.0</div>
                <h1 className="db-page-title">NEURAL MATCH<br/>COMMAND CENTER</h1>
                <p className="db-page-sub">// upload resume → run AI scan → unlock matched opportunities</p>
              </div>
              <div className="db-ai-badge">
                <Cpu size={11} /> NEURAL ENGINE ONLINE
              </div>
            </div>

            {/* METRICS */}
            <MetricsRow jobs={jobs} skills={skills} />

            {/* UPLOAD */}
            <div
              className={`db-upload ${drag ? "drag" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current.click()}
            >
              <input
                ref={fileRef}
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div className="db-upload-inner">
                <div className="db-upload-icon-wrap">
                  {resume ? <CheckCircle2 size={26} /> : <Upload size={26} />}
                </div>
                <div style={{ flex: 1 }}>
                  {resume ? (
                    <>
                      <div className="db-upload-title">{resume.name}</div>
                      <div className="db-upload-sub">// UPLOADED — CLICK TO REPLACE</div>
                    </>
                  ) : (
                    <>
                      <div className="db-upload-title">DROP YOUR RÉSUMÉ HERE</div>
                      <div className="db-upload-sub">// PDF, DOC, DOCX · ENCRYPTED PIPELINE</div>
                      <div className="db-upload-tags">
                        {UPLOAD_HINTS.map(h => (
                          <span key={h} className="db-upload-tag">{h}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
{!resume && !loading && (
  <NeuralWaitingPanel />
)}

<AtsScoreCard atsData={atsData} />

{atsData?.missingKeywords?.length > 0 && (

<div className="db-panel" style={{ padding: "25px" }}>

  <h3 style={{ color: "#ff5555" }}>
    Missing Keywords
  </h3>

  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "15px"
    }}
  >
    {atsData.missingKeywords.map(keyword => (

      <span
        key={keyword}
        className="db-skill-pill"
      >
        {keyword}
      </span>

    ))}
  </div>

</div>

)}

            {/* LOADING */}
            {loading && (
  <div className="db-loading-card">

    {/* Radar Scanner */}
   <div className="db-radar">
  <div className="db-radar-ring"></div>
  <div className="db-radar-ring ring2"></div>
  <div className="db-radar-center"></div>
</div>

    {/* Analysis Content */}
    <div className="db-loading-content">

      <h3 className="db-analysis-title">
        AI Resume Analysis
      </h3>

      <div className="db-scan-stage">
        {stages[scanStage]}
      </div>

      <div className="db-progress-percent">
        {Math.round(((scanStage + 1) / stages.length) * 100)}%
      </div>

      <div className="db-loading-bar">
        <div
          className="db-loading-fill"
          style={{
            width: `${((scanStage + 1) / stages.length) * 100}%`
          }}
        />
      </div>

      <div className="db-terminal">
        {visibleLogs.map((log, index) => (
          <div key={index} className="db-terminal-line">
            {">"} {log}
          </div>
        ))}
      </div>

    </div>

  </div>
)}

            {/* SKILLS */}
            {skills.length > 0 && (
              <div style={{ opacity: 0, animation: "fadeUp 0.5s 0.1s ease forwards" }}>
                <SectionLabel count={skills.length}>EXTRACTED SKILLS</SectionLabel>
                <div className="db-skills-wrap">
                  {skills.map((s, i) => (
                    <span key={i} className="db-skill-pill">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* JOBS */}
            {jobs.length > 0 && (
              <div style={{ opacity: 0, animation: "fadeUp 0.5s 0.2s ease forwards" }}>
                <div className="db-jobs-header">
                  <div>
                    <SectionLabel count={jobs.length}>AI RECOMMENDED JOBS</SectionLabel>
                    <span className="db-jobs-count">// {selectedJobs.length} SELECTED</span>
                  </div>
                  <button
                    onClick={handleBulkApply}
                    disabled={bulkStatus === "loading" || selectedJobs.length === 0}
                    className="db-bulk-btn"
                  >
                    <Briefcase size={13} />
                    {bulkStatus === "loading" ? "APPLYING…"
                      : bulkStatus === "success" ? "◉ APPLIED"
                      : `◈ BULK APPLY (${selectedJobs.length})`}
                  </button>
                </div>
                <div className="db-jobs-grid">
                  {jobs.map((job, i) => (
                    <JobCard
                      key={i}
                      job={job}
                      selected={!!selectedJobs.find(j => j.applyLink === job.applyLink)}
                      toggleJobSelection={toggleJobSelection}
                      isApplied={!!appliedJobs[job.applyLink]}
                      showConfirmDialog={setConfirmDialog}
                      generateInterViewQuestions={generateInterviewQuestions}
                    />
                  ))}
                </div>
                {
selectedJobForInterview && (

<div
  className="db-panel"
  style={{
    padding: "24px",
    marginTop: "20px"
  }}
>

  <h2 style={{ marginBottom: "20px" }}>
    Interview Preparation
  </h2>

  <div style={{ marginBottom: "20px" }}>
    <strong>
      {selectedJobForInterview.title ||
       selectedJobForInterview.role}
    </strong>
  </div>

  {loadingInterview ? (

      <div>Loading Questions...</div>

  ) : (

      interviewQuestions.map((q,index) => (

          <div
            key={index}
            style={{
              marginBottom:"15px",
              padding:"15px",
              border:"1px solid rgba(0,245,255,.2)",
              borderRadius:"6px"
            }}
          >

            <div>
              <strong>{q.category}</strong>
            </div>

            <div style={{marginTop:"8px"}}>
              {q.question}
            </div>

            <div
              style={{
                marginTop:"8px",
                opacity:.7
              }}
            >
              Difficulty: {q.difficulty}
            </div>

          </div>

      ))

  )}

</div>

)}
              </div>
            )}
          </div>
        </div>

        {/* DIALOG */}
        {confirmDialog && (
          <div className="db-overlay">
            <div className="db-dialog">
              <div className="db-dialog-title">◈ CONFIRM APPLICATION</div>
              <div className="db-dialog-body">
                Did you complete your application for{" "}
                <strong>{getJobTitle(confirmDialog)}</strong> at{" "}
                <strong>{confirmDialog.company}</strong>?
              </div>
              <div className="db-dialog-btns">
                <button className="db-dialog-cancel" onClick={() => setConfirmDialog(null)}>
                  NOT YET
                </button>
                <button
                  className="db-dialog-confirm"
                  onClick={() => {
                    markJobAsApplied(confirmDialog);
                    setConfirmDialog(null);
                  }}
                >
                  ◉ MARK APPLIED
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom HUD bar */}
        <div className="db-hud-bar">
          <span className="db-hud-text">JOBSCAN_AI // NEURAL_MATCH_ENGINE // BUILD_4.2.1</span>
          <span className="db-hud-text">[SYS::ALL_NODES_ONLINE] ◈ LAT:28.6ms</span>
        </div>
      </div>
    </>
  );
}