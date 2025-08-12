'use client'

import BaseballBackground from './BaseballBackground'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-legion-red-700 via-legion-red-600 to-black"></div>
      
      {/* Baseball Background */}
      <BaseballBackground />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
          Shelley Legion
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up" style={{animationDelay: '0.2s'}}>
          Youth Baseball • Honor, Pride, Victory
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
          <a href="#prospect" className="btn-primary">
            Join the Team
          </a>
          <a href="#schedule" className="btn-secondary">
            View Schedule
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}