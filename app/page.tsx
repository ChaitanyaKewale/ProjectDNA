"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ── Animated DNA Network Canvas ─────────────────────────────── */
function DNACanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = [];
    const colors = ["#7c3aed", "#06b6d4", "#ec4899", "#a855f7", "#22d3ee"];
    const COUNT = 40;

    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let raf: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      raf = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }}
    />
  );
}

/* ── Animated Counter ─────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const duration = 1800;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Feature Card ─────────────────────────────────────────────── */
function FeatureCard({ icon, title, description, color, delay }: {
  icon: string; title: string; description: string; color: string; delay: number;
}) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "2rem",
        animation: `slideUp 0.6s ease ${delay}ms both`,
        borderTop: `2px solid ${color}`,
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: "1rem",
        background: `${color}22`,
        border: `1px solid ${color}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem", marginBottom: "1.25rem",
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "1.1rem", marginBottom: "0.6rem", color: "#f8fafc" }}>{title}</h3>
      <p style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>{description}</p>
    </div>
  );
}

/* ── Step Card ────────────────────────────────────────────────── */
function StepCard({ step, title, description, color }: {
  step: string; title: string; description: string; color: string;
}) {
  return (
    <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: 700, fontSize: "1rem", color: "#fff",
        boxShadow: `0 0 20px ${color}44`,
      }}>
        {step}
      </div>
      <div>
        <h4 style={{ marginBottom: "0.4rem", color: "#f8fafc" }}>{title}</h4>
        <p style={{ fontSize: "0.9rem" }}>{description}</p>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        minHeight: "calc(100vh - 68px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "var(--gradient-hero)",
      }}>
        {/* Background orbs */}
        <div className="orb orb-violet" style={{ width: 600, height: 600, top: -100, left: -150, opacity: 0.5 }} />
        <div className="orb orb-cyan"   style={{ width: 400, height: 400, bottom: -80, right: -100, opacity: 0.4 }} />
        <div className="orb orb-pink"   style={{ width: 300, height: 300, top: "30%", right: "15%", opacity: 0.3 }} />

        {/* DNA Network */}
        <DNACanvas />

        {/* Hero Content */}
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "4rem 1.5rem" }}>
          {/* Pill badge */}
          <div style={{ display: "inline-flex", marginBottom: "2rem", animation: "fadeIn 0.5s ease" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.4rem 1rem",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.35)",
              borderRadius: "9999px",
              fontSize: "0.8rem", fontWeight: 600, color: "#a855f7",
              letterSpacing: "0.05em",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 8px #a855f7" }} />
              AI-Powered Developer Matching
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "1.5rem",
            animation: "slideUp 0.6s ease 100ms both",
          }}>
            Build Teams That{" "}
            <span className="gradient-text">Actually Work</span>
            <br />— Together.
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "#94a3b8",
            maxWidth: 600,
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
            animation: "slideUp 0.6s ease 200ms both",
          }}>
            ProjectDNA analyzes your idea, builds a structured project profile,
            and matches you with developers based on skills, interests, and working style —
            not just tech keywords.
          </p>

          <div style={{
            display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap",
            animation: "slideUp 0.6s ease 300ms both",
          }}>
            <Link href="/sign-up">
              <button className="btn btn-primary btn-lg" style={{ fontSize: "1rem", padding: "0.875rem 2.25rem" }}>
                Start Building →
              </button>
            </Link>
            <Link href="/explore">
              <button className="btn btn-ghost btn-lg" style={{ fontSize: "1rem", padding: "0.875rem 2.25rem" }}>
                Explore Projects
              </button>
            </Link>
          </div>

          {/* Floating cards preview */}
          <div style={{
            display: "flex", justifyContent: "center", gap: "1rem",
            marginTop: "4rem", flexWrap: "wrap",
            animation: "slideUp 0.6s ease 400ms both",
          }}>
            {[
              { label: "Skills Match",   value: "94%",  color: "#7c3aed" },
              { label: "Style Fit",      value: "88%",  color: "#06b6d4" },
              { label: "Availability",   value: "100%", color: "#10b981" },
            ].map((item) => (
              <div key={item.label} className="glass-card" style={{ padding: "0.75rem 1.25rem", textAlign: "center", minWidth: 110 }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", color: item.color }}>
                  {item.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ══════════════════════════════════════════════ */}
      <section style={{ padding: "4rem 1.5rem", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem", textAlign: "center" }}>
            {[
              { value: 2400,  suffix: "+", label: "Projects Created" },
              { value: 12000, suffix: "+", label: "Developers Matched" },
              { value: 890,   suffix: "+", label: "Teams Formed" },
              { value: 97,    suffix: "%", label: "Match Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="stat-number">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="badge badge-violet" style={{ marginBottom: "1rem" }}>Features</span>
            <h2>Everything you need to<br /><span className="gradient-text">build your dream team</span></h2>
            <p style={{ marginTop: "1rem", maxWidth: 540, margin: "1rem auto 0" }}>
              From AI-powered project analysis to working-style matching — ProjectDNA covers every layer of team chemistry.
            </p>
          </div>

          <div className="grid-3">
            <FeatureCard
              icon="🧬" delay={0}
              color="#7c3aed"
              title="AI Project Analyzer"
              description="Paste your project idea and our AI breaks it down into a structured DNA — required roles, skills, difficulty, and domain classification."
            />
            <FeatureCard
              icon="🎯" delay={100}
              color="#06b6d4"
              title="Smart Matching Engine"
              description="Weighted compatibility scoring across Skills (40%), Interests (20%), Working Style (20%), and Availability (20%)."
            />
            <FeatureCard
              icon="🧠" delay={200}
              color="#ec4899"
              title="Working Style Profiles"
              description="Match on personality, not just tech. Work timing, pace, communication style, and team role preference — captured during onboarding."
            />
            <FeatureCard
              icon="🏗️" delay={300}
              color="#10b981"
              title="Project DNA Dashboard"
              description="Visualize your project's composition — role breakdown donuts, skill coverage bars, and team fill progress at a glance."
            />
            <FeatureCard
              icon="📬" delay={400}
              color="#f59e0b"
              title="Smart Invitations"
              description="Send invitations with match scores attached. Candidates see exactly why they're a good fit before accepting."
            />
            <FeatureCard
              icon="🔒" delay={500}
              color="#a855f7"
              title="Private Team Workspace"
              description="Once your team is assembled, get a private workspace with tasks, progress tracking, resources, and role-based access."
            />
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════ */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: "1.25rem" }}>How It Works</span>
              <h2 style={{ marginBottom: "2.5rem" }}>
                From idea to<br />
                <span className="gradient-text">assembled team</span>
                <br />in minutes
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                <StepCard
                  step="1" color="#7c3aed"
                  title="Describe Your Project"
                  description="Write your project idea in plain language. Our AI handles the rest — classifying it, identifying required roles and skills."
                />
                <StepCard
                  step="2" color="#06b6d4"
                  title="Review Your Project DNA"
                  description="Get a visual breakdown of your project's DNA — domain, difficulty, required team composition, and skill requirements."
                />
                <StepCard
                  step="3" color="#ec4899"
                  title="Match & Invite"
                  description="Browse ranked candidates with compatibility scores. Send invites to the best fits, who can review your project and respond."
                />
                <StepCard
                  step="4" color="#10b981"
                  title="Launch Your Workspace"
                  description="Once your team accepts, a private workspace opens with task management, progress tracking, and team tools."
                />
              </div>
            </div>

            {/* Visual panel */}
            <div style={{ position: "relative" }}>
              <div className="glass-card gradient-border" style={{ padding: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "0.75rem",
                    background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
                  }}>🧬</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#f8fafc", fontFamily: "Space Grotesk, sans-serif" }}>AI Health Monitor</div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Real-time team analysis</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <span className="badge badge-emerald">Active</span>
                  </div>
                </div>

                {[
                  { label: "Skills Coverage",      val: 87, color: "#7c3aed" },
                  { label: "Role Completion",       val: 75, color: "#06b6d4" },
                  { label: "Style Compatibility",   val: 92, color: "#ec4899" },
                  { label: "Availability Match",    val: 80, color: "#10b981" },
                ].map((item, i) => (
                  <div key={item.label} style={{ marginBottom: "1rem", animationDelay: `${i * 100}ms` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.4rem" }}>
                      <span style={{ color: "#94a3b8" }}>{item.label}</span>
                      <span style={{ color: item.color, fontWeight: 600 }}>{item.val}%</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${item.val}%`,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                        borderRadius: 3,
                        transition: "width 1s ease",
                      }} />
                    </div>
                  </div>
                ))}

                <div style={{
                  marginTop: "1.5rem", padding: "1rem",
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: "0.75rem",
                  display: "flex", alignItems: "center", gap: "0.75rem",
                }}>
                  <div style={{ fontSize: "1.5rem" }}>🏆</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#34d399", fontFamily: "Space Grotesk, sans-serif", fontSize: "1.1rem" }}>
                      Team Health: 84/100
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Strong foundation — consider adding a UI/UX designer</div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="glass-card animate-float" style={{
                position: "absolute", top: -20, right: -20,
                padding: "0.6rem 1rem",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <span style={{ fontSize: "1rem" }}>✨</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#a855f7" }}>AI Analyzing...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═════════════════════════════════════════ */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container-narrow">
          <div className="glass-card gradient-border" style={{ padding: "4rem 2rem", position: "relative", overflow: "hidden" }}>
            <div className="orb orb-violet" style={{ width: 300, height: 300, top: -100, left: "50%", transform: "translateX(-50%)", opacity: 0.3 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ marginBottom: "1rem" }}>
                Ready to build your<br />
                <span className="gradient-text">dream project team?</span>
              </h2>
              <p style={{ marginBottom: "2rem", fontSize: "1.05rem" }}>
                Join thousands of developers already collaborating smarter with ProjectDNA.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/sign-up">
                  <button className="btn btn-primary btn-lg">Create Your Profile →</button>
                </Link>
                <Link href="/explore">
                  <button className="btn btn-ghost btn-lg">Browse Projects</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═════════════════════════════════════════════ */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "2rem 1.5rem",
        background: "var(--bg-secondary)",
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, color: "#f8fafc" }}>
              Project<span className="gradient-text">DNA</span>
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>© 2026</span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Explore", "Dashboard", "Sign In"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase().replace(" ", "-")}`}
                style={{ color: "var(--text-muted)", fontSize: "0.85rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
