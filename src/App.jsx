import { useState, useEffect } from "react";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fishOrbit1 {
    0%   { transform: rotate(0deg) translateX(90px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
  }
  @keyframes fishOrbit2 {
    0%   { transform: rotate(120deg) translateX(90px) rotate(-120deg); }
    100% { transform: rotate(480deg) translateX(90px) rotate(-480deg); }
  }
  @keyframes fishOrbit3 {
    0%   { transform: rotate(240deg) translateX(90px) rotate(-240deg); }
    100% { transform: rotate(600deg) translateX(90px) rotate(-600deg); }
  }
  @keyframes bubbleRise {
    0%   { transform: translateY(0) scale(1); opacity: 0.6; }
    100% { transform: translateY(-120px) scale(0.4); opacity: 0; }
  }
  @keyframes fadeMsg {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    0%   { transform: scale(0.85); opacity: 0; }
    70%  { transform: scale(1.04); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes swimRight {
    0%   { transform: translateX(calc(100vw + 120px)); opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { transform: translateX(-120px); opacity: 0; }
  }
  @keyframes swimLeft {
    0%   { transform: translateX(calc(100vw + 120px)) scaleX(-1); opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { transform: translateX(-120px) scaleX(-1); opacity: 0; }
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-6deg); }
    50%       { transform: rotate(6deg); }
  }
  @keyframes floatUp {
    0%   { transform: translateY(0) scale(1); opacity: 0.5; }
    100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
  }
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); }
    to   { transform: translateX(100%); }
  }

  .static-bg {
    background: linear-gradient(160deg, #e0f2fe 0%, #bae6fd 35%, #7dd3fc 65%, #38bdf8 100%);
  }
  .static-bg-loading {
    background: linear-gradient(160deg, #0ea5e9 0%, #38bdf8 40%, #7dd3fc 70%, #bae6fd 100%);
  }
  .slide-in  { animation: slideInRight 0.35s cubic-bezier(0.4,0,0.2,1) forwards; }
  .slide-out { animation: slideOutRight 0.35s cubic-bezier(0.4,0,0.2,1) forwards; }
  .fade-msg { animation: fadeMsg 0.3s ease forwards; }
  .fade-in  { animation: fadeIn 0.5s ease forwards; }
  .pop-in   { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  body { background: #e0f2fe; }
`;

/* ─── DEMO DATA ─── */
const ASSIGNMENTS = {
  "0": { courseName: "MTH-2554", name: "Attendance", deadline: "2026-03-30 18:27" },
  "1": { courseName: "MTH-2554", name: "Attendance", deadline: "2026-04-01 18:27" },
  "2": { courseName: "MTH-2554", name: "Attendance", deadline: "2026-04-03 18:27" },
  "3": { courseName: "MTH-2554", name: "Attendance", deadline: "2026-04-06 18:27" },
  "4": { courseName: "CSI-4240", name: "Assignment One is due", deadline: "2026-04-07 03:59" },
  "5": { courseName: "MTH-2554", name: "Attendance", deadline: "2026-04-08 18:27" },
  "6": { courseName: "MTH-2554", name: "Attendance", deadline: "2026-04-10 18:27" },
  "7": { courseName: "MTH-2554", name: "Attendance", deadline: "2026-04-13 18:27" },
  "8": { courseName: "MTH-2554", name: "Attendance", deadline: "2026-04-15 18:27" },
  "9": { courseName: "MTH-2554", name: "Attendance", deadline: "2026-04-17 18:27" },
};

/* ─── SLIDE PANELS ─── */

function SlidePanel({ title, onClose, children }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(7,89,133,0.3)", backdropFilter: "blur(4px)",
      }} />
      <div className="slide-in" style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(480px, 100vw)", zIndex: 201,
        background: "linear-gradient(160deg, #e0f2fe, #bae6fd)",
        boxShadow: "-8px 0 48px rgba(2,132,199,0.2)",
        overflowY: "auto", display: "flex", flexDirection: "column",
      }}>
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: "1.5px solid rgba(186,230,253,0.6)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(255,255,255,0.4)", backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 1,
        }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: "800", color: "#0c4a6e" }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(186,230,253,0.8)",
            borderRadius: "100px", width: "36px", height: "36px",
            cursor: "pointer", fontSize: "18px", color: "#0369a1",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.9)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.6)")}
          >×</button>
        </div>
        <div style={{ padding: "28px", flex: 1 }}>{children}</div>
      </div>
    </>
  );
}

function AboutUsPanel({ onClose }) {
  const team = [
    { name: "Marian", role: "UI / Frontend", emoji: "🎨" },
    { name: "River", role: "Backend", emoji: "⚙️" },
    { name: "Hannah", role: "Scraping", emoji: "🕷️" },
  ];
  return (
    <SlidePanel title="About Us 🐟" onClose={onClose}>
      <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: "20px", border: "1.5px solid rgba(255,255,255,0.8)", padding: "24px", marginBottom: "24px" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "#0284c7", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "10px" }}>THE PROJECT</div>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: "800", color: "#0c4a6e", marginBottom: "12px" }}>catFish 🐠</h3>
        <p style={{ color: "#075985", fontSize: "14px", lineHeight: 1.7 }}>
          catFish is a Moodle assignment scraper built at GrizzHacks 2026.
          It automatically pulls all your assignments and deadlines from Moodle
          and lets you export them or add them directly to Google Calendar —
          so you never miss a due date again.
        </p>
      </div>
      <div style={{ fontSize: "12px", fontWeight: "700", color: "#0284c7", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "14px" }}>THE TEAM</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        {team.map((m, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.55)", borderRadius: "16px", border: "1.5px solid rgba(255,255,255,0.8)", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #0284c7, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{m.emoji}</div>
            <div>
              <div style={{ fontWeight: "800", color: "#0c4a6e", fontSize: "15px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.name}</div>
              <div style={{ color: "#0369a1", fontSize: "13px", marginTop: "2px" }}>{m.role}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(2,132,199,0.08)", borderRadius: "16px", border: "1.5px solid rgba(186,230,253,0.6)", padding: "18px 20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "#0284c7", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "6px" }}>BUILT AT</div>
        <div style={{ fontWeight: "800", color: "#0c4a6e", fontSize: "16px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>🏆 GrizzHacks 2026</div>
        <div style={{ color: "#0369a1", fontSize: "13px", marginTop: "4px" }}>Oakland University — Auburn Hills</div>
      </div>
    </SlidePanel>
  );
}

function HowToUsePanel({ onClose }) {
  const steps = [
    { n: "1", title: "Click Let's Start", desc: "Hit the button on the welcome screen to begin the setup process." },
    { n: "2", title: "Enter your Moodle credentials", desc: "Type in your Moodle username and password. Your credentials are never stored." },
    { n: "3", title: "Wait for catFish to work", desc: "We'll scrape all your courses and assignments automatically. This takes about 10 seconds." },
    { n: "4", title: "Export your assignments", desc: "Download as TXT, CSV, or JSON — or add everything straight to Google Calendar in one click." },
  ];
  const faqs = [
    { q: "Is my password safe?", a: "Yes! We never store your credentials. They're only used once to log in and scrape your data." },
    { q: "Which Moodle does this work with?", a: "It works with any standard Moodle instance. Just use the same login you use on your school's Moodle site." },
    { q: "What formats can I export?", a: "TXT, CSV, and JSON. You can also add directly to Google Calendar." },
    { q: "Why are some assignments missing?", a: "Only assignments with visible due dates are scraped. Hidden or unscheduled tasks won't appear." },
  ];
  return (
    <SlidePanel title="How to Use 🌊" onClose={onClose}>
      <div style={{ fontSize: "12px", fontWeight: "700", color: "#0284c7", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "14px" }}>STEPS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.55)", borderRadius: "16px", border: "1.5px solid rgba(255,255,255,0.8)", padding: "18px 20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #0284c7, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "15px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.n}</div>
            <div>
              <div style={{ fontWeight: "800", color: "#0c4a6e", fontSize: "15px", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: "4px" }}>{s.title}</div>
              <div style={{ color: "#075985", fontSize: "13px", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: "12px", fontWeight: "700", color: "#0284c7", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "14px" }}>FAQ</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {faqs.map((f, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.55)", borderRadius: "14px", border: "1.5px solid rgba(255,255,255,0.8)", padding: "16px 20px" }}>
            <div style={{ fontWeight: "800", color: "#0c4a6e", fontSize: "14px", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: "6px" }}>{f.q}</div>
            <div style={{ color: "#075985", fontSize: "13px", lineHeight: 1.6 }}>{f.a}</div>
          </div>
        ))}
      </div>
    </SlidePanel>
  );
}

/* ─── NAV ─── */

function AquariumNav({ onHome, onAbout, onHowTo }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "60px", zIndex: 100,
      background: "rgba(7, 89, 133, 0.75)", backdropFilter: "blur(16px)",
      borderBottom: "1.5px solid rgba(125,211,252,0.3)",
    }}>
      <div style={{ height: "100%", display: "flex", alignItems: "center", padding: "0 28px", justifyContent: "space-between" }}>
        <div onClick={onHome} style={{ cursor: onHome ? "pointer" : "default" }}>
          <img src="/src/catfish_logo.png" alt="logo" style={{ width: "240px", height: "140px", objectFit: "contain" }} />
        </div>
        <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: "100px", padding: "6px 16px" }}>
          {[["About Us", onAbout], ["How to Use", onHowTo]].map(([label, handler]) => (
            <button key={label} onClick={handler} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#fff", fontSize: "14px", fontWeight: "700",
              fontFamily: "inherit", letterSpacing: "0.02em",
              padding: "4px 12px", borderRadius: "100px", transition: "background 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >{label}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ─── SHARED ─── */

function WaveProgressBar({ step, total }) {
  const pct = (step / total) * 100;
  const BAR_FISH = [
    { emoji: "🐠", size: 18, top: 4,  duration: 16, delay: 0  },
    { emoji: "🐟", size: 14, top: 20, duration: 22, delay: 5  },
    { emoji: "🐡", size: 12, top: 8,  duration: 18, delay: 10 },
    { emoji: "🐠", size: 15, top: 16, duration: 20, delay: 3  },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "56px", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: `${pct}%`, height: "100%", background: "linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)", transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", zIndex: 2, pointerEvents: "none" }}>
        <defs>
          <clipPath id="fillClip">
            <rect x="0" y="0" width={`${pct}%`} height="56" />
          </clipPath>
        </defs>
        <path clipPath="url(#fillClip)" d="M0,28 C180,0 360,56 540,28 C720,0 900,56 1080,28 C1260,0 1440,42 1440,28 L1440,56 L0,56 Z" fill="#7dd3fc" opacity="0.6" />
        <path clipPath="url(#fillClip)" d="M0,36 C200,10 400,52 600,32 C800,12 1000,52 1200,32 C1320,20 1400,40 1440,36 L1440,56 L0,56 Z" fill="#0ea5e9" opacity="0.8" />
        {[5, 15, 28, 42, 58, 72, 86, 95].map((left, i) => (
          <rect key={i} x={`${left}%`} y={56 - 10 - (i % 3) * 6} width="4" height={10 + (i % 3) * 6} fill="rgba(52,211,153,0.45)" rx="2"
            style={{ transformOrigin: `${left}% 56px`, animation: `sway ${2.5 + i * 0.3}s ease-in-out ${i * 0.25}s infinite` }} />
        ))}
        {Array.from({ length: total }).map((_, i) => {
          const x = ((i + 0.5) / total) * 1440;
          const done = i < step;
          return <circle key={i} cx={x} cy="28" r="5" fill={done ? "#fff" : "#bae6fd"} opacity={done ? 1 : 0.4} />;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", overflow: "hidden" }}>
        {BAR_FISH.map((f, i) => (
          <span key={i} style={{ position: "absolute", top: `${f.top}px`, fontSize: `${f.size}px`, display: "inline-block", animation: `swimRight ${f.duration}s linear ${f.delay}s infinite` }}>{f.emoji}</span>
        ))}
        {[20, 45, 68, 88].map((left, i) => (
          <div key={i} style={{ position: "absolute", bottom: "4px", left: `${left}%`, width: "4px", height: "4px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.6)", animation: `floatUp ${1.6 + i * 0.4}s ease-in ${i * 0.6}s infinite` }} />
        ))}
      </div>
      <div style={{ position: "absolute", right: "16px", bottom: "14px", color: pct > 85 ? "#fff" : "#0369a1", fontSize: "12px", fontWeight: "700", zIndex: 4, fontFamily: "monospace" }}>{step} / {total}</div>
    </div>
  );
}

function BottomWaves() {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ position: "absolute", bottom: "56px", left: 0, width: "100%", height: "120px", zIndex: 0 }}>
      <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,40 1440,60 L1440,120 L0,120 Z" fill="#0c4a6e" opacity="0.08" />
      <path d="M0,80 C240,40 480,110 720,80 C960,50 1200,100 1440,80 L1440,120 L0,120 Z" fill="#0369a1" opacity="0.1" />
    </svg>
  );
}

/* ─── WINDOW 1: WELCOME ─── */

function WelcomeScreen({ onStart }) {
  return (
    <div className="static-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      <svg viewBox="0 0 200 60" style={{ position: "absolute", top: "110px", left: "8%", width: "120px", opacity: 0.4 }}>
        <path d="M10,30 Q40,10 70,30" stroke="#0284c7" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M70,30 Q100,10 130,30" stroke="#0284c7" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M50,50 Q80,30 110,50" stroke="#0284c7" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <div className="fade-in" style={{ textAlign: "center", maxWidth: "640px", zIndex: 1 }}>
        <div style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", textTransform: "uppercase", color: "#0369a1", marginBottom: "16px", fontFamily: "monospace" }}>✦ Welcome ✦</div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(48px, 8vw, 80px)", fontWeight: "800", lineHeight: 1.05, color: "#0c4a6e", marginBottom: "24px" }}>
          Ride the Wave<br />
          <span style={{ background: "linear-gradient(90deg, #0284c7, #0ea5e9, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>of your schedule.</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 2.5vw, 22px)", color: "#075985", lineHeight: 1.6, fontWeight: "500", maxWidth: "480px", margin: "0 auto 48px" }}>
          Add all your assignments to your calendar{" "}
          <strong style={{ color: "#0284c7" }}>in just 3 steps.</strong>
        </p>
        <button onClick={onStart} style={{ background: "linear-gradient(135deg, #0284c7, #0ea5e9)", border: "none", borderRadius: "100px", padding: "18px 56px", color: "#fff", fontSize: "18px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 32px rgba(2,132,199,0.4)", letterSpacing: "0.04em", transition: "transform 0.15s, box-shadow 0.15s", display: "block", margin: "0 auto" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(2,132,199,0.5)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(2,132,199,0.4)"; }}
        >Let's Start →</button>
        <p style={{ marginTop: "16px", color: "#0369a1", fontSize: "13px", opacity: 0.7 }}>No account needed · Free to use</p>
      </div>
      <BottomWaves />
    </div>
  );
}

/* ─── WINDOW 2: LOGIN ─── */
/* LoginScreen RECEIVES onLogin and onBack as props from App (defined in ROOT)*/

function LoginScreen({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");

  const inputStyle = (name) => ({
    width: "100%", padding: "14px 16px", borderRadius: "14px",
    border: focused === name ? "2px solid #0ea5e9" : "2px solid rgba(186,230,253,0.6)",
    background: "rgba(255,255,255,0.7)", fontSize: "15px", color: "#0c4a6e",
    fontFamily: "inherit", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focused === name ? "0 0 0 4px rgba(14,165,233,0.15)" : "none",
  });

  const ready = username.trim() && password.trim();

  return (
    <div className="static-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      <div className="fade-in" style={{ width: "100%", maxWidth: "440px", background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)", borderRadius: "28px", border: "1.5px solid rgba(255,255,255,0.8)", padding: "48px 40px", boxShadow: "0 8px 48px rgba(2,132,199,0.15), 0 2px 8px rgba(0,0,0,0.06)", zIndex: 1 }}>
        <div style={{ display: "inline-block", background: "rgba(14,165,233,0.12)", color: "#0284c7", borderRadius: "100px", padding: "4px 14px", fontSize: "12px", fontWeight: "700", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "20px" }}>STEP 1 OF 3</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "30px", fontWeight: "800", color: "#0c4a6e", marginBottom: "8px", lineHeight: 1.1 }}>
          Enter your Moodle<br />
          <span style={{ background: "linear-gradient(90deg, #0284c7, #0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>credentials.</span>
        </h2>
        <p style={{ color: "#0369a1", fontSize: "14px", marginBottom: "32px", lineHeight: 1.5, opacity: 0.8 }}>We'll use these to fetch your assignments securely.</p>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#0369a1", marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "monospace" }}>Username</label>
          <input type="text" placeholder="your.username" value={username} onChange={(e) => setUsername(e.target.value)} onFocus={() => setFocused("username")} onBlur={() => setFocused("")} style={inputStyle("username")} />
        </div>
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#0369a1", marginBottom: "8px", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "monospace" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocused("password")} onBlur={() => setFocused("")} style={{ ...inputStyle("password"), paddingRight: "48px" }} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#0369a1", fontSize: "16px", opacity: 0.6 }}>{showPassword ? "🙈" : "👁️"}</button>
          </div>
        </div>

        {/* THIS is where onLogin gets called. If ready=true (both fields filled)*/}
        {/* it calls onLogin() which triggers setStep(2) back in App → goes to loading screen*/}
        <button onClick={() => ready && onLogin(username, password)} style={{ width: "100%", background: ready ? "linear-gradient(135deg, #0284c7, #0ea5e9)" : "rgba(186,230,253,0.5)", border: "none", borderRadius: "14px", padding: "16px", color: ready ? "#fff" : "#93c5fd", fontSize: "16px", fontWeight: "700", cursor: ready ? "pointer" : "not-allowed", fontFamily: "inherit", letterSpacing: "0.04em", transition: "all 0.2s", boxShadow: ready ? "0 6px 24px rgba(2,132,199,0.35)" : "none", marginBottom: "12px" }}
          onMouseEnter={(e) => { if (ready) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(2,132,199,0.45)"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ready ? "0 6px 24px rgba(2,132,199,0.35)" : "none"; }}
        >Log In</button>

        {/* This is where onBack gets called → triggers setStep(0) back in App → goes to welcome screen */}
        <button onClick={onBack} style={{ width: "100%", background: "none", border: "1.5px solid rgba(186,230,253,0.8)", borderRadius: "14px", padding: "13px", color: "#0369a1", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >← Back to Home</button>
        <p style={{ textAlign: "center", marginTop: "16px", color: "#0369a1", fontSize: "12px", opacity: 0.6 }}>🔒 Your credentials are never stored.</p>
      </div>
      <BottomWaves />
    </div>
  );
}

/* ─── WINDOW 3: LOADING ─── */

const LOADING_MESSAGES = [
  "Connecting to Moodle...",
  "Fetching your courses...",
  "Retrieving assignments...",
  "Scanning due dates...",
  "Reeling in your data...",
  "Almost there...",
];

function LoadingScreen({ onDone, loggedUser, loggedPassword }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [items, setItems] = useState([]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => { setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length); setFade(true); }, 300);
    }, 1800);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const progInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(progInterval); setTimeout(onDone, 600); return 100; }
        return p + 1;
      });
    }, 105);
    return () => clearInterval(progInterval);
  }, [onDone]);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/login-submit?user=${loggedUser}&pass=${loggedPassword}`)
            .then((res) => res.json())
            .then((json) => {
                setItems(json);
                setDataIsLoaded(true);
            });
    }, [loggedUser,loggedPassword]); 
	console.log(items);

  return (
    <div className="static-bg-loading" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      <div style={{ zIndex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
        <div style={{ position: "relative", width: "200px", height: "200px" }}>
          <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", border: "2px dashed rgba(2,132,199,0.25)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <img src="/src/loading-logo.png" alt="logo" style={{ width: "80px", height: "80px", objectFit: "contain" }} />
          </div>
          <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: "-12px", marginLeft: "-12px", animation: "fishOrbit1 3s linear infinite" }}>
            <span style={{ fontSize: "22px" }}>🐠</span>
          </div>
          <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: "-12px", marginLeft: "-12px", animation: "fishOrbit2 3s linear infinite" }}>
            <span style={{ fontSize: "18px" }}>🐟</span>
          </div>
          <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: "-12px", marginLeft: "-12px", animation: "fishOrbit3 3s linear infinite" }}>
            <span style={{ fontSize: "16px" }}>🐡</span>
          </div>
          <div style={{ position: "absolute", bottom: "20px", left: "40px", width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.7)", animation: "bubbleRise 2.4s ease-in infinite" }} />
          <div style={{ position: "absolute", bottom: "30px", left: "110px", width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.6)", animation: "bubbleRise 2.4s ease-in 0.8s infinite" }} />
          <div style={{ position: "absolute", bottom: "10px", left: "75px", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.5)", animation: "bubbleRise 2.4s ease-in 1.6s infinite" }} />
        </div>
        <div style={{ minHeight: "32px" }}>
          <p key={msgIndex} className="fade-msg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: "700", color: "#0c4a6e", opacity: fade ? 1 : 0, transition: "opacity 0.3s" }}>{LOADING_MESSAGES[msgIndex]}</p>
        </div>
        <div style={{ width: "280px" }}>
          <div style={{ height: "8px", borderRadius: "100px", background: "rgba(255,255,255,0.4)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #0284c7, #38bdf8)", borderRadius: "100px", transition: "width 0.1s linear" }} />
          </div>
          <p style={{ marginTop: "10px", fontSize: "13px", color: "#0369a1", fontFamily: "monospace", fontWeight: "600" }}>{progress}%</p>
        </div>
      </div>
      <BottomWaves />
    </div>
  );
}

/* ─── WINDOW 4: DONE / EXPORT ─── */

function DoneScreen({ onRestart, loggedUser, jsonString }) {
  const [format, setFormat] = useState("json");
  const [downloaded, setDownloaded] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Convert object with numbered keys to array so we can map over it
  const jsonObject = Object.values(assignments);

  const handleCopy = () => {
    const tableText = [
      ["Course Name", "Assignment", "Deadline"].join("\t"),
      ...jsonObject.map((a) => [
        a.courseName,
        a.name,
        a.deadline,
      ].join("\t")),
    ].join("\n");
    navigator.clipboard.writeText(tableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => { setDownloaded(false); setTimeout(() => setDownloaded(true), 800); };
  const handleCalendar = () => { setCalendarAdded(false); setTimeout(() => setCalendarAdded(true), 800); };

  const selectStyle = {
    padding: "11px 16px", borderRadius: "12px",
    border: "2px solid rgba(186,230,253,0.7)",
    background: "rgba(255,255,255,0.7)", fontSize: "14px",
    color: "#0c4a6e", fontFamily: "inherit", fontWeight: "600",
    outline: "none", cursor: "pointer", appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230369a1' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "36px",
  };

  return (
    <div className="static-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "80px 24px 80px", position: "relative", overflow: "hidden" }}>
      <div className="pop-in" style={{ width: "100%", maxWidth: "680px", zIndex: 1, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)", borderRadius: "28px", border: "1.5px solid rgba(255,255,255,0.8)", padding: "40px", boxShadow: "0 8px 48px rgba(2,132,199,0.15), 0 2px 8px rgba(0,0,0,0.06)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(14,165,233,0.12)", color: "#0284c7", borderRadius: "100px", padding: "4px 14px", fontSize: "12px", fontWeight: "700", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "12px" }}>STEP 3 OF 3</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "30px", fontWeight: "800", color: "#0c4a6e", lineHeight: 1.1 }}>Your assignments 🎉</h2>
            <p style={{ color: "#0369a1", fontSize: "14px", marginTop: "6px", lineHeight: 1.5 }}>{jsonObject.length} assignments found</p>
          </div>
          <button onClick={handleCopy} style={{ background: copied ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.7)", border: `1.5px solid ${copied ? "rgba(16,185,129,0.5)" : "rgba(186,230,253,0.8)"}`, borderRadius: "12px", padding: "10px 18px", color: copied ? "#065f46" : "#0369a1", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", whiteSpace: "nowrap" }}>
            {copied ? "✅ Copied!" : "📋 Copy Table"}
          </button>
        </div>

        {/* Assignment Table */}
        <div style={{ border: "1.5px solid rgba(186,230,253,0.6)", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ overflowY: "auto", maxHeight: "300px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "rgba(2,132,199,0.12)", position: "sticky", top: 0, zIndex: 1 }}>
                  {["Course Name", "Assignment", "Deadline"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#0369a1", fontFamily: "monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1.5px solid rgba(186,230,253,0.6)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jsonObject.map((a, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.5)" : "rgba(186,230,253,0.15)", borderBottom: "1px solid rgba(186,230,253,0.3)" }}>
                    <td style={{ padding: "10px 16px", color: "#075985", fontWeight: "600", fontSize: "12px", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.courseName}</td>
                    <td style={{ padding: "10px 16px", color: "#0c4a6e", fontWeight: "700", fontSize: "13px" }}>{a.name}</td>
                    <td style={{ padding: "10px 16px", color: "#0369a1", fontFamily: "monospace", fontSize: "12px", whiteSpace: "nowrap" }}>{a.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ height: "1px", background: "rgba(186,230,253,0.5)", marginBottom: "20px" }} />

        {/* Download row */}
        <p style={{ fontSize: "12px", fontWeight: "700", color: "#0369a1", marginBottom: "10px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace" }}>Download File</p>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
          <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
            <option value="txt">TXT</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xlsx">XLSX</option>
          </select>
          <button onClick={handleDownload} style={{ background: "linear-gradient(135deg, #0284c7, #0ea5e9)", border: "none", borderRadius: "12px", padding: "11px 22px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(2,132,199,0.35)", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(2,132,199,0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(2,132,199,0.35)"; }}
          >⬇ Download</button>
        </div>
        {downloaded && <p className="fade-in" style={{ fontSize: "13px", color: "#0284c7", fontWeight: "600", marginBottom: "8px" }}>✅ {format.toUpperCase()} file downloaded!</p>}

        <div style={{ height: "1px", background: "rgba(186,230,253,0.5)", margin: "16px 0" }} />

        {/* Google Calendar */}
        <button onClick={handleCalendar} style={{ width: "100%", borderRadius: "12px", padding: "13px 20px", border: "2px solid rgba(186,230,253,0.8)", background: "rgba(255,255,255,0.6)", color: "#0369a1", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s", marginBottom: "10px" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.borderColor = "#38bdf8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(186,230,253,0.8)"; }}
        >
          <img src="/src/google_calendar.png" alt="Google Calendar" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
          Add to Google Calendar
        </button>
        {calendarAdded && <p className="fade-in" style={{ fontSize: "13px", color: "#0284c7", fontWeight: "600", marginBottom: "10px" }}>✅ Assignments added to Google Calendar!</p>}

        <div style={{ height: "1px", background: "rgba(186,230,253,0.5)", margin: "16px 0" }} />

        <button onClick={onRestart} style={{ width: "100%", background: "none", border: "1.5px solid rgba(186,230,253,0.8)", borderRadius: "12px", padding: "12px", color: "#0369a1", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >↩ Start Over</button>
      </div>
      <BottomWaves />
    </div>
  );
}

/* ─── ROOT ─── */

export default function App() {
  const [step, setStep] = useState(0);
  const [panel, setPanel] = useState(null);
  const [loggedUser, setLoggedUser] = useState("");
  const [loggedPassword, setLoggedPassword] = useState("");
  // assignments holds the demo data — replace with setAssignments(realData) when backend is ready
  const [assignments, setAssignments] = useState(ASSIGNMENTS);

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <AquariumNav
        onHome={step > 0 ? () => setStep(0) : null}
        onAbout={() => setPanel("about")}
        onHowTo={() => setPanel("howto")}
      />

      {step === 0 && <WelcomeScreen onStart={() => setStep(1)} />}
      {/* onLogin saves username + password then moves to loading screen */}
      {step === 1 && <LoginScreen
        onLogin={(username, password) => {
          setLoggedUser(username);
          setLoggedPassword(password);
          setStep(2);
        }}
        onBack={() => setStep(0)}
      />}
      {step === 2 && <LoadingScreen onDone={() => setStep(3)} />}
      {step === 3 && <DoneScreen onRestart={() => setStep(0)} loggedUser={loggedUser} assignments={assignments} />

       {/*onLogin={(username, password) => {
        setLoggedUser(username);
        setLoggedPassword(password);
        setStep(2);
      }} 
      onBack={() => setStep(0)} 
       />}
      {step === 2 && <LoadingScreen onDone={() => setStep(3)} loggedUser={loggedUser} loggedPassword={loggedPassword}/>}
      {step === 3 && <DoneScreen onRestart={() => setStep(0)} loggedUser={loggedUser} jsonString={jsonString}/>}
      */}
      {panel === "about" && <AboutUsPanel onClose={() => setPanel(null)} />}
      {panel === "howto" && <HowToUsePanel onClose={() => setPanel(null)} />}

      <WaveProgressBar step={step === 0 ? 1 : step === 1 ? 2 : step === 2 ? 2 : 3} total={3} />
    </>
  );
}