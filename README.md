# 🚀 Build Studio - Streamlined Development Platform

A minimalist, efficient coding sandbox with integrated user authentication and Cloudflare Workers backend.

## ✨ **Features**

- **🔐 User Authentication**: Secure login/registration system
- **🗄️ Cloudflare D1 Database**: SQLite-compatible database
- **⚡ KV Storage**: Fast user data lookups
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS
- **🚀 Fast Development**: Hot reload with Turbopack
- **☁️ Edge Computing**: Deploy anywhere with Cloudflare Workers

## 🚀 **Quick Start**

### **Option 1: Automated Setup**
```bash
./scripts/setup.sh
```

### **Option 2: Manual Setup**
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Update .env.local with your credentials
# Run setup commands from SETUP.md
```

## 📁 **Project Structure**

```
├── src/
│   ├── worker.ts          # Cloudflare Worker API
│   └── schema.sql         # Database schema
├── components/
│   └── auth/              # Authentication components
├── lib/
│   └── auth.ts            # Auth service
├── app/
│   └── auth/              # Demo authentication page
├── wrangler.toml          # Cloudflare configuration
├── .env.local.example     # Environment template
├── SETUP.md               # Detailed setup guide
└── scripts/
    └── setup.sh           # Automated setup script
```

## 🔧 **Development Commands**

```bash
# Frontend
npm run dev                # Start Next.js (http://localhost:3000)

# Backend
npm run worker:dev        # Start Worker locally (http://localhost:8787)

# Database
npm run db:create         # Create D1 database
npm run db:local          # Local database operations
npm run db:migrate        # Production migrations

# Deployment
npm run worker:deploy     # Deploy to Cloudflare
npm run build            # Build for production
```

## 🌐 **Demo**

Visit `/auth` to see the authentication system in action:
- User registration
- Secure login
- Session management
- Protected routes

## 📚 **Documentation**

- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[Cloudflare Workers](https://developers.cloudflare.com/workers/)** - Backend documentation
- **[Next.js](https://nextjs.org/docs)** - Frontend framework

## 🔐 **Authentication Flow**

1. **Registration**: User creates account → stored in D1 + KV
2. **Login**: Credentials validated → session token returned
3. **Session**: Token stored in localStorage
4. **API Calls**: Include token for authenticated requests

## 🚀 **Deployment**

### **Cloudflare Worker**
```bash
npm run worker:deploy
```

### **Frontend**
```bash
npm run build
npm run start
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details

---

**Built with ❤️ using Next.js, Cloudflare Workers, and Tailwind CSS**
