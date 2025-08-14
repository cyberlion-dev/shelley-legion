'use client'

import { Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import BaseballBackground from './BaseballBackground'

interface Player {
  number: number
  name: string
  position: string
  stats: string
}

export default function TeamSection() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRoster = async () => {
      try {
        const rosterData = await import('../../data/roster.json')
        setPlayers((rosterData.players || []) as Player[])
      } catch (error) {
        console.error('Failed to load roster:', error)
        setPlayers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadRoster()
  }, [])
  return (
    <section id="team" className="section-padding bg-legion-gray-50 dark:bg-legion-gray-900 relative overflow-hidden">
      <BaseballBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-legion-red-600 mr-3" />
            <h2 className="text-4xl font-bold text-legion-gray-900 dark:text-white">Meet the Legion</h2>
          </div>
          <p className="text-xl text-legion-gray-600 dark:text-legion-gray-300 max-w-2xl mx-auto">
            Our talented young athletes ready to dominate the diamond
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legion-red-600 mx-auto"></div>
            <p className="mt-4 text-legion-gray-600 dark:text-legion-gray-300">Loading team roster...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {players.map((player, index) => (
            <div
              key={player.number}
              className="bg-white dark:bg-legion-gray-800 rounded-xl shadow-lg p-6 card-hover border-l-4 border-legion-red-600"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-legion-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {player.number}
                </div>
                <h3 className="text-xl font-bold text-legion-gray-900 dark:text-white mb-2">{player.name}</h3>
                <p className="text-legion-red-600 font-semibold mb-2">{player.position}</p>
                <p className="text-legion-gray-600 dark:text-legion-gray-300">{player.stats}</p>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}