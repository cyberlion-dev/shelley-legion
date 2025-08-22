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

  const loadRoster = async () => {
    try {
      const response = await fetch(`/api/data/roster.json?t=${Date.now()}`, {
        cache: 'no-store'
      })

      if (response.ok) {
        const rosterData = await response.json()
        setPlayers((rosterData.players || []) as Player[])
      } else {
        setPlayers([])
      }
    } catch (error) {
      setPlayers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player) => (
              <div
                key={player.number}
                className="bg-white dark:bg-legion-gray-800 rounded-xl shadow-lg p-6 card-hover border-l-4 border-legion-red-600"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-legion-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                    {player.number}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-legion-gray-500 dark:text-legion-gray-400 font-medium">
                      {player.position}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-legion-gray-900 dark:text-white mb-2">
                  {player.name}
                </h3>
                <div className="text-legion-gray-600 dark:text-legion-gray-300">
                  <span className="font-semibold">Stats: </span>
                  {player.stats}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}