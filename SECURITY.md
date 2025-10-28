# 🔐 Security Configuration Guide

## Environment Variables

This project uses environment variables to protect sensitive information like API keys and credentials.

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file with your actual credentials:**
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_USERNAME=your-admin-username
   VITE_ADMIN_PASSWORD=your-admin-password
   ```

3. **Never commit `.env` file:**
   - The `.env` file is already in `.gitignore`
   - It will NOT be uploaded to GitHub
   - Keep it safe and secure locally

### Important Security Notes

⚠️ **DO NOT:**
- Commit `.env` file to version control
- Share `.env` file with others
- Expose API keys in client-side code
- Use weak passwords for admin credentials

✅ **DO:**
- Keep `.env` file in `.gitignore`
- Use strong, unique passwords
- Rotate API keys regularly
- Use environment-specific configurations

### Files Protected

The following sensitive information is now protected:

1. **Supabase Configuration** (`js/supabase-config.js`)
   - URL and API keys loaded from environment variables
   - Fallback to defaults if not set

2. **Admin Credentials** (`js/app.js`)
   - Username and password stored securely
   - Loaded from environment variables

3. **Configuration Manager** (`js/config.js`)
   - Centralized configuration management
   - Easy to update and maintain

### Deployment

When deploying to production:

1. **Netlify:**
   - Add environment variables in Netlify dashboard
   - Settings → Build & Deploy → Environment

2. **GitHub Pages:**
   - Use GitHub Secrets for sensitive data
   - Build process will use these secrets

3. **Other Platforms:**
   - Follow platform-specific environment variable setup
   - Never hardcode secrets in code

### Example `.env` File

```
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Credentials
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=your-secure-password

# API Configuration
VITE_API_BASE_URL=https://your-project.supabase.co

# Environment
VITE_ENV=development
```

### Checking Security

To verify your setup is secure:

1. ✅ `.env` file is in `.gitignore`
2. ✅ `.env` file is NOT in git history
3. ✅ Sensitive keys are not in any committed files
4. ✅ `.env.example` shows structure without real values

### Questions?

For more information about security best practices, visit:
- [Supabase Security](https://supabase.com/docs/guides/security)
- [Environment Variables Best Practices](https://12factor.net/config)

