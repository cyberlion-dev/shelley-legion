import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'
import teamInfoData from '../../data/team-info.json'

interface TeamInfo {
  teamName: string
  location: string
  founded: string
  league: string
  homeField: string
  contact: {
    phone: string
    email: string
  }
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
  }
}

export default function Footer() {
  const teamInfo = teamInfoData as TeamInfo
  return (
    <footer className="bg-legion-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">⚾ {teamInfo.teamName}</h3>
            <p className="text-legion-gray-300 mb-4">
              {teamInfo.league} - Founded {teamInfo.founded}
            </p>
            <div className="flex space-x-4">
              <a href={teamInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="w-6 h-6 text-legion-gray-400 hover:text-white cursor-pointer transition-colors" />
              </a>
              <a href={teamInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="w-6 h-6 text-legion-gray-400 hover:text-white cursor-pointer transition-colors" />
              </a>
              <a href={teamInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="w-6 h-6 text-legion-gray-400 hover:text-white cursor-pointer transition-colors" />
              </a>
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
                <span className="text-legion-gray-300">{teamInfo.homeField}, {teamInfo.location}</span>
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
