#!/bin/bash

# Complete Deploy Script for Intranet Litio Service
# Ubuntu Server 24.04 Production Deployment

set -e  # Exit on any error

echo "🚀 Iniciando deploy de Intranet Litio Service..."

# Variables
APP_DIR="/var/www/litio-erp"
LOG_DIR="/var/log/litio-erp"
BACKUP_DIR="/var/backups/litio-erp"
SERVICE_NAME="intranet-litio-service"

# Crear directorios necesarios
echo "📁 Creando directorios..."
sudo mkdir -p $LOG_DIR
sudo mkdir -p $BACKUP_DIR
sudo mkdir -p $APP_DIR/uploads
sudo chown -R $USER:$USER $APP_DIR
sudo chown -R $USER:$USER $LOG_DIR

# Backup de la aplicación actual (si existe)
if [ -d "$APP_DIR/.next" ]; then
    echo "💾 Creando backup..."
    sudo tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C $APP_DIR .
    echo "✅ Backup creado en $BACKUP_DIR"
fi

# Ir al directorio de la aplicación
cd $APP_DIR

# Verificar que existe package.json
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado en $APP_DIR"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci --production=false

# Verificar variables de entorno
if [ ! -f ".env.local" ]; then
    echo "⚠️  Copiando variables de entorno..."
    cp .env.production .env.local
    echo "🔧 Por favor, edita .env.local con tus credenciales reales"
fi

# Build de la aplicación
echo "🔨 Construyendo aplicación..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d ".next" ]; then
    echo "❌ Error: Build falló"
    exit 1
fi

# Detener PM2 si está corriendo
echo "⏹️  Deteniendo aplicación..."
pm2 stop $SERVICE_NAME 2>/dev/null || true
pm2 delete $SERVICE_NAME 2>/dev/null || true

# Iniciar aplicación con PM2
echo "▶️  Iniciando aplicación..."
pm2 start ecosystem.config.js --env production

# Guardar configuración de PM2
pm2 save
pm2 startup

# Verificar estado
sleep 5
if pm2 list | grep -q "online"; then
    echo "✅ Aplicación iniciada correctamente"
    pm2 status
else
    echo "❌ Error al iniciar la aplicación"
    pm2 logs --lines 20
    exit 1
fi

# Configurar logrotate
echo "📋 Configurando rotación de logs..."
sudo tee /etc/logrotate.d/litio-erp > /dev/null << EOF
$LOG_DIR/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Verificar conectividad
echo "🔍 Verificando aplicación..."
sleep 10

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Aplicación respondiendo correctamente en puerto 3000"
else
    echo "⚠️  Aplicación no responde en puerto 3000"
    echo "📋 Logs de la aplicación:"
    pm2 logs $SERVICE_NAME --lines 10
fi

# Mostrar información final
echo ""
echo "🎉 Deploy completado exitosamente!"
echo "📊 Información del deploy:"
echo "   - Aplicación: Intranet Litio Service"
echo "   - Directorio: $APP_DIR"
echo "   - Logs: $LOG_DIR"
echo "   - Puerto: 3000"
echo "   - Estado: $(pm2 jlist | jq -r '.[0].pm2_env.status' 2>/dev/null || echo 'Verificar manualmente')"
echo ""
echo "🔧 Comandos útiles:"
echo "   - Ver logs: pm2 logs $SERVICE_NAME"
echo "   - Reiniciar: pm2 restart $SERVICE_NAME"
echo "   - Estado: pm2 status"
echo "   - Monitoreo: pm2 monit"
echo ""
echo "🌐 Accede a la aplicación en: http://localhost:3000"
echo "👤 Usuario admin: admin@litio.com / admin123"
