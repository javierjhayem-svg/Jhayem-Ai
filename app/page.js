'use client'
import { useState } from 'react'
import LoginPage from './components/LoginPage'
import ChatPage from './components/ChatPage'
import AboutPage from './components/AboutPage'

export default function App() {
  const [screen, setScreen] = useState('login') // login | chat | about
  const [user, setUser] = useState(null)

  const handleLogin = (username) => {
    setUser(username)
    setScreen('chat')
  }

  if (screen === 'login') return <LoginPage onLogin={handleLogin} />
  if (screen === 'about') return <AboutPage onBack={() => setScreen('chat')} />
  return <ChatPage user={user} onAbout={() => setScreen('about')} onLogout={() => { setUser(null); setScreen('login') }} />
}
