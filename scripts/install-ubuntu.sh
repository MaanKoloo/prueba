#!/bin/bash

# Script de instalación completa para Ubuntu VPS
# Litio Service ERP - Instalación en Ubuntu 20.04/22.04

set -e

echo "🚀 Iniciando instalación de Litio Service ERP en Ubuntu VPS..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables de configuración
APP_NAME="litio-erp"
APP_DIR="/var/www/$APP_NAME"
DB_NAME="litio_erp"
DB_USER="litio_user"
DB_PASSWORD="litio_secure_$(date +%s)"
DOMAIN="your-domain.com"  # Cambiar por tu dominio
EMAIL="admin@your-domain.com"  # Cambiar por tu email

# Función para mostrar mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que se ejecuta como root
if [[ $EUID -ne 0 ]]; then
   print_error "Este script debe ejecutarse como root (sudo)"
   exit 1
fi

# Actualizar sistema
print_status "Actualizando sistema..."
apt update && apt upgrade -y

# Instalar dependencias básicas
print_status "Instalando dependencias básicas..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Instalar Node.js 18 LTS
print_status "Instalando Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verificar instalación de Node.js
node_version=$(node --version)
npm_version=$(npm --version)
print_success "Node.js instalado: $node_version"
print_success "NPM instalado: $npm_version"

# Instalar MySQL 8.0
print_status "Instalando MySQL 8.0..."
apt install -y mysql-server mysql-client

# Configurar MySQL
print_status "Configurando MySQL..."
systemctl start mysql
systemctl enable mysql

# Configurar usuario y base de datos MySQL
print_status "Creando base de datos y usuario..."
mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Instalar Nginx
print_status "Instalando Nginx..."
apt install -y nginx

# Instalar PM2 globalmente
print_status "Instalando PM2..."
npm install -g pm2

# Crear usuario para la aplicación
print_status "Creando usuario para la aplicación..."
useradd -m -s /bin/bash $APP_NAME || true
usermod -aG www-data $APP_NAME

# Crear directorio de la aplicación
print_status "Creando directorio de la aplicación..."
mkdir -p $APP_DIR
chown -R $APP_NAME:$APP_NAME $APP_DIR

# Crear directorio de logs
mkdir -p /var/log/$APP_NAME
chown -R $APP_NAME:$APP_NAME /var/log/$APP_NAME

# Configurar Nginx
print_status "Configurando Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirigir HTTP a HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # Configuración SSL (se configurará con Certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de seguridad
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Configuración del proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Archivos estáticos
    location /_next/static {
        alias $APP_DIR/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Imágenes y assets
    location /images {
        alias $APP_DIR/public/images;
        expires 30d;
        add_header Cache-Control "public";
    }

    # Logs
    access_log /var/log/nginx/$APP_NAME.access.log;
    error_log /var/log/nginx/$APP_NAME.error.log;
}
EOF

# Habilitar sitio
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración de Nginx
nginx -t

# Instalar Certbot para SSL
print_status "Instalando Certbot para SSL..."
apt install -y certbot python3-certbot-nginx

# Configurar firewall
print_status "Configurando firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3306  # MySQL (solo si necesitas acceso externo)

# Crear archivo de variables de entorno
print_status "Creando archivo de configuración..."
cat > $APP_DIR/.env.production << EOF
# Configuración de producción para Litio Service ERP
NODE_ENV=production
PORT=3000

# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# URLs de la aplicación
NEXTAUTH_URL=https://$DOMAIN
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Configuración de la empresa
COMPANY_NAME="Litio Service"
COMPANY_EMAIL="$EMAIL"
COMPANY_PHONE="+56 2 2345 6789"

# Configuración de email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Configuración de archivos
UPLOAD_MAX_SIZE=10485760
UPLOAD_DIR=$APP_DIR/uploads

# Logs
LOG_LEVEL=info
LOG_FILE=/var/log/$APP_NAME/app.log
EOF

chown $APP_NAME:$APP_NAME $APP_DIR/.env.production

# Crear configuración de PM2
print_status "Creando configuración de PM2..."
cat > $APP_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logs
    log_file: '/var/log/$APP_NAME/combined.log',
    out_file: '/var/log/$APP_NAME/out.log',
    error_file: '/var/log/$APP_NAME/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Configuración de reinicio
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G',
    
    // Reinicio automático
    autorestart: true,
    cron_restart: '0 2 * * *', // Reiniciar cada día a las 2 AM
    
    // Configuración avanzada
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
EOF

chown $APP_NAME:$APP_NAME $APP_DIR/ecosystem.config.js

# Crear script de deploy
print_status "Creando script de deploy..."
cat > /usr/local/bin/deploy-$APP_NAME << 'EOF'
#!/bin/bash

