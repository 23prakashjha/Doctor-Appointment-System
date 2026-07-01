import React, { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const StarField = () => {
  const stars = useMemo(() =>
    Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    })),
  [])

  return (
    <div className="stars">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--duration': `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Star Field */}
      <StarField />

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-400/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-violet-500/15 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/8 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-emerald-400/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-violet-400/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />
      <main className="flex-grow relative z-[2]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
