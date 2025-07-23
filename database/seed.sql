-- Datos iniciales para Litio Service ERP
USE litio_erp;

-- Insertar usuarios por defecto
INSERT INTO users (id, email, password, name, role, status, phone, department, position) VALUES
('1', 'admin@litio.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador Principal', 'super_admin', 'active', '+56 9 1234 5678', 'Administración', 'Super Administrador'),
('2', 'taller@litio.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Taller', 'admin', 'active', '+56 9 2345 6789', 'Taller', 'Jefe de Taller'),
('3', 'user@litio.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Usuario Demo', 'colaborador', 'active', '+56 9 3456 7890', 'Ventas', 'Vendedor');

-- Nota: Las contraseñas hasheadas corresponden a:
-- admin123, taller123, user123

-- Insertar servicios por defecto
INSERT INTO services (name, description, category, price, duration, active) VALUES
('Cambio de Aceite', 'Cambio de aceite y filtro de motor', 'Mantenimiento', 25000.00, 30, TRUE),
('Alineación', 'Alineación de ruedas delanteras', 'Neumáticos', 15000.00, 45, TRUE),
('Balanceado', 'Balanceado de las 4 ruedas', 'Neumáticos', 12000.00, 30, TRUE),
('Revisión General', 'Revisión completa del vehículo', 'Diagnóstico', 35000.00, 120, TRUE),
('Cambio de Pastillas', 'Cambio de pastillas de freno', 'Frenos', 45000.00, 60, TRUE),
('Instalación Panel Solar', 'Instalación de panel solar en vehículo', 'Energía Solar', 150000.00, 240, TRUE),
('Mantenimiento Sistema Solar', 'Mantenimiento de sistema de energía solar', 'Energía Solar', 25000.00, 90, TRUE);

-- Insertar productos de inventario
INSERT INTO inventory (name, description, category, price, stock, min_stock, supplier, sku) VALUES
('Aceite Motor 5W-30', 'Aceite sintético para motor 5W-30', 'Lubricantes', 8500.00, 50, 10, 'Shell', 'ACE-5W30-001'),
('Filtro de Aceite', 'Filtro de aceite universal', 'Filtros', 3500.00, 30, 5, 'Mann Filter', 'FIL-ACE-001'),
('Pastillas de Freno Delanteras', 'Pastillas de freno para ruedas delanteras', 'Frenos', 25000.00, 20, 5, 'Brembo', 'PAS-DEL-001'),
('Pastillas de Freno Traseras', 'Pastillas de freno para ruedas traseras', 'Frenos', 22000.00, 20, 5, 'Brembo', 'PAS-TRA-001'),
('Panel Solar 100W', 'Panel solar monocristalino 100W', 'Energía Solar', 85000.00, 15, 3, 'Canadian Solar', 'PAN-100W-001'),
('Batería Litio 12V 100Ah', 'Batería de litio para sistemas solares', 'Energía Solar', 120000.00, 10, 2, 'LiFePO4', 'BAT-LIT-001'),
('Inversor 1000W', 'Inversor de corriente 12V a 220V', 'Energía Solar', 65000.00, 8, 2, 'Victron Energy', 'INV-1000W-001'),
('Controlador de Carga MPPT', 'Controlador de carga solar MPPT 30A', 'Energía Solar', 45000.00, 12, 3, 'Victron Energy', 'CON-MPPT-001');

-- Insertar clientes de ejemplo
INSERT INTO clients (name, email, phone, address, city, state, rfc) VALUES
('Juan Pérez García', 'juan.perez@email.com', '+56 9 1111 1111', 'Av. Libertador 1234', 'Santiago', 'Región Metropolitana', 'PEGJ800101XXX'),
('María González López', 'maria.gonzalez@email.com', '+56 9 2222 2222', 'Calle Principal 567', 'Valparaíso', 'Valparaíso', 'GOLM750215XXX'),
('Carlos Rodríguez Silva', 'carlos.rodriguez@email.com', '+56 9 3333 3333', 'Pasaje Los Aromos 890', 'Concepción', 'Biobío', 'ROSC820330XXX'),
('Ana Martínez Torres', 'ana.martinez@email.com', '+56 9 4444 4444', 'Av. Central 456', 'La Serena', 'Coquimbo', 'MATA900512XXX'),
('Luis Fernández Morales', 'luis.fernandez@email.com', '+56 9 5555 5555', 'Calle Norte 123', 'Temuco', 'Araucanía', 'FEML770825XXX');

