#!/bin/bash

echo "🚀 Build Studio - Quick Setup Script"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "⚠️  Please update .env.local with your actual values"
else
    echo "✅ .env.local already exists"
fi

# Check if Wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler..."
    npm install -g wrangler
else
    echo "✅ Wrangler is already installed"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Update .env.local with your Cloudflare credentials"
echo "2. Run: npx wrangler login"
echo "3. Run: npm run db:create"
echo "4. Update wrangler.toml with your database IDs"
echo "5. Run: npm run db:local"
echo "6. Run: npm run worker:dev (in one terminal)"
echo "7. Run: npm run dev (in another terminal)"
echo ""
echo "📚 See SETUP.md for detailed instructions"
echo "🌐 Visit http://localhost:3000/auth to test authentication"