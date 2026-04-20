'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

interface InteractiveExampleProps {
  japanese: string
  romaji?: string
  english: string
}

/**
 * Interactive sentence component with click-to-reveal translation/romaji.
 * Features a placeholder Play icon for future audio.
 */
export default function InteractiveExample({ japanese, romaji, english }: InteractiveExampleProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div 
      onClick={() => setShowDetails(!showDetails)}
      className="cursor-pointer group bg-slate-50 hover:bg-slate-100 transition-colors duration-200 p-5 md:p-6 rounded-2xl mb-4 border border-transparent hover:border-slate-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-relaxed">
            {japanese}
          </div>
          
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showDetails ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            {romaji && (
              <div className="text-slate-500 font-medium mb-1 text-sm md:text-base italic">
                {romaji}
              </div>
            )}
            <div className="text-slate-700 text-lg md:text-xl">
              {english}
            </div>
          </div>
          
          {!showDetails && (
            <div className="text-slate-400 text-xs md:text-sm font-semibold mt-1 uppercase tracking-wider group-hover:text-blue-400 transition-colors">
              Tap to reveal
            </div>
          )}
        </div>
        
        <button 
          className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-500 hover:scale-110 transition-all"
          aria-label="Play audio"
          onClick={(e) => {
            e.stopPropagation()
            // Future audio integration
          }}
        >
          <Play size={18} fill="currentColor" />
        </button>
      </div>
    </div>
  )
}
