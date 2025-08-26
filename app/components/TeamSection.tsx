import { Users } from 'lucide-react'
import BaseballBackground from './BaseballBackground'
import rosterData from '../../data/roster.json'

interface Player {
  number: number
  name: string
  position: string
  stats: string
}

interface RosterData {
  players: Player[]
}

export default function TeamSection() {
  const players = rosterData.players as Player[]



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
      </div>
    </section>
  )
}
