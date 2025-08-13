# Shelley Legion Baseball Website

Official website for the Shelley Legion youth baseball team (ages 12-18) in Shelley, Idaho.

## Features

- **Modern Design**: Responsive website with baseball-themed styling
- **Admin Panel**: Easy content management for coaches and staff
- **Event Management**: Games, practices, tryouts with calendar integration
- **Player Roster**: Team member profiles and statistics
- **Prospect Form**: Online applications with spam protection
- **Mobile Friendly**: Works perfectly on all devices

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Add your Vercel Blob token and other credentials

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Access admin panel:**
   - Go to `/admin` and login with your credentials
   - Default: username `coach`, password `legion2025`

## Admin Panel

The admin panel allows you to manage:
- **Team Roster**: Add, edit, and remove players
- **Event Schedule**: Manage games, practices, and tryouts
- **Team Statistics**: Update season stats and achievements
- **Team Information**: Contact details and social media

## Deployment

This website is optimized for deployment on Vercel:

1. **Connect to Vercel**: Link your GitHub repository
2. **Set Environment Variables**: Add your credentials in Vercel dashboard
3. **Create Blob Storage**: Set up Vercel Blob for data persistence
4. **Deploy**: Automatic deployments on every push

See `SETUP.md` for detailed deployment instructions.

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel Blob** - Data storage
- **EmailJS** - Contact form emails

---

© 2025 Shelley Legion Baseball Team. All rights reserved.