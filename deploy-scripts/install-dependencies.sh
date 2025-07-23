#!/bin/bash

# Install Dependencies for Intranet Litio Service
# Ubuntu Server 24.04 Deploy Script

echo "📦 Instalando dependencias para Intranet Litio Service..."

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20 LTS
echo "🟢 Instalando Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Instalar PM2 globalmente
echo "⚡ Instalando PM2..."
sudo npm install -g pm2

# Instalar dependencias del proyecto
echo "📋 Instalando dependencias del proyecto..."
npm install

# Instalar dependencias específicas si no están en package.json
npm install @supabase/supabase-js
npm install lucide-react
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-toast
npm install @radix-ui/react-popover
npm install @radix-ui/react-scroll-area
npm install class-variance-authority
npm install clsx
npm install tailwind-merge

# Build del proyecto
echo "🔨 Construyendo proyecto..."
npm run build

echo "✅ Dependencias instaladas exitosamente"
echo "📊 Resumen de instalación:"
echo "   - Node.js: $(node --version)"
echo "   - npm: $(npm --version)"
echo "   - PM2: $(pm2 --version)"
echo "   - Proyecto construido exitosamente"
