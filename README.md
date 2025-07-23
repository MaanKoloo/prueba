# Litio Service ERP

Sistema de gestión integral (ERP) para talleres automotrices especializados en energía solar. Desarrollado con Next.js 14, MySQL y diseñado para ser desplegado en VPS Ubuntu.

## 🚀 Características Principales

### 📊 Módulos del Sistema
- **Dashboard**: Panel de control con métricas en tiempo real
- **Inventario**: Gestión de productos y stock
- **Servicios**: Catálogo de servicios y precios
- **Clientes**: Base de datos de clientes
- **Vehículos**: Registro de vehículos por cliente
- **Taller**: Órdenes de trabajo y seguimiento
- **Facturación**: Generación y gestión de facturas
- **Asistencia**: Control de horarios del personal
- **Reportes**: Análisis y estadísticas del negocio
- **Usuarios**: Gestión de usuarios y permisos

### 🔧 Funcionalidades Técnicas
- **Autenticación**: Sistema de login con roles (super_admin, admin, colaborador)
- **Base de Datos**: MySQL 8.0 con esquema optimizado
- **Responsive**: Diseño adaptable a móviles y tablets
- **Tiempo Real**: Actualizaciones en vivo de datos
- **Exportación**: Backup y exportación de datos
- **Logs**: Sistema completo de auditoría
- **SSL**: Configuración automática con Let's Encrypt

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Node.js, MySQL 2
- **Base de Datos**: MySQL 8.0
- **Servidor**: Nginx, PM2
- **SSL**: Certbot (Let's Encrypt)
- **OS**: Ubuntu 20.04/22.04

## 📋 Requisitos del Sistema

### Para Desarrollo Local
- Node.js 18+ 
- NPM 8+
- MySQL 8.0+ (opcional, usa localStorage por defecto)

### Para Producción (VPS)
- Ubuntu 20.04/22.04 LTS
- 2GB RAM mínimo (4GB recomendado)
- 20GB espacio en disco
- Dominio configurado
- Acceso root/sudo

## 🚀 Instalación Rápida en VPS Ubuntu

### 1. Ejecutar Script de Instalación Automática

\`\`\`bash
# Descargar y ejecutar script de instalación
wget https://raw.githubusercontent.com/tu-repo/litio-erp/main/scripts/install-ubuntu.sh
chmod +x install-ubuntu.sh
sudo ./install-ubuntu.sh
\`\`\`

### 2. Configurar Variables de Entorno

Edita el archivo de configuración:
\`\`\`bash
sudo nano /var/www/litio-erp/.env.production
\`\`\`

Configura tu dominio y credenciales de base de datos.

### 3. Subir Código de la Aplicación

\`\`\`bash
# Clonar repositorio
cd /var/www/litio-erp
sudo -u litio-erp git clone https://github.com/tu-repo/litio-erp.git .

# O subir archivos manualmente via SCP/SFTP
\`\`\`

### 4. Configurar Base de Datos

\`\`\`bash
# Importar esquema
mysql -u litio_user -p litio_erp < database/schema.sql

# Importar datos iniciales
mysql -u litio_user -p litio_erp < database/seed.sql
\`\`\`

### 5. Desplegar Aplicación

\`\`\`bash
# Ejecutar deploy
deploy-litio-erp
\`\`\`

### 6. Configurar SSL

\`\`\`bash
# Configurar certificado SSL automático
sudo certbot --nginx -d tu-dominio.com
\`\`\`

## 🔐 Credenciales por Defecto

Una vez instalado, puedes acceder con estas credenciales:

- **Super Administrador**: `admin@litio.com` / `admin123`
- **Admin Taller**: `taller@litio.com` / `taller123`
- **Usuario Demo**: `user@litio.com` / `user123`

> ⚠️ **Importante**: Cambia estas contraseñas inmediatamente después de la instalación.

## 📁 Estructura del Proyecto

\`\`\`
litio-erp/
├── app/                    # Páginas de Next.js
│   ├── dashboard/         # Panel principal
│   ├── inventory/         # Gestión de inventario
│   ├── services/          # Catálogo de servicios
│   ├── clients/           # Gestión de clientes
│   ├── vehicles/          # Registro de vehículos
│   ├── workshop/          # Órdenes de taller
│   ├── invoices/          # Facturación
│   ├── attendance/        # Control de asistencia
│   ├── reports/           # Reportes y análisis
│   ├── users/             # Gestión de usuarios
│   └── settings/          # Configuración
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI
│   └── layout/           # Componentes de layout
├── lib/                  # Utilidades y configuración
│   ├── auth.ts           # Sistema de autenticación
│   ├── database.js       # Conexión a MySQL
│   └── storage.ts        # Gestión de datos
├── database/             # Scripts de base de datos
│   ├── schema.sql        # Esquema de la BD
│   └── seed.sql          # Datos iniciales
├── scripts/              # Scripts de instalación
│   └── install-ubuntu.sh # Instalación automática
└── public/               # Archivos estáticos
\`\`\`

## 🔧 Comandos Útiles

### Desarrollo Local
\`\`\`bash
npm run dev          # Iniciar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar en modo producción
npm run lint         # Verificar código
\`\`\`

### Producción (VPS)
\`\`\`bash
deploy-litio-erp     # Desplegar nueva versión
backup-litio-erp     # Crear backup manual
pm2 status           # Ver estado de la aplicación
pm2 logs litio-erp   # Ver logs en tiempo real
pm2 restart litio-erp # Reiniciar aplicación
\`\`\`

### Base de Datos
\`\`\`bash
# Backup de BD
mysqldump -u litio_user -p litio_erp > backup.sql

# Restaurar BD
mysql -u litio_user -p litio_erp < backup.sql

# Acceder a MySQL
mysql -u litio_user -p litio_erp
\`\`\`

## 📊 Monitoreo y Logs

### Ubicación de Logs
- **Aplicación**: `/var/log/litio-erp/`
- **Nginx**: `/var/log/nginx/`
- **MySQL**: `/var/log/mysql/`

### Monitoreo con PM2
\`\`\`bash
pm2 monit            # Monitor en tiempo real
pm2 status           # Estado de procesos
pm2 logs --lines 100 # Últimas 100 líneas de log
\`\`\`

## 🔒 Seguridad

### Configuraciones Implementadas
- ✅ Firewall UFW configurado
- ✅ SSL/TLS con Let's Encrypt
- ✅ Headers de seguridad en Nginx
- ✅ Autenticación por roles
- ✅ Logs de auditoría
- ✅ Backups automáticos
- ✅ Rotación de logs

### Recomendaciones Adicionales
- Cambiar contraseñas por defecto
- Configurar 2FA para usuarios admin
- Revisar logs regularmente
- Mantener sistema actualizado
- Configurar monitoreo externo

## 🆘 Solución de Problemas

### Aplicación no inicia
\`\`\`bash
# Verificar logs
pm2 logs litio-erp

# Verificar configuración
pm2 describe litio-erp

# Reiniciar
pm2 restart litio-erp
\`\`\`

### Error de base de datos
\`\`\`bash
# Verificar estado de MySQL
systemctl status mysql

# Verificar conexión
mysql -u litio_user -p -e "SELECT 1"

# Revisar logs de MySQL
tail -f /var/log/mysql/error.log
\`\`\`

### Problemas de SSL
\`\`\`bash
# Renovar certificado
certbot renew

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx
\`\`\`

## 📞 Soporte

Para soporte técnico o consultas:

- **Email**: soporte@litioservice.cl
- **Teléfono**: +56 2 2345 6789
- **Documentación**: [Wiki del proyecto]
- **Issues**: [GitHub Issues]

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Desarrollado con ❤️ para Litio Service**
