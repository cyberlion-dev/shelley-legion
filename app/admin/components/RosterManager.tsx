'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

interface Player {
  number: number
  name: string
  position: string
  stats: string
}

export default function RosterManager() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const newPlayerTemplate: Player = {
    number: 0,
    name: '',
    position: '',
    stats: ''
  }

  useEffect(() => {
    fetchRoster()
  }, [])

  const fetchRoster = async () => {
    try {
      const response = await fetch('/api/admin/roster')
      const data = await response.json()
      setPlayers(data.players || [])
    } catch (error) {
      console.error('Failed to fetch roster:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveRoster = async (updatedPlayers: Player[]) => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch('/api/admin/roster', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ players: updatedPlayers })
      })

      if (response.ok) {
        setPlayers(updatedPlayers)
        setEditingPlayer(null)
        setIsAddingNew(false)
      } else {
        alert('Failed to save roster')
      }
    } catch (error) {
      alert('Error saving roster')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddPlayer = (newPlayer: Player) => {
    const updatedPlayers = [...players, newPlayer]
    saveRoster(updatedPlayers)
  }

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    const updatedPlayers = players.map(p => 
      p.number === editingPlayer?.number ? updatedPlayer : p
    )
    saveRoster(updatedPlayers)
  }

  const handleDeletePlayer = (playerNumber: number) => {
    if (confirm('Are you sure you want to delete this player?')) {
      const updatedPlayers = players.filter(p => p.number !== playerNumber)
      saveRoster(updatedPlayers)
    }
  }

  const positions = [
    'Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base',
    'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Utility Player'
  ]

  if (isLoading) {
    return <div className="text-center py-8">Loading roster...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-legion-gray-900 dark:text-white">
          Team Roster
        </h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-legion-red-600 hover:bg-legion-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Player</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Add New Player Form */}
        {isAddingNew && (
          <PlayerForm
            player={newPlayerTemplate}
            positions={positions}
            onSave={handleAddPlayer}
            onCancel={() => setIsAddingNew(false)}
            isSaving={isSaving}
            isNew={true}
          />
        )}

        {/* Player List */}
        {players.map((player) => (
          <div key={player.number}>
            {editingPlayer?.number === player.number ? (
              <PlayerForm
                player={editingPlayer}
                positions={positions}
                onSave={handleUpdatePlayer}
                onCancel={() => setEditingPlayer(null)}
                isSaving={isSaving}
                isNew={false}
              />
            ) : (
              <PlayerCard
                player={player}
                onEdit={() => setEditingPlayer(player)}
                onDelete={() => handleDeletePlayer(player.number)}
              />
            )}
          </div>
        ))}

        {players.length === 0 && !isAddingNew && (
          <div className="text-center py-12 text-legion-gray-500 dark:text-legion-gray-400">
            No players in roster. Add your first player!
          </div>
        )}
      </div>
    </div>
  )
}

interface PlayerCardProps {
  player: Player
  onEdit: () => void
  onDelete: () => void
}

function PlayerCard({ player, onEdit, onDelete }: PlayerCardProps) {
  return (
    <div className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-legion-red-600 text-white rounded-full flex items-center justify-center font-bold">
          {player.number}
        </div>
        <div>
          <h3 className="font-semibold text-legion-gray-900 dark:text-white">
            {player.name}
          </h3>
          <p className="text-legion-red-600 font-medium">{player.position}</p>
          <p className="text-sm text-legion-gray-600 dark:text-legion-gray-300">
            {player.stats}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="p-2 text-legion-gray-600 dark:text-legion-gray-300 hover:text-legion-red-600 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-legion-gray-600 dark:text-legion-gray-300 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface PlayerFormProps {
  player: Player
  positions: string[]
  onSave: (player: Player) => void
  onCancel: () => void
  isSaving: boolean
  isNew: boolean
}

function PlayerForm({ player, positions, onSave, onCancel, isSaving, isNew }: PlayerFormProps) {
  const [formData, setFormData] = useState(player)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Number
          </label>
          <input
            type="number"
            required
            min="0"
            max="99"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Position
          </label>
          <select
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          >
            <option value="">Select Position</option>
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Stats
          </label>
          <input
            type="text"
            required
            value={formData.stats}
            onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
            placeholder="e.g., .285 AVG"
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-legion-red-600 hover:bg-legion-red-700 disabled:bg-legion-gray-400 text-white px-4 py-2 rounded font-medium flex items-center space-x-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : isNew ? 'Add Player' : 'Save Changes'}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-legion-gray-500 hover:bg-legion-gray-600 text-white px-4 py-2 rounded font-medium flex items-center space-x-2 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  )
}