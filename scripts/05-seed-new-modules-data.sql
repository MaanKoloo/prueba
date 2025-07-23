-- Insertar vehículos de prueba
INSERT INTO vehicles (license_plate, brand, model, year, vehicle_type, status, mileage, fuel_type, notes) VALUES 
('AB-CD-12', 'Toyota', 'Hilux', 2020, 'camioneta', 'available', 45000, 'diesel', 'Vehículo principal para servicios'),
('EF-GH-34', 'Chevrolet', 'Spark', 2019, 'auto', 'available', 32000, 'gasolina', 'Para servicios urbanos'),
('IJ-KL-56', 'Ford', 'Transit', 2021, 'furgon', 'available', 28000, 'diesel', 'Transporte de equipos pesados'),
('MN-OP-78', 'Honda', 'CB600F', 2018, 'moto', 'maintenance', 15000, 'gasolina', 'Para servicios rápidos'),
('QR-ST-90', 'Nissan', 'NV200', 2020, 'furgon', 'available', 38000, 'gasolina', 'Vehículo de reparto');

-- Insertar uso de vehículos
INSERT INTO vehicle_usage (vehicle_id, driver_id, start_datetime, end_datetime, start_mileage, end_mileage, destination, purpose, fuel_consumed, status) 
SELECT 
    v.id,
    u.id,
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    CURRENT_TIMESTAMP - INTERVAL '30 minutes',
    v.mileage - 50,
    v.mileage,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'Centro de Lima'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'San Isidro'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'Miraflores'
        ELSE 'Callao'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'Entrega de batería reparada'
        WHEN ROW_NUMBER() OVER() % 3 = 2 THEN 'Recolección de equipo'
        ELSE 'Visita técnica'
    END,
    RANDOM() * 10 + 5,
    'completed'
FROM vehicles v, users u 
WHERE u.role IN ('colaborador', 'admin') AND v.status = 'available'
LIMIT 8;

-- Insertar servicios de taller
INSERT INTO workshop_services (
    folio_id, client_id, device_type, device_model, device_serial, problem_description, 
    initial_diagnosis, assigned_technician_id, received_by_id, status, priority, 
    estimated_completion_date, estimated_cost, diagnosis_time_hours, received_date
) 
SELECT 
    'WS-' || LPAD((ROW_NUMBER() OVER())::text, 4, '0'),
    c.id,
    CASE 
        WHEN ROW_NUMBER() OVER() % 5 = 1 THEN 'Batería Automotriz'
        WHEN ROW_NUMBER() OVER() % 5 = 2 THEN 'Batería Marina'
        WHEN ROW_NUMBER() OVER() % 5 = 3 THEN 'UPS Industrial'
        WHEN ROW_NUMBER() OVER() % 5 = 4 THEN 'Sistema Solar'
        ELSE 'Batería Moto'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 5 = 1 THEN 'Bosch S4 12V 75Ah'
        WHEN ROW_NUMBER() OVER() % 5 = 2 THEN 'Optima BlueTop D27M'
        WHEN ROW_NUMBER() OVER() % 5 = 3 THEN 'APC Smart-UPS 1500VA'
        WHEN ROW_NUMBER() OVER() % 5 = 4 THEN 'Tesla Powerwall 2'
        ELSE 'Yuasa YTX14-BS'
    END,
    'SN' || LPAD((ROW_NUMBER() OVER())::text, 8, '0'),
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'Batería no mantiene carga, se descarga rápidamente'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'No enciende, posible problema en celdas'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'Sobrecalentamiento durante la carga'
        ELSE 'Pérdida de capacidad, autonomía reducida'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'Celdas sulfatadas, requiere recondicionamiento'
        WHEN ROW_NUMBER() OVER() % 3 = 2 THEN 'Conexiones internas corroídas'
        ELSE 'Desgaste normal, evaluar reparación vs reemplazo'
    END,
    tech.id,
    recep.id,
    CASE 
        WHEN ROW_NUMBER() OVER() % 5 = 1 THEN 'received'
        WHEN ROW_NUMBER() OVER() % 5 = 2 THEN 'diagnosing'
        WHEN ROW_NUMBER() OVER() % 5 = 3 THEN 'in_repair'
        WHEN ROW_NUMBER() OVER() % 5 = 4 THEN 'testing'
        ELSE 'completed'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'normal'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'high'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'urgent'
        ELSE 'low'
    END,
    CURRENT_DATE + INTERVAL '3 days' + (ROW_NUMBER() OVER() * INTERVAL '1 day'),
    RANDOM() * 200 + 100,
    RANDOM() * 4 + 1,
    CURRENT_TIMESTAMP - INTERVAL '1 day' * (ROW_NUMBER() OVER())
FROM clients c, 
     users tech, 
     users recep
WHERE tech.role = 'colaborador' 
  AND recep.role IN ('admin', 'colaborador')
  AND tech.id != recep.id
LIMIT 12;

-- Insertar notificaciones de prueba
INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id) 
SELECT 
    u.id,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'Servicio próximo a vencer'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'Diagnóstico pendiente'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'Stock bajo en inventario'
        ELSE 'Nuevo servicio asignado'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'El servicio WS-0001 vence mañana. Revisar estado.'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'Servicio WS-0002 lleva 2 días sin diagnóstico.'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'Batería Litio 12V 100Ah tiene stock bajo (2 unidades).'
        ELSE 'Se te ha asignado un nuevo servicio de taller.'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN 'deadline'
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN 'warning'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN 'error'
        ELSE 'info'
    END,
    'workshop_service',
    ws.id
FROM users u, workshop_services ws
WHERE u.role IN ('colaborador', 'admin')
LIMIT 15;

-- Insertar mensajes de chat de prueba
INSERT INTO chat_messages (sender_id, receiver_id, message, reference_type, reference_id) 
SELECT 
    sender.id,
    receiver.id,
    CASE 
        WHEN ROW_NUMBER() OVER() % 5 = 1 THEN '¿Cómo va el diagnóstico del servicio WS-0001?'
        WHEN ROW_NUMBER() OVER() % 5 = 2 THEN 'Necesito que revises el estado de la batería marina'
        WHEN ROW_NUMBER() OVER() % 5 = 3 THEN 'El cliente pregunta por el tiempo estimado de entrega'
        WHEN ROW_NUMBER() OVER() % 5 = 4 THEN 'Ya terminé la reparación, listo para testing'
        ELSE 'Hay un problema con el equipo, necesito ayuda'
    END,
    'workshop_service',
    ws.id
FROM users sender, 
     users receiver, 
     workshop_services ws
WHERE sender.role IN ('admin', 'colaborador') 
  AND receiver.role IN ('admin', 'colaborador')
  AND sender.id != receiver.id
LIMIT 20;

-- Actualizar algunos servicios con tiempos de diagnóstico y reparación
UPDATE workshop_services 
SET 
    diagnosis_start_date = received_date + INTERVAL '2 hours',
    diagnosis_end_date = received_date + INTERVAL '1 day',
    diagnosis_time_hours = 6,
    repair_start_date = received_date + INTERVAL '1 day',
    repair_time_hours = 12,
    total_time_hours = 18
WHERE status IN ('in_repair', 'testing', 'completed');
