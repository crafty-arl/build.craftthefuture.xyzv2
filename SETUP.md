# 🚀 Build Studio - Streamlined Development Setup

## 📋 **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Cloudflare account
- Git

## 🛠️ **Quick Start**

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Environment Configuration**

#### **Copy Environment Template**
```bash
cp .env.local.example .env.local
```

#### **Fill Required Variables**
```bash
# .env.local
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token

# Database (will be created in next step)
DATABASE_URL=your-d1-database-url
```

### 3. **Cloudflare Wrangler Setup**

#### **Login to Cloudflare**
```bash
npx wrangler login
```

#### **Create D1 Database**
```bash
npm run db:create
```
*Copy the database ID from output and update `wrangler.toml`*

#### **Create KV Namespace**
```bash
npx wrangler kv:namespace create "USERS"
```
*Copy the namespace ID from output and update `wrangler.toml`*

#### **Update wrangler.toml**
Replace placeholder IDs with your actual IDs:
```toml
[[d1_databases]]
binding = "DB"
database_name = "build-studio-db"
database_id = "your-actual-d1-database-id"

[[kv_namespaces]]
binding = "USERS"
id = "your-actual-kv-namespace-id"
```

### 4. **Database Migration**
```bash
# Local development
npm run db:local

# Production
npm run db:migrate
```

### 5. **Start Development**
```bash
# Terminal 1: Start Cloudflare Worker
npm run worker:dev

# Terminal 2: Start Next.js
npm run dev
```

## 🔧 **Development Workflow**

### **Frontend Development**
- **URL**: http://localhost:3000
- **Hot Reload**: Enabled with Turbopack
- **Authentication**: Integrated with Cloudflare Worker

### **Backend Development**
- **Worker URL**: http://localhost:8787
- **Database**: Local D1 instance
- **API Endpoints**: 
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `GET /api/users/:username` - Get user profile

### **Database Operations**
```bash
# View local database
npx wrangler d1 execute build-studio-db --local --command="SELECT * FROM users;"

# Execute SQL file
npm run db:local
```

## 🚀 **Production Deployment**

### **Deploy Worker**
```bash
npm run worker:deploy
```

### **Deploy Frontend**
```bash
npm run build
npm run start
```

## 📁 **Project Structure**
```
├── src/
│   ├── worker.ts          # Cloudflare Worker (API)
│   └── schema.sql         # Database schema
├── components/
│   └── auth/              # Authentication components
├── lib/
│   └── auth.ts            # Auth service
├── wrangler.toml          # Cloudflare configuration
├── .env.local.example     # Environment template
└── SETUP.md               # This file
```

## 🔐 **Authentication Flow**

1. **User Registration**: Creates account in D1 + stores profile in KV
2. **User Login**: Validates credentials + returns session token
3. **Session Management**: Token stored in localStorage
4. **API Calls**: Include session token in headers

## 🐛 **Troubleshooting**

### **Worker Won't Start**
- Check `wrangler.toml` configuration
- Verify Cloudflare login: `npx wrangler whoami`

### **Database Connection Issues**
- Verify database ID in `wrangler.toml`
- Check if database exists: `npx wrangler d1 list`

### **Environment Variables**
- Ensure `.env.local` exists and is populated
- Restart development server after changes

## 📚 **Useful Commands**

```bash
# Development
npm run dev              # Start Next.js
npm run worker:dev      # Start Worker locally

# Database
npm run db:create       # Create new D1 database
npm run db:migrate      # Run migrations
npm run db:local        # Local database operations

# Deployment
npm run worker:deploy   # Deploy Worker to Cloudflare
npm run build          # Build for production
```

## 🎯 **Next Steps**

1. **Customize Authentication**: Add OAuth providers
2. **Extend Database**: Add more tables for your use case
3. **Add Middleware**: Implement rate limiting, validation
4. **Monitoring**: Set up Cloudflare Analytics
5. **Testing**: Add Jest tests for components and API

---

**Need Help?** Check the [Cloudflare Workers docs](https://developers.cloudflare.com/workers/) or [Next.js docs](https://nextjs.org/docs).