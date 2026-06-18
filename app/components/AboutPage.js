'use client'
import styles from './AboutPage.module.css'

const STACK = ['Next.js 14', 'React 18', 'Anthropic Claude', 'Vercel', 'CSS Modules', 'PWA']
const FEATURES = [
  { icon: '🤖', label: 'AI-Powered', desc: 'Runs on Claude Sonnet via Anthropic API' },
  { icon: '📱', label: 'Mobile-First', desc: 'Designed as a PWA — install on your phone' },
  { icon: '💬', label: 'Smart Chat', desc: 'Context-aware conversations with memory' },
  { icon: '🌐', label: 'Deployed on Vercel', desc: 'Always live, always fast' },
]

export default function AboutPage({ onBack }) {
  return (
    <div className={styles.page}>
      {/* Glow */}
      <div className={styles.blob1} />

      {/* Header */}
      <header className={styles.header}>
        <button className={`btn-ghost ${styles.backBtn}`} onClick={onBack}>
          <BackIcon /> Back
        </button>
        <span className={styles.headerTitle}>About</span>
        <div style={{ width: 64 }} />
      </header>

      {/* Content */}
      <div className={styles.scroll}>

        {/* Profile hero */}
        <div className={styles.profileHero}>
          <div className={styles.imgWrap}>
            <img src="/jhayem.jpg" alt="Jhayem Cuysona" className={styles.profileImg} />
            <div className={styles.imgGlow} />
          </div>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>BSIT Student</span>
            <span className={styles.badge + ' ' + styles.badgePurple}>Developer</span>
          </div>
          <h1 className={styles.name}>Jhayem J. Cuysona</h1>
          <div className={styles.school}>
            <SchoolIcon />
            <span>Trinidad Municipal College</span>
          </div>
          <p className={styles.schoolSub}>Trinidad, Bohol, Philippines</p>
        </div>

        {/* About text */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>About JhayemAI</div>
          <p className={styles.aboutText}>
            JhayemAI is a personal AI chat assistant built from the ground up by Jhayem Cuysona as a showcase project. It combines modern web technologies with the power of Anthropic's Claude to deliver a clean, fast, mobile-first AI experience.
          </p>
          <p className={styles.aboutText}>
            The project started as a Python AI agent and evolved into a full Next.js mobile PWA — deployable in seconds on Vercel.
          </p>
        </div>

        {/* Features */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Features</div>
          <div className={styles.features}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <div className={styles.featureLabel}>{f.label}</div>
                  <div className={styles.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Tech Stack</div>
          <div className={styles.stack}>
            {STACK.map((s, i) => (
              <span key={i} className={styles.chip}>{s}</span>
            ))}
          </div>
        </div>

        {/* Footer credit */}
        <div className={styles.credit}>
          <span className={styles.creditStar}>✦</span>
          <div>
            <div className={styles.creditMain}>Built with 💜 by Jhayem Cuysona</div>
            <div className={styles.creditSub}>TMC · Bohol · Philippines · 2025</div>
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}

function BackIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function SchoolIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 6l6-4 6 4M2 6v5a1 1 0 001 1h8a1 1 0 001-1V6M5 12V9h4v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
