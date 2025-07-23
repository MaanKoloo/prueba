-- Insertar usuario super admin por defecto
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('admin@litioservice.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Administrador Principal', 'super_admin'),
('manager@litioservice.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Gerente General', 'admin'),
('tech@litioservice.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Técnico Principal', 'colaborador');

-- Insertar algunos clientes de ejemplo
INSERT INTO clients (name, email, phone, address, document_number) VALUES 
('Juan Pérez', 'juan.perez@email.com', '+1234567890', 'Calle Principal 123', '12345678'),
('María García', 'maria.garcia@email.com', '+1234567891', 'Avenida Central 456', '87654321'),
('Carlos López', 'carlos.lopez@email.com', '+1234567892', 'Plaza Mayor 789', '11223344');

-- Insertar productos de ejemplo
INSERT INTO products (name, description, category, sku, stock_quantity, min_stock, unit_price) VALUES 
('Batería Litio 12V 100Ah', 'Batería de litio para uso automotriz', 'Baterías', 'BAT-LI-12V-100', 15, 5, 299.99),
('Cargador Inteligente 12V', 'Cargador automático con protecciones', 'Cargadores', 'CHAR-INT-12V', 8, 3, 89.99),
('Kit Reparación Celdas', 'Kit completo para reparación de celdas', 'Herramientas', 'KIT-REP-CEL', 5, 2, 149.99),
('Multímetro Digital', 'Multímetro para diagnóstico', 'Herramientas', 'MULT-DIG-001', 3, 1, 45.99);

-- Insertar algunos servicios de ejemplo
INSERT INTO services (client_id, service_number, device_type, device_model, problem_description, status, estimated_cost, assigned_to) 
SELECT 
    c.id,
    'SRV-' || LPAD((ROW_NUMBER() OVER())::text, 4, '0'),
    'Batería Automotriz',
    'Modelo Genérico',
    'Batería no mantiene carga',
    'in_progress',
    150.00,
    u.id
FROM clients c, users u 
WHERE c.name = 'Juan Pérez' AND u.role = 'colaborador'
LIMIT 1;
