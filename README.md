# 🚀 Build Studio

A **minimalist, efficient coding sandbox** with integrated OAuth authentication (GitHub & Google) and hot reloading for immediate development results.

## ✨ Features

- 🔐 **OAuth Authentication**: Secure login via GitHub & Google
- ⚡ **Hot Reloading**: Instant feedback during development
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔒 **Session Management**: Automatic user session handling
- 📱 **Mobile Friendly**: Responsive design for all devices
- 🚀 **TypeScript**: Full type safety and IntelliSense
- 🎯 **Streamlined Setup**: Get running in minutes, not hours

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
# Clone and setup in one command
git clone <your-repo>
cd build-studio
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Manual Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Configure OAuth apps (see SETUP.md)
# Start development
npm run dev
```

## 🔧 OAuth Configuration

### 1. GitHub OAuth App
- **Homepage**: `http://localhost:3000`
- **Callback**: `http://localhost:3000/api/auth/callback/github`

### 2. Google OAuth App
- **Redirect URIs**: 
  - `http://localhost:3000/api/auth/callback/google`
  - `http://localhost:3000/auth`

### 3. Environment Variables
```bash
# .env.local
NEXTAUTH_SECRET=your-secret-key
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
GOOGLE_ID=your-google-oauth-id
GOOGLE_SECRET=your-google-oauth-secret
```

## 🏗️ Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # OAuth API routes
│   ├── auth/page.tsx                     # Authentication page
│   └── layout.tsx                        # Root layout
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx                 # OAuth modal
│   │   └── OAuthButtons.tsx              # Login buttons
│   └── providers/
│       └── NextAuthProvider.tsx          # Auth context
├── lib/
│   └── auth.ts                           # Auth service
├── types/
│   └── next-auth.d.ts                    # Type extensions
└── scripts/
    └── setup.sh                          # Auto-setup script
```

## 🚀 Development Commands

```bash
npm run dev              # Start dev server (hot reload)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

## 🎯 Demo

Visit `/auth` to see the OAuth authentication system in action:

1. **Click "Get Started"** → Opens OAuth modal
2. **Choose Provider** → GitHub or Google
3. **Authenticate** → Redirects to provider
4. **Success** → Returns authenticated with session

## 📚 Documentation

- **[SETUP.md](./SETUP.md)**: Detailed setup instructions
- **[OAuth Configuration](./SETUP.md#environment-configuration)**: Step-by-step OAuth setup
- **[Troubleshooting](./SETUP.md#troubleshooting)**: Common issues and solutions

## 🔐 Authentication Flow

```
User → OAuth Provider → NextAuth → Session → Protected Routes
  ↓         ↓           ↓         ↓         ↓
Click    Authenticate  Validate  Store     Access
Button   User         Token     Session   Features
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Authentication**: NextAuth.js with OAuth providers
- **Styling**: Tailwind CSS + Radix UI components
- **Development**: Hot reloading with Turbopack
- **Deployment**: Vercel-ready with environment config

## 🚀 Production Deployment

1. **Update Environment Variables**
   ```bash
   NEXTAUTH_URL=https://yourdomain.com
   # Update OAuth callback URLs
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- **Documentation**: [SETUP.md](./SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**Built with ❤️ for developers who value efficiency and simplicity.**

*Get started in minutes, not hours. Build Studio - where development meets simplicity.*
