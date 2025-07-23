-- Agregar más usuarios de prueba
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('carlos.tech@litioservice.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Carlos Rodríguez', 'colaborador'),
('ana.admin@litioservice.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Ana Martínez', 'admin'),
('luis.tech@litioservice.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Luis González', 'colaborador'),
('sofia.manager@litioservice.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Sofía Herrera', 'admin');

-- Agregar más clientes
INSERT INTO clients (name, email, phone, address, document_number) VALUES 
('Transportes Rápidos SA', 'contacto@transportesrapidos.com', '+1234567893', 'Zona Industrial 123', '20123456789'),
('Taxi Verde Ltda', 'admin@taxiverde.com', '+1234567894', 'Centro Comercial 456', '20987654321'),
('Distribuidora El Sol', 'ventas@elsol.com', '+1234567895', 'Mercado Central 789', '20456789123'),
('Servicios Urbanos', 'info@serviciosurbanos.com', '+1234567896', 'Av. Principal 321', '20789123456'),
('Cooperativa San Juan', 'coop@sanjuan.com', '+1234567897', 'Barrio San Juan 654', '20321654987'),
('Empresa Logística Norte', 'logistica@norte.com', '+1234567898', 'Parque Industrial Norte', '20654987321');

-- Agregar más productos
INSERT INTO products (name, description, category, sku, stock_quantity, min_stock, unit_price) VALUES 
('Batería AGM 12V 75Ah', 'Batería AGM para uso marino y solar', 'Baterías', 'BAT-AGM-12V-75', 12, 3, 189.99),
('Batería Gel 12V 200Ah', 'Batería de gel para sistemas solares', 'Baterías', 'BAT-GEL-12V-200', 8, 2, 459.99),
('Cargador Solar MPPT 40A', 'Controlador de carga solar', 'Cargadores', 'CHAR-MPPT-40A', 6, 2, 129.99),
('Inversor 12V 1000W', 'Inversor de corriente pura', 'Inversores', 'INV-12V-1000W', 4, 1, 199.99),
('Cable 4AWG Rojo', 'Cable de batería calibre 4', 'Cables', 'CAB-4AWG-ROJO', 25, 5, 12.99),
('Cable 4AWG Negro', 'Cable de batería calibre 4', 'Cables', 'CAB-4AWG-NEGRO', 25, 5, 12.99),
('Terminal Positivo', 'Terminal para batería positivo', 'Accesorios', 'TERM-POS-001', 50, 10, 3.99),
('Terminal Negativo', 'Terminal para batería negativo', 'Accesorios', 'TERM-NEG-001', 50, 10, 3.99),
('Fusible 100A', 'Fusible para protección de circuitos', 'Protección', 'FUS-100A-001', 30, 8, 8.99),
('Voltímetro Digital', 'Medidor de voltaje digital', 'Herramientas', 'VOLT-DIG-001', 10, 3, 25.99);

-- Agregar servicios de prueba
INSERT INTO services (client_id, service_number, device_type, device_model, problem_description, diagnosis, status, estimated_cost, final_cost, assigned_to) 
SELECT 
    c.id,
    'SRV-' || LPAD((ROW_NUMBER() OVER() + 1)::text, 4, '0'),
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'Batería Automotriz'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'Batería Marina'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'Sistema Solar'
        ELSE 'UPS Industrial'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'Toyota Corolla 2018'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'Lancha Yamaha 25HP'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'Panel Solar 300W'
        ELSE 'APC Smart-UPS 1500VA'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 5 = 1 THEN 'No enciende el vehículo, batería descargada'
        WHEN ROW_NUMBER() OVER() % 5 = 2 THEN 'Batería se descarga rápidamente'
        WHEN ROW_NUMBER() OVER() % 5 = 3 THEN 'Sistema no carga correctamente'
        WHEN ROW_NUMBER() OVER() % 5 = 4 THEN 'UPS no mantiene carga'
        ELSE 'Revisión preventiva solicitada'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'Celdas sulfatadas, requiere recondicionamiento'
        WHEN ROW_NUMBER() OVER() % 3 = 2 THEN 'Conexiones corroídas, limpieza necesaria'
        ELSE 'Batería en buen estado, mantenimiento preventivo'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'completed'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'in_progress'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'received'
        ELSE 'delivered'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 120.00
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 85.00
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 200.00
        ELSE 150.00
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 115.00
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 90.00
        ELSE NULL
    END,
    u.id
FROM clients c, users u 
WHERE u.role = 'colaborador'
LIMIT 10;

-- Agregar registros de asistencia
INSERT INTO attendance (user_id, date, check_in_time, check_out_time, total_hours, status) 
SELECT 
    u.id,
    CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 6),
    '08:00:00'::time + (RANDOM() * INTERVAL '30 minutes'),
    '17:00:00'::time + (RANDOM() * INTERVAL '60 minutes'),
    8.0 + (RANDOM() * 2),
    CASE 
        WHEN RANDOM() > 0.9 THEN 'absent'
        WHEN RANDOM() > 0.8 THEN 'late'
        ELSE 'present'
    END
FROM users u 
WHERE u.role IN ('colaborador', 'admin');

-- Agregar facturas
INSERT INTO invoices (invoice_number, client_id, service_id, invoice_type, subtotal, tax_amount, total_amount, status, issue_date, due_date, created_by)
SELECT 
    'INV-' || LPAD((ROW_NUMBER() OVER())::text, 4, '0'),
    s.client_id,
    s.id,
    'service',
    s.final_cost,
    s.final_cost * 0.18,
    s.final_cost * 1.18,
    CASE 
        WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'paid'
        WHEN ROW_NUMBER() OVER() % 3 = 2 THEN 'pending'
        ELSE 'overdue'
    END,
    CURRENT_DATE - INTERVAL '1 day' * (ROW_NUMBER() OVER()),
    CURRENT_DATE + INTERVAL '30 days' - INTERVAL '1 day' * (ROW_NUMBER() OVER()),
    u.id
FROM services s, users u
WHERE s.final_cost IS NOT NULL AND u.role = 'admin'
LIMIT 8;

-- Agregar movimientos de inventario
INSERT INTO inventory_movements (product_id, movement_type, quantity, reference_type, notes, user_id)
SELECT 
    p.id,
    CASE 
        WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'entry'
        WHEN ROW_NUMBER() OVER() % 3 = 2 THEN 'exit'
        ELSE 'adjustment'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 3 = 1 THEN (RANDOM() * 10 + 1)::integer
        ELSE -(RANDOM() * 5 + 1)::integer
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'purchase'
        WHEN ROW_NUMBER() OVER() % 3 = 2 THEN 'service'
        ELSE 'adjustment'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'Compra a proveedor'
        WHEN ROW_NUMBER() OVER() % 3 = 2 THEN 'Usado en servicio'
        ELSE 'Ajuste de inventario'
    END,
    u.id
FROM products p, users u
WHERE u.role IN ('admin', 'colaborador')
LIMIT 15;
