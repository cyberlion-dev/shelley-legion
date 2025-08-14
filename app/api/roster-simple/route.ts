import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Just return default data for now to test if API routes work
    const defaultRoster = {
      players: [
        { number: 23, name: 'Jake Morrison', position: 'Pitcher', stats: '2.45 ERA' },
        { number: 15, name: 'Mike Rodriguez', position: 'Catcher', stats: '.285 AVG' },
        { number: 7, name: 'Sam Johnson', position: 'Shortstop', stats: '.312 AVG' },
        { number: 42, name: 'Tyler Davis', position: 'First Base', stats: '18 HRs' },
        { number: 9, name: 'Alex Chen', position: 'Center Field', stats: '25 SBs' },
        { number: 31, name: 'Ryan Miller', position: 'Third Base', stats: '.298 AVG' }
      ]
    }
    
    const result = NextResponse.json(defaultRoster)
    result.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    result.headers.set('Pragma', 'no-cache')
    result.headers.set('Expires', '0')
    return result
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch roster',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}