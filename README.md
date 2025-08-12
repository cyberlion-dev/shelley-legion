# Shelley Legion Baseball Website

A modern, responsive website for the Shelley Legion baseball team built with Next.js and Tailwind CSS.

## Features

- **Modern Stack**: Next.js 14 with TypeScript and Tailwind CSS
- **Responsive Design**: Looks great on all devices
- **Interactive Components**: Smooth animations and hover effects
- **Easy Updates**: Component-based architecture for easy content management
- **Performance Optimized**: Fast loading with Next.js optimizations

## Getting Started

### Prerequisites
- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.tsx      # Navigation component
│   │   ├── Hero.tsx        # Hero section
│   │   ├── TeamSection.tsx # Team roster
│   │   ├── ScheduleSection.tsx # Game schedule
│   │   ├── StatsSection.tsx    # Team statistics
│   │   └── Footer.tsx      # Footer with contact info
│   ├── globals.css         # Global styles and Tailwind imports
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Main page component
├── data/                   # JSON data files for easy updates
│   ├── roster.json         # Player roster data
│   ├── schedule.json       # Game schedule data
│   ├── stats.json          # Team statistics data
│   └── team-info.json      # Team information and contact details
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## Easy Data Management

All team data is stored in JSON files for easy updates:

### Updating Team Information

- **Players**: Edit `data/roster.json`
- **Games**: Update `data/schedule.json`
- **Stats**: Change `data/stats.json`
- **Team Info**: Modify `data/team-info.json`
- **Branding**: Update `data/branding.json`
- **EmailJS**: Configure `data/emailjs-config.json`

### Example: Adding a New Player

Edit `data/roster.json`:
```json
{
  "players": [
    {
      "number": 44,
      "name": "New Player Name",
      "position": "Position",
      "stats": "Player Stats"
    }
  ]
}
```

### Styling

The website uses Tailwind CSS with custom colors defined in `tailwind.config.js`:
- `thunder-blue`: Primary blue colors
- `thunder-gold`: Accent gold colors

### Adding New Sections

1. Create a new component in `app/components/`
2. Import and add it to `app/page.tsx`
3. Update the navigation in `app/components/Navbar.tsx`

## Deployment

This Next.js app can be deployed to:
- **Vercel** (recommended): Connect your GitHub repo for automatic deployments
- **Netlify**: Build command: `npm run build`, Publish directory: `out`
- **Any hosting service** that supports Node.js

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **React Hooks**: Modern React patterns

## License

© 2025 Shelley Legion Baseball Team. All rights reserved.
##
 EmailJS Setup for Prospect Form

The prospect form uses EmailJS to send applications directly to your email. Follow these steps:

### 1. EmailJS Account Setup
1. Sign up at [EmailJS.com](https://www.emailjs.com/)
2. Create a new service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `{{from_name}}` - Prospect's full name
   - `{{from_email}}` - Prospect's email
   - `{{phone}}` - Phone number
   - `{{age}}` - Age
   - `{{position}}` - Baseball position
   - `{{experience}}` - Baseball experience
   - `{{city}}` - City/location
   - `{{message}}` - Additional message

### 2. Update Configuration
Edit `app/components/ProspectForm.tsx` and replace:
```javascript
const serviceId = 'YOUR_SERVICE_ID'      // Your EmailJS service ID
const templateId = 'YOUR_TEMPLATE_ID'    // Your EmailJS template ID  
const publicKey = 'YOUR_PUBLIC_KEY'      // Your EmailJS public key
```

### 3. Email Template Example
```
Subject: New Prospect Application - Shelley Legion

{{from_name}} has submitted a prospect application:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Age: {{age}}
Position: {{position}}
Experience: {{experience}}
City: {{city}}

Message:
{{message}}
```

### 4. Test the Form
1. Run `npm run dev`
2. Navigate to the "Join Us" section
3. Fill out and submit the form
4. Check your email for the application

## Features Added
- **Prospect Form**: Comprehensive application form for new players
- **EmailJS Integration**: Automatic email notifications
- **Form Validation**: Required fields and proper input types
- **Loading States**: Visual feedback during submission
- **Success/Error Messages**: Clear user feedback
- **Mobile Responsive**: Works great on all devices