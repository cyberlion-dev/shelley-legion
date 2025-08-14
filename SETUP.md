# Shelley Legion Website Setup Guide

## 🚀 Simple Setup - No Admin Panel

This website now uses simple JSON files for data management. No complex admin system, no database, no authentication - just edit the files directly in your code!

### 1. Environment Variables (Optional)

Only needed if you want the contact form to work:

Create a `.env.local` file in your project root:

```bash
# EmailJS Configuration (optional - for contact form)
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
```

### 2. Deploy

1. Push your code to GitHub
2. Vercel will automatically deploy
3. Your site will be live at: `https://your-site.vercel.app`

## 📝 Editing Team Data

All team data is stored in simple JSON files in the `/data` folder:

### **Team Roster** (`data/roster.json`)
```json
{
  "players": [
    {
      "number": 44,
      "name": "Jake Morrison", 
      "position": "Pitcher",
      "stats": "2.45 ERA"
    }
  ]
}
```

### **Schedule** (`data/schedule.json`)
```json
{
  "events": [
    {
      "date": "March 15",
      "title": "vs Twin Falls Tigers",
      "type": "game",
      "location": "Legion Field, Shelley",
      "time": "7:00 PM",
      "status": "upcoming",
      "description": "Home opener"
    }
  ]
}
```

### **Team Stats** (`data/stats.json`)
```json
{
  "teamStats": [
    {
      "label": "Games Won",
      "value": "18",
      "description": "This season",
      "icon": "trophy"
    }
  ]
}
```

### **Team Info** (`data/team-info.json`)
```json
{
  "teamName": "Shelley Legion",
  "tagline": "Honor, Pride, Victory",
  "description": "Team description...",
  "contact": {
    "phone": "(208) 555-LEGION",
    "email": "info@shelleylegion.com",
    "address": "Legion Field, Shelley, ID"
  }
}
```

## ✏️ How to Update Data

1. **Edit the JSON files** in the `/data` folder
2. **Commit and push** your changes to GitHub
3. **Vercel automatically deploys** the updates
4. **Changes appear immediately** on your live site

## 🎯 Benefits of This Approach

- ✅ **Simple**: Just edit JSON files
- ✅ **Reliable**: No complex admin system to break
- ✅ **Fast**: No database queries or API calls
- ✅ **Version controlled**: All changes tracked in Git
- ✅ **No authentication needed**: Edit directly in code

## 📱 Contact Form

The contact form will work if you set up EmailJS (optional). If not configured, the form will still display but won't send emails.