# Admin System Setup Guide

This guide will help you set up the admin system to manage your JSON data files through a private GitHub repository.

## Prerequisites

1. A private GitHub repository to store your data files
2. A GitHub Personal Access Token with repository permissions
3. Node.js and npm installed

## Step 1: Create a Private GitHub Repository

1. Go to GitHub and create a new private repository (e.g., `shelley-legion-data`)
2. Create a `data` folder in the repository
3. Upload your existing JSON files (`roster.json`, `branding.json`, etc.) to the `shelley-legion/data` folder

## Step 2: Generate GitHub Personal Access Token

1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Shelley Legion Admin"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
5. Copy the generated token (you won't see it again!)

## Step 3: Generate Admin Password Hash

Use an online bcrypt generator or Node.js to create a password hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('your_password', 12))"
```

Copy the generated hash for the next step.

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Email configuration (existing)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Admin configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_generated_hash_from_step_3
JWT_SECRET=your_random_jwt_secret_here

# GitHub configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_private_repo_name
GITHUB_BRANCH=main
```

### Generating JWT Secret

You can generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 5: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/admin`

3. Log in with your admin credentials

4. You should see a list of your data files from GitHub

5. Try editing a file and saving it - check your GitHub repository to confirm the changes

## Usage

### Accessing the Admin Panel

- URL: `http://localhost:3000/admin` (or your production domain)
- Login with the username and password you configured

### Managing Data Files

- Select a file from the left panel
- Edit the JSON content in the text area
- Click "Save Changes" to commit to GitHub
- All changes are automatically committed with descriptive messages

### Security Features

- JWT-based authentication with 24-hour expiration
- Password hashing with bcrypt
- GitHub API integration for secure data storage
- Admin-only access to sensitive operations

## Troubleshooting

### Common Issues

1. **"No token provided" error**: Check your GitHub token and permissions
2. **"File not found" error**: Ensure your data files are in the `data/` folder in GitHub
3. **"Invalid JSON" error**: Check your JSON syntax before saving
4. **Login fails**: Verify your password hash was generated correctly

### Checking GitHub Integration

You can test your GitHub connection by checking if the API can list your files:

```bash
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
     https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/data
```

## Production Deployment

When deploying to production:

1. Set all environment variables in your hosting platform
2. Ensure your GitHub token has the minimum required permissions
3. Consider using GitHub's fine-grained personal access tokens for better security
4. Set up proper backup procedures for your data repository

## Security Best Practices

- Use a strong admin password
- Regularly rotate your GitHub token
- Monitor your repository for unauthorized changes
- Consider enabling two-factor authentication on your GitHub account
- Use HTTPS in production
- Regularly update dependencies

## Adding New Data Files

To add new data files:

1. Create the JSON file in your GitHub repository's `data/` folder
2. The file will automatically appear in the admin panel
3. No code changes required!

## Customizing the Admin Interface

The admin interface is built with React and Tailwind CSS. You can customize:

- `app/components/admin/LoginForm.tsx` - Login page styling
- `app/components/admin/DataEditor.tsx` - Main editor interface
- `app/admin/page.tsx` - Overall admin page layout

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Test your GitHub token permissions
4. Ensure your JSON files are valid