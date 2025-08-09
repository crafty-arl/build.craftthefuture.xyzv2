#!/bin/bash

echo "🚀 Build Studio - OAuth Authentication Setup"
echo "============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js $(node --version) and npm $(npm --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check your internet connection and try again."
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create environment file
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment configuration..."
    cp .env.local.example .env.local
    echo "✅ .env.local created from template"
    echo ""
    echo "⚠️  IMPORTANT: You need to configure OAuth applications:"
    echo ""
    echo "1. GitHub OAuth App:"
    echo "   - Go to: https://github.com/settings/developers"
    echo "   - Create new OAuth App"
    echo "   - Homepage: http://localhost:3000"
    echo "   - Callback: http://localhost:3000/api/auth/callback/github"
    echo ""
    echo "2. Google OAuth App:"
    echo "   - Go to: https://console.cloud.google.com/"
    echo "   - Create OAuth 2.0 Client ID"
    echo "   - Redirect URIs:"
    echo "     * http://localhost:3000/api/auth/callback/google"
    echo "     * http://localhost:3000/auth"
    echo ""
    echo "3. Update .env.local with your OAuth credentials"
    echo ""
else
    echo "✅ .env.local already exists"
fi

# Generate NEXTAUTH_SECRET if not present
if ! grep -q "NEXTAUTH_SECRET=" .env.local || grep -q "your-super-secret-key-here" .env.local; then
    echo "🔐 Generating secure NEXTAUTH_SECRET..."
    SECRET=$(openssl rand -base64 32)
    if command -v sed &> /dev/null; then
        sed -i "s/NEXTAUTH_SECRET=your-super-secret-key-here/NEXTAUTH_SECRET=$SECRET/" .env.local
        echo "✅ NEXTAUTH_SECRET generated and updated"
    else
        echo "⚠️  Please manually update NEXTAUTH_SECRET in .env.local with:"
        echo "   NEXTAUTH_SECRET=$SECRET"
    fi
    echo ""
fi

echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your OAuth applications (GitHub & Google)"
echo "2. Update .env.local with OAuth credentials"
echo "3. Start development server: npm run dev"
echo "4. Visit http://localhost:3000/auth to test authentication"
echo ""
echo "📚 For detailed setup instructions, see SETUP.md"
echo ""
echo "🚀 Happy coding!"