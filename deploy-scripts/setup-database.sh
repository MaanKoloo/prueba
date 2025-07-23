#!/bin/bash

# Setup Database for Intranet Litio Service
# Ubuntu Server 24.04 Deploy Script

echo "🗄️  Configurando Base de Datos para Intranet Litio Service..."

# Variables de configuración
DB_NAME="litio_erp"
DB_USER="litio_user"
DB_PASSWORD="litio_secure_2024"

# Crear usuario y base de datos
sudo -u postgres psql << EOF
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE $DB_NAME OWNER $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
\q
EOF

echo "✅ Base de datos creada exitosamente"

# Ejecutar scripts SQL
echo "📋 Ejecutando scripts SQL..."

# Script 1: Crear tablas
PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME << 'EOF'
-- Crear tablas principales para Intranet Litio Service

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'colaborador',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de inventario
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    supplier VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    color VARCHAR(50),
    engine VARCHAR(100),
    owner_name VARCHAR(255) NOT NULL,
    owner_phone VARCHAR(20),
    owner_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes de taller
CREATE TABLE IF NOT EXISTS workshop_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id),
    service_id UUID REFERENCES services(id),
    assigned_to UUID REFERENCES users(id),
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    estimated_completion TIMESTAMP,
    actual_completion TIMESTAMP,
    total_cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de facturas
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    service_id UUID REFERENCES services(id),
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    due_date DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asistencia
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    break_start TIME,
    break_end TIME,
    hours_worked DECIMAL(4,2),
    status VARCHAR(50) DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    reference_type VARCHAR(100),
    reference_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mensajes (chat)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

EOF

# Script 2: Datos iniciales
PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME << 'EOF'
-- Insertar usuarios iniciales
INSERT INTO users (email, password, name, role) VALUES
('admin@litio.com', 'admin123', 'Administrador', 'super_admin'),
('user@litio.com', 'user123', 'Usuario Demo', 'colaborador')
ON CONFLICT (email) DO NOTHING;

-- Insertar servicios iniciales
INSERT INTO services (name, description, price, duration_minutes, category) VALUES
('Cambio de Aceite', 'Cambio de aceite y filtro', 25000, 30, 'Mantenimiento'),
('Alineación', 'Alineación de ruedas', 35000, 45, 'Neumáticos'),
('Balanceado', 'Balanceado de ruedas', 20000, 30, 'Neumáticos'),
('Revisión General', 'Revisión completa del vehículo', 50000, 120, 'Diagnóstico')
ON CONFLICT DO NOTHING;

-- Insertar productos de inventario
INSERT INTO inventory (name, description, category, quantity, min_stock, price, supplier) VALUES
('Aceite Motor 5W-30', 'Aceite sintético para motor', 'Lubricantes', 50, 10, 8500, 'Shell'),
('Filtro de Aceite', 'Filtro de aceite universal', 'Filtros', 30, 5, 3500, 'Mann Filter'),
('Pastillas de Freno', 'Pastillas de freno delanteras', 'Frenos', 20, 5, 25000, 'Brembo'),
('Bujías', 'Bujías de encendido', 'Encendido', 40, 10, 4500, 'NGK')
ON CONFLICT DO NOTHING;

EOF

echo "✅ Scripts SQL ejecutados exitosamente"
echo "🔐 Credenciales de la base de datos:"
echo "   Usuario: $DB_USER"
echo "   Base de datos: $DB_NAME"
echo "   Host: localhost"
echo "   Puerto: 5432"
