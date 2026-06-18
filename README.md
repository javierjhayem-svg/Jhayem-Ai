# JhayemAI 🤖

Personal AI chat assistant by **Jhayem J. Cuysona** — BSIT, Trinidad Municipal College, Bohol.

Built with Next.js 14 + Anthropic Claude + Vercel. Installable as a PWA.

---

## 🚀 Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/jhayemai.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. Under **Environment Variables**, add:
   - `GROQ_API_KEY` = your Groq API key (free at console.groq.com)
3. Click **Deploy** ✅

---

## 💻 Run Locally

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📱 Install as PWA

After deploying, open on mobile → browser menu → **"Add to Home Screen"**

---

## Stack

- **Next.js 14** (App Router)
- **Anthropic Claude Sonnet** via API
- **CSS Modules** (zero dependencies for styling)
- **Vercel** for hosting
- **PWA** manifest for mobile install
