'use client'

export default function BaseballBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Baseball Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="baseball-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Baseball */}
              <circle cx="60" cy="60" r="25" fill="white" stroke="#333" strokeWidth="2"/>
              {/* Baseball stitches */}
              <path d="M 45 45 Q 60 50 75 45" stroke="#dc2626" strokeWidth="2" fill="none"/>
              <path d="M 45 75 Q 60 70 75 75" stroke="#dc2626" strokeWidth="2" fill="none"/>
              <path d="M 45 47 Q 60 52 75 47" stroke="#dc2626" strokeWidth="1" fill="none"/>
              <path d="M 45 73 Q 60 68 75 73" stroke="#dc2626" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#baseball-pattern)" />
        </svg>
      </div>

      {/* Floating Baseballs */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 opacity-10 animate-float">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="white" stroke="#333" strokeWidth="3"/>
          <path d="M 25 25 Q 50 35 75 25" stroke="#dc2626" strokeWidth="3" fill="none"/>
          <path d="M 25 75 Q 50 65 75 75" stroke="#dc2626" strokeWidth="3" fill="none"/>
        </svg>
      </div>

      <div className="absolute top-3/4 right-1/4 w-12 h-12 opacity-10 animate-float" style={{animationDelay: '2s'}}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="white" stroke="#333" strokeWidth="3"/>
          <path d="M 25 25 Q 50 35 75 25" stroke="#dc2626" strokeWidth="3" fill="none"/>
          <path d="M 25 75 Q 50 65 75 75" stroke="#dc2626" strokeWidth="3" fill="none"/>
        </svg>
      </div>

      <div className="absolute top-1/2 left-1/6 w-20 h-20 opacity-10 animate-float" style={{animationDelay: '4s'}}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="white" stroke="#333" strokeWidth="3"/>
          <path d="M 25 25 Q 50 35 75 25" stroke="#dc2626" strokeWidth="3" fill="none"/>
          <path d="M 25 75 Q 50 65 75 75" stroke="#dc2626" strokeWidth="3" fill="none"/>
        </svg>
      </div>

      {/* Diamond shapes */}
      <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-white animate-diamond-pulse"></div>
      <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-legion-red-400 animate-diamond-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-2/3 right-1/6 w-4 h-4 bg-legion-red-500 animate-diamond-pulse" style={{animationDelay: '2s'}}></div>
    </div>
  )
}