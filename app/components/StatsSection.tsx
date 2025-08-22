'use client'

import { Trophy, Target, TrendingUp, Award } from 'lucide-react'
import { useState, useEffect } from 'react'

const iconMap = {
  trophy: Trophy,
  target: Target,
  'trending-up': TrendingUp,
  award: Award
}

interface TeamStat {
  label: string
  value: string
  description: string
  icon: string
}

export default function StatsSection() {
  const [teamStats, setTeamStats] = useState<TeamStat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/data/stats.json')
        if (response.ok) {
          const statsData = await response.json()
          setTeamStats((statsData.teamStats || []) as TeamStat[])
        } else {
          setTeamStats([])
        }
      } catch (error) {
        setTeamStats([])
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])
  return (
    <section id="stats" className="section-padding bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Season Stats</h2>
          <p className="text-xl text-legion-gray-300 max-w-2xl mx-auto">
            The numbers that show our dominance on the field
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legion-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading team stats...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap]
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm card-hover"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <IconComponent className="w-8 h-8 text-legion-red-600" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-legion-red-400 mb-1">{stat.label}</div>
                <div className="text-legion-gray-300 text-sm">{stat.description}</div>
              </div>
            )
            })}
          </div>
        )}
      </div>
    </section>
  )
}