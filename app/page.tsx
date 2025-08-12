'use client'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TeamSection from './components/TeamSection'
import ScheduleSection from './components/ScheduleSection'
import StatsSection from './components/StatsSection'
import ProspectForm from './components/ProspectForm'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TeamSection />
      <ScheduleSection />
      <StatsSection />
      <ProspectForm />
      <Footer />
    </main>
  )
}