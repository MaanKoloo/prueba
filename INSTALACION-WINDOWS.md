# 🚀 Guía de Instalación - Litio Service ERP en Windows

## 📋 Requisitos Previos

### 1. Instalar Node.js
1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión **LTS** (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Verifica la instalación abriendo **CMD** o **PowerShell**:
   \`\`\`bash
   node --version
   npm --version
   \`\`\`

### 2. Instalar Git (Opcional)
1. Ve a [git-scm.com](https://git-scm.com/)
2. Descarga e instala Git para Windows
3. Verifica: `git --version`

### 3. Editor de Código (Recomendado)
- **Visual Studio Code**: [code.visualstudio.com](https://code.visualstudio.com/)

## 📁 Instalación del Proyecto

### Opción 1: Descargar desde v0
1. En v0, haz clic en **"Download Code"**
2. Selecciona **"Download as ZIP"**
3. Extrae el archivo ZIP en tu carpeta deseada (ej: `C:\litio-erp`)

### Opción 2: Crear proyecto manualmente
1. Crea una carpeta: `C:\litio-erp`
2. Abre **CMD** o **PowerShell** en esa carpeta
3. Ejecuta:
   \`\`\`bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
   \`\`\`

## ⚙️ Configuración del Proyecto

### 1. Abrir terminal en la carpeta del proyecto
- **Opción A**: Shift + Click derecho → "Abrir PowerShell aquí"
- **Opción B**: Abrir CMD y navegar: `cd C:\litio-erp`
- **Opción C**: En VS Code: Terminal → New Terminal

### 2. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### 3. Instalar dependencias adicionales
\`\`\`bash
npm install @supabase/supabase-js lucide-react @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-toast @radix-ui/react-popover @radix-ui/react-scroll-area @radix-ui/react-separator @radix-ui/react-slot class-variance-authority clsx tailwind-merge recharts
\`\`\`

## 🚀 Ejecutar el Proyecto

### 1. Modo Desarrollo
\`\`\`bash
npm run dev
\`\`\`

### 2. Abrir en el navegador
- Ve a: [http://localhost:3000](http://localhost:3000)
- El proyecto se abrirá automáticamente

### 3. Credenciales de acceso
- **Super Admin**: `admin@litio.com` / `admin123`
- **Admin Taller**: `taller@litio.com` / `taller123`
- **Usuario Demo**: `user@litio.com` / `user123`

## 📂 Estructura del Proyecto

\`\`\`
C:\litio-erp\
├── app/                    # Páginas de la aplicación
│   ├── dashboard/         # Dashboard principal
│   ├── inventory/         # Gestión de inventario
│   ├── services/          # Catálogo de servicios
│   ├── users/            # Gestión de usuarios
│   ├── invoices/         # Facturación
│   ├── vehicles/         # Gestión de vehículos
│   ├── workshop/         # Órdenes de taller
│   ├── attendance/       # Control de asistencia
│   ├── reports/          # Reportes y análisis
│   ├── settings/         # Configuración
│   ├── profile/          # Perfil de usuario
│   └── login/            # Página de login
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de interfaz
│   ├── layout/           # Header, Sidebar
│   ├── chat/             # Widget de chat
│   └── notifications/    # Centro de notificaciones
├── lib/                  # Librerías y utilidades
│   ├── auth.ts           # Sistema de autenticación
│   ├── storage.ts        # Gestión de datos
│   └── supabase.ts       # Configuración de Supabase
├── public/               # Archivos estáticos
│   └── images/           # Logos e imágenes
└── scripts/              # Scripts de base de datos
\`\`\`

## 💾 Almacenamiento de Datos

### Ubicación de los datos
Los datos se almacenan en **localStorage** del navegador:

### Ver los datos almacenados
1. Abre **DevTools** (F12)
2. Ve a **Application** → **Local Storage**
3. Selecciona `http://localhost:3000`
4. Verás las claves que empiezan con `litio_erp_`

### Claves de almacenamiento
\`\`\`javascript
litio_erp_users          // Usuarios del sistema
litio_erp_inventory      // Productos e inventario
litio_erp_services       // Catálogo de servicios
litio_erp_clients        // Base de datos de clientes
litio_erp_invoices       // Facturas emitidas
litio_erp_vehicles       // Flota de vehículos
litio_erp_attendance     // Registros de asistencia
litio_erp_workshop_orders // Órdenes de taller
litio_erp_settings       // Configuración del sistema
\`\`\`

## 🔧 Comandos Útiles

### Desarrollo
\`\`\`bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar versión de producción
npm run lint         # Verificar código
\`\`\`

### Solución de problemas
\`\`\`bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar puertos ocupados
netstat -ano | findstr :3000
\`\`\`

## 🌐 Acceso desde otros dispositivos

### En la misma red local
1. Encuentra tu IP local:
   \`\`\`bash
   ipconfig
   \`\`\`
2. Busca la IP en "Adaptador de LAN inalámbrica Wi-Fi"
3. Accede desde otros dispositivos: `http://TU_IP:3000`

## 📱 Funcionalidades Disponibles

### ✅ Módulos Funcionales
- **Dashboard**: Métricas y resumen general
- **Inventario**: Gestión de productos y stock
- **Servicios**: Catálogo de servicios ofrecidos
- **Clientes**: Base de datos de clientes
- **Facturas**: Sistema de facturación
- **Vehículos**: Registro de vehículos
- **Taller**: Órdenes de trabajo
- **Asistencia**: Control de empleados
- **Reportes**: Análisis y estadísticas
- **Configuración**: Ajustes del sistema

### 🔐 Sistema de Usuarios
- **Super Admin**: Acceso completo
- **Admin**: Gestión operativa
- **Colaborador**: Acceso limitado

### 💾 Gestión de Datos
- **Exportar**: Descargar backup completo
- **Importar**: Restaurar desde backup
- **Limpiar**: Eliminar todos los datos

## 🆘 Soporte

### Problemas Comunes

**Error de puerto ocupado:**
\`\`\`bash
# Cambiar puerto
npm run dev -- -p 3001
\`\`\`

**Error de permisos:**
- Ejecutar terminal como Administrador

**Página en blanco:**
- Verificar que todas las dependencias estén instaladas
- Revisar la consola del navegador (F12)

### Contacto
- **Email**: soporte@litio.com
- **Documentación**: Ver archivos del proyecto
- **Logs**: Revisar consola del navegador

---

## 🎉 ¡Listo!

Tu sistema ERP de Litio Service está funcionando en:
**[http://localhost:3000](http://localhost:3000)**

**Credenciales de prueba:**
- `admin@litio.com` / `admin123`
- `taller@litio.com` / `taller123`
- `user@litio.com` / `user123`
