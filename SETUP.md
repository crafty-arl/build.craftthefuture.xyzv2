# Build Studio Setup Guide

A comprehensive guide to set up Build Studio with OAuth authentication (GitHub & Google) and Cloudflare integration.

## Prerequisites

- Node.js 18+ and npm
- GitHub account (for OAuth app)
- Google account (for OAuth app)
- Cloudflare account (optional, for additional features)

## Quick Start

### 1. Automated Setup (Recommended)

Run the setup script for immediate results:

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Manual Setup

If you prefer manual setup or the script fails:

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Install Wrangler globally
npm install -g wrangler
```

## Environment Configuration

### 1. Create OAuth Applications

#### GitHub OAuth App
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Build Studio
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and **Client Secret**

#### Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3000/auth`
7. Copy the **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Edit `.env.local` with your OAuth credentials:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Google OAuth
GOOGLE_ID=your-google-oauth-client-id
GOOGLE_SECRET=your-google-oauth-client-secret

# Cloudflare (optional)
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
```

**Important**: Generate a strong `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:3000` with hot reloading enabled.

### 2. Test Authentication

1. Navigate to `/auth`
2. Click "Get Started"
3. Choose GitHub or Google OAuth
4. Complete the OAuth flow
5. You'll be redirected back and authenticated

### 3. Hot Reloading

The development server automatically reloads when you make changes to:
- React components
- API routes
- Configuration files
- CSS/SCSS files

## Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # OAuth API routes
│   ├── auth/page.tsx                     # Authentication page
│   └── layout.tsx                        # Root layout with auth provider
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx                 # OAuth modal
│   │   └── OAuthButtons.tsx              # GitHub/Google login buttons
│   └── providers/
│       └── NextAuthProvider.tsx          # Auth context provider
├── lib/
│   └── auth.ts                           # Authentication service
├── types/
│   └── next-auth.d.ts                    # NextAuth type extensions
├── .env.local.example                    # Environment template
└── package.json                          # Dependencies and scripts
```

## Authentication Flow

1. **User clicks OAuth button** → Redirects to provider (GitHub/Google)
2. **Provider authenticates user** → Returns authorization code
3. **NextAuth exchanges code** → Gets access token and user info
4. **Session created** → User is authenticated and redirected
5. **Protected routes** → Check session status automatically

## Features

- ✅ **GitHub OAuth**: Secure authentication via GitHub
- ✅ **Google OAuth**: Secure authentication via Google
- ✅ **Session Management**: Automatic session handling
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Hot Reloading**: Immediate development feedback
- ✅ **Responsive UI**: Mobile-friendly design
- ✅ **Security**: No password storage, OAuth tokens only

## Troubleshooting

### Common Issues

1. **OAuth callback errors**
   - Verify redirect URIs match exactly
   - Check environment variables are set
   - Ensure OAuth apps are properly configured

2. **Session not persisting**
   - Check `NEXTAUTH_SECRET` is set
   - Verify `NEXTAUTH_URL` matches your domain
   - Clear browser cookies/localStorage

3. **Build errors**
   - Run `npm install` to ensure all dependencies
   - Check TypeScript compilation with `npm run build`
   - Verify all imports are correct

### Debug Mode

Enable NextAuth debug mode in `.env.local`:
```bash
NEXTAUTH_DEBUG=true
```

## Production Deployment

### Environment Variables
Update `.env.local` with production URLs:
```bash
NEXTAUTH_URL=https://yourdomain.com
GITHUB_ID=your-prod-github-id
GITHUB_SECRET=your-prod-github-secret
GOOGLE_ID=your-prod-google-id
GOOGLE_SECRET=your-prod-google-secret
```

### Build and Deploy
```bash
npm run build
npm start
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Authentication
# OAuth is handled automatically by NextAuth.js
# No manual commands needed for auth operations
```

## Next Steps

After setup, you can:
1. Customize the OAuth providers
2. Add more authentication options
3. Implement protected routes
4. Add user profile management
5. Integrate with Cloudflare services

## Support

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Note**: This setup provides immediate results with hot reloading and secure OAuth authentication. The system automatically handles user sessions and provides a seamless development experience.