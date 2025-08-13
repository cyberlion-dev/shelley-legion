# Shelley Legion Website Setup Guide

## 🚀 Quick Setup for Vercel Deployment

### 1. Environment Variables Setup

Create a `.env.local` file in your project root with these variables:

```bash
# Vercel Blob Storage (get this from your Vercel dashboard)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX

# Admin Authentication
JWT_SECRET=your-very-secure-secret-key-here-make-it-long-and-random
ADMIN_USERNAME=coach
ADMIN_PASSWORD=legion2025

# EmailJS Configuration (optional - for contact form)
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
```

### 2. Get Your Blob Token

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Storage" tab
4. You should see your "shelley-legion-blob" storage
5. Click on it to get your connection details
6. Copy the `BLOB_READ_WRITE_TOKEN` value

### 3. Add Environment Variables to Vercel

1. In your Vercel dashboard, go to your project
2. Go to "Settings" → "Environment Variables"
3. Add each variable from your `.env.local` file:
   - `BLOB_READ_WRITE_TOKEN` = your blob token
   - `JWT_SECRET` = a long, secure random string
   - `ADMIN_USERNAME` = coach (or whatever you prefer)
   - `ADMIN_PASSWORD` = legion2025 (or whatever you prefer)

### 4. Deploy

1. Push your code to GitHub
2. Vercel will automatically deploy
3. Your admin panel should work at: `https://your-site.vercel.app/admin`

## 🔧 Testing the Admin Panel

1. Go to `/admin` on your deployed site
2. Login with your username/password
3. Try updating the roster, schedule, or team info
4. Changes should persist after refresh

## 🎯 Default Login Credentials

- **Username**: `coach`
- **Password**: `legion2025`

(Change these in your environment variables for security)

## 📝 Notes

- The Blob storage will automatically create JSON files when you first save data
- If Blob storage isn't configured, the site will show default data
- All data is stored in Vercel Blob, not in your code repository
- The admin panel is protected by JWT authentication

## 🆘 Troubleshooting

**Admin panel shows "Failed to update":**
- Check that `BLOB_READ_WRITE_TOKEN` is set correctly in Vercel environment variables
- Make sure the Blob storage is connected to your project

**Can't login to admin:**
- Check that `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` are set in Vercel environment variables

**Site shows default data:**
- This is normal on first deployment - use the admin panel to add your real data