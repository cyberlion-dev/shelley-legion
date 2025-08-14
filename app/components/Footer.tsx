'use client'

import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TeamInfo {
  teamName: string
  tagline: string
  description: string
  contact: {
    phone: string
    email: string
    address: string
  }
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
  }
}

export default function Footer() {
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    teamName: 'Shelley Legion',
    tagline: 'Honor, Pride, Victory',
    description: 'Youth baseball team for players 18 and under',
    contact: {
      phone: '(208) 555-LEGION',
      email: 'info@shelleylegion.com',
      address: 'Legion Field, Shelley, ID'
    },
    socialMedia: {
      facebook: 'https://facebook.com/shelleylegion',
      twitter: 'https://twitter.com/shelleylegion',
      instagram: 'https://instagram.com/shelleylegion'
    }
  })

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const response = await fetch('/api/admin/team-info', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        const data = await response.json()
        setTeamInfo(data)
      } catch (error) {
        console.error('Failed to fetch team info:', error)
        // Keep the default data that was already set
      }
    }

    fetchTeamInfo()
  }, [])
  return (
    <footer className="bg-legion-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">⚾ {teamInfo.teamName}</h3>
            <p className="text-legion-gray-300 mb-4">
              {teamInfo.description}
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-legion-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-legion-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-legion-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-legion-red-400 mr-3" />
                <span className="text-legion-gray-300">{teamInfo.contact.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-legion-red-400 mr-3" />
                <span className="text-legion-gray-300">{teamInfo.contact.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-legion-red-400 mr-3" />
                <span className="text-legion-gray-300">{teamInfo.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#team" className="block text-legion-gray-300 hover:text-white transition-colors">Team Roster</a>
              <a href="#schedule" className="block text-legion-gray-300 hover:text-white transition-colors">Game Schedule</a>
              <a href="#stats" className="block text-legion-gray-300 hover:text-white transition-colors">Season Stats</a>
              <a href="#contact" className="block text-legion-gray-300 hover:text-white transition-colors">Join the Team</a>
              <a href="/admin" className="block text-legion-gray-300 hover:text-white transition-colors">Admin</a>
            </div>
          </div>
        </div>

        <div className="border-t border-legion-gray-800 mt-8 pt-8 text-center">
          <p className="text-legion-gray-400">
            &copy; 2025 {teamInfo.teamName} Baseball Team. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}