APP_NAME="litio-erp"
APP_DIR="/var/www/$APP_NAME"
BACKUP_DIR="/var/backups/$APP_NAME"

echo "🚀 Iniciando deploy de $APP_NAME..."

# Crear backup
mkdir -p $BACKUP_DIR
if [ -d "$APP_DIR/.next" ]; then
    echo "💾 Creando backup..."
    tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C $APP_DIR .
fi

# Cambiar al directorio de la aplicación
cd $APP_DIR

# Instalar dependencias
echo "📦 Instalando dependencias..."
sudo -u $APP_NAME npm ci --production=false

# Build de la aplicación
echo "🔨 Construyendo aplicación..."
sudo -u $APP_NAME npm run build

# Reiniciar aplicación
echo "🔄 Reiniciando aplicación..."
pm2 restart $APP_NAME || pm2 start ecosystem.config.js

echo "✅ Deploy completado exitosamente!"
EOF

chmod +x /usr/local/bin/deploy-$APP_NAME

# Configurar logrotate
print_status "Configurando rotación de logs..."
cat > /etc/logrotate.d/$APP_NAME << EOF
/var/log/$APP_NAME/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 $APP_NAME $APP_NAME
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Configurar cron para backups automáticos
print_status "Configurando backups automáticos..."
cat > /etc/cron.d/$APP_NAME-backup << EOF
# Backup automático de Litio Service ERP
0 2 * * * root /usr/local/bin/backup-$APP_NAME
EOF

# Crear script de backup
cat > /usr/local/bin/backup-$APP_NAME << EOF
#!/bin/bash

APP_NAME="$APP_NAME"
DB_NAME="$DB_NAME"
DB_USER="$DB_USER"
DB_PASSWORD="$DB_PASSWORD"
BACKUP_DIR="/var/backups/$APP_NAME"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup de la base de datos
mysqldump -u \$DB_USER -p\$DB_PASSWORD \$DB_NAME > \$BACKUP_DIR/db_backup_\$DATE.sql

# Backup de archivos de la aplicación
tar -czf \$BACKUP_DIR/app_backup_\$DATE.tar.gz -C /var/www/\$APP_NAME .

# Eliminar backups antiguos (más de 30 días)
find \$BACKUP_DIR -name "*.sql" -mtime +30 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completado: \$DATE"
EOF

chmod +x /usr/local/bin/backup-$APP_NAME

# Reiniciar servicios
print_status "Reiniciando servicios..."
systemctl restart nginx
systemctl restart mysql

# Mostrar información final
print_success "¡Instalación completada exitosamente!"
echo ""
echo "📋 Información de la instalación:"
echo "   - Aplicación: $APP_NAME"
echo "   - Directorio: $APP_DIR"
echo "   - Base de datos: $DB_NAME"
echo "   - Usuario DB: $DB_USER"
echo "   - Contraseña DB: $DB_PASSWORD"
echo "   - Dominio: $DOMAIN"
echo ""
echo "🔧 Próximos pasos:"
echo "   1. Subir el código de la aplicación a $APP_DIR"
echo "   2. Ejecutar: deploy-$APP_NAME"
echo "   3. Configurar SSL: certbot --nginx -d $DOMAIN"
echo "   4. Importar esquema de BD: mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < database/schema.sql"
echo "   5. Importar datos iniciales: mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < database/seed.sql"
echo ""
echo "🔐 Credenciales por defecto:"
echo "   - admin@litio.com / admin123"
echo "   - taller@litio.com / taller123"
echo "   - user@litio.com / user123"
echo ""
echo "📁 Archivos importantes:"
echo "   - Configuración: $APP_DIR/.env.production"
echo "   - Logs: /var/log/$APP_NAME/"
echo "   - Backups: /var/backups/$APP_NAME/"
echo "   - Deploy: deploy-$APP_NAME"
echo ""

# Guardar información en archivo
cat > /root/$APP_NAME-install-info.txt << EOF
Litio Service ERP - Información de Instalación
=============================================

Fecha de instalación: $(date)

Configuración:
- Aplicación: $APP_NAME
- Directorio: $APP_DIR
- Base de datos: $DB_NAME
- Usuario DB: $DB_USER
- Contraseña DB: $DB_PASSWORD
- Dominio: $DOMAIN

Comandos útiles:
- Deploy: deploy-$APP_NAME
- Backup manual: backup-$APP_NAME
- Ver logs: pm2 logs $APP_NAME
- Estado: pm2 status
- Reiniciar: pm2 restart $APP_NAME

Credenciales por defecto:
- admin@litio.com / admin123
- taller@litio.com / taller123
- user@litio.com / user123
EOF

print_success "Información guardada en /root/$APP_NAME-install-info.txt"
