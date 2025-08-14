# Shelley Legion Baseball Website

Official website for the Shelley Legion youth baseball team (ages 12-18) in Shelley, Idaho.

## Features

- **Modern Design**: Responsive website with baseball-themed styling
- **Simple Data Management**: Edit JSON files directly in your code
- **Event Management**: Games, practices, tryouts with automatic status updates
- **Player Roster**: Team member profiles and statistics
- **Prospect Form**: Online applications with EmailJS integration
- **Mobile Friendly**: Works perfectly on all devices

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Edit team data:**
   - Update JSON files in the `/data` folder
   - Push changes to GitHub for automatic deployment

## Data Management

All team data is stored in simple JSON files:

- **`data/roster.json`** - Team players and stats
- **`data/schedule.json`** - Games, practices, and events
- **`data/stats.json`** - Team statistics and achievements
- **`data/team-info.json`** - Contact details and team information

To update data:
1. Edit the JSON files in your code editor
2. Commit and push changes to GitHub
3. Vercel automatically deploys the updates

## Deployment

This website is optimized for deployment on Vercel:

1. **Connect to Vercel**: Link your GitHub repository
2. **Deploy**: Automatic deployments on every push
3. **Optional**: Set up EmailJS environment variables for contact form

See `SETUP.md` for detailed deployment instructions.

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Static JSON** - Simple data storage
- **EmailJS** - Contact form emails (optional)

## Project Structure

```
shelley-legion-website/
├── app/
│   ├── components/          # React components
│   ├── utils/              # Utility functions
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── data/                   # Team data (JSON files)
├── public/                 # Static assets
└── tailwind.config.js      # Tailwind configuration
```

---

© 2025 Shelley Legion Baseball Team. All rights reserved.