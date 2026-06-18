'use client'
import { useState } from 'react'
import styles from './LoginPage.module.css'

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setTimeout(() => {
      onLogin(name.trim())
    }, 800)
  }

  return (
    <div className={styles.page}>
      {/* Glow blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.inner}>
        {/* Avatar */}
        <div className={styles.avatarWrap}>
          <div className={styles.avatarRing} />
          <img src="/jhayem.jpg" alt="Jhayem" className={styles.avatar} />
          <div className={styles.statusDot} />
        </div>

        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.brandEye}>✦</span>
          <h1 className={styles.brandName}>JhayemAI</h1>
        </div>
        <p className={styles.tagline}>Your personal AI, <em>always ready.</em></p>

        {/* Login card */}
        <div className={styles.card}>
          <p className={styles.cardLabel}>Who's asking?</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              className={`input-field ${styles.input}`}
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              maxLength={32}
            />
            <button
              className={`btn-primary ${styles.loginBtn}`}
              type="submit"
              disabled={!name.trim() || loading}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  <span>Start Chatting</span>
                  <ArrowIcon />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className={styles.footer}>
          Built by <strong>Jhayem Cuysona</strong> · TMC Bohol
        </p>
      </div>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