-- Insertar vehículos de ejemplo
INSERT INTO vehicles (client_id, brand, model, year, plates, vin, color, mileage) VALUES
((SELECT id FROM clients WHERE email = 'juan.perez@email.com'), 'Toyota', 'Corolla', 2020, 'ABCD12', '1HGBH41JXMN109186', 'Blanco', 45000),
((SELECT id FROM clients WHERE email = 'maria.gonzalez@email.com'), 'Nissan', 'Sentra', 2019, 'EFGH34', '2HGBH41JXMN109187', 'Gris', 62000),
((SELECT id FROM clients WHERE email = 'carlos.rodriguez@email.com'), 'Chevrolet', 'Spark', 2021, 'IJKL56', '3HGBH41JXMN109188', 'Rojo', 28000),
((SELECT id FROM clients WHERE email = 'ana.martinez@email.com'), 'Hyundai', 'Accent', 2018, 'MNOP78', '4HGBH41JXMN109189', 'Azul', 78000),
((SELECT id FROM clients WHERE email = 'luis.fernandez@email.com'), 'Kia', 'Rio', 2022, 'QRST90', '5HGBH41JXMN109190', 'Negro', 15000);

-- Insertar configuraciones del sistema
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('company_name', 'Litio Service', 'Nombre de la empresa'),
('company_address', 'Av. Principal 123, Santiago, Chile', 'Dirección de la empresa'),
('company_phone', '+56 2 2345 6789', 'Teléfono de la empresa'),
('company_email', 'contacto@litioservice.cl', 'Email de contacto'),
('tax_rate', '19', 'Tasa de IVA en porcentaje'),
('currency', 'CLP', 'Moneda del sistema'),
('invoice_prefix', 'FAC-', 'Prefijo para números de factura'),
('workshop_order_prefix', 'OT-', 'Prefijo para órdenes de taller'),
('backup_frequency', 'daily', 'Frecuencia de respaldos automáticos'),
('notification_email', 'admin@litio.com', 'Email para notificaciones del sistema');

-- Insertar algunas órdenes de taller de ejemplo
INSERT INTO workshop_orders (order_number, client_id, client_name, vehicle_id, vehicle_info, description, status, priority, estimated_cost) VALUES
('OT-2024-001', 
 (SELECT id FROM clients WHERE email = 'juan.perez@email.com'), 
 'Juan Pérez García',
 (SELECT id FROM vehicles WHERE plates = 'ABCD12'),
 'Toyota Corolla 2020 - ABCD12',
 'Cambio de aceite y revisión general',
 'pending',
 'medium',
 40000.00),
('OT-2024-002',
 (SELECT id FROM clients WHERE email = 'maria.gonzalez@email.com'),
 'María González López', 
 (SELECT id FROM vehicles WHERE plates = 'EFGH34'),
 'Nissan Sentra 2019 - EFGH34',
 'Instalación de sistema de energía solar',
 'in_progress',
 'high',
 200000.00);

-- Insertar algunos registros de asistencia
INSERT INTO attendance (user_id, date, check_in, check_out, hours_worked, status) VALUES
('2', CURDATE(), '08:00:00', '17:00:00', 8.00, 'present'),
('3', CURDATE(), '08:30:00', '17:30:00', 8.00, 'late'),
('2', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '08:00:00', '17:00:00', 8.00, 'present'),
('3', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '08:00:00', '17:00:00', 8.00, 'present');

-- Insertar algunas notificaciones
INSERT INTO notifications (user_id, title, message, type) VALUES
('1', 'Bienvenido al Sistema', 'Bienvenido al sistema ERP de Litio Service', 'info'),
('2', 'Nueva Orden de Taller', 'Se ha asignado una nueva orden de taller OT-2024-002', 'info'),
('1', 'Stock Bajo', 'El producto "Panel Solar 100W" tiene stock bajo', 'warning');
