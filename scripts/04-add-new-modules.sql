-- Tabla de vehículos
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_plate VARCHAR(10) NOT NULL UNIQUE, -- Formato chileno AA-BB-99
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    vehicle_type VARCHAR(50) CHECK (vehicle_type IN ('camioneta', 'auto', 'furgon', 'moto')),
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'inactive')),
    mileage INTEGER DEFAULT 0,
    fuel_type VARCHAR(50) CHECK (fuel_type IN ('gasolina', 'diesel', 'electrico', 'hibrido')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de uso de vehículos
CREATE TABLE vehicle_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id),
    driver_id UUID REFERENCES users(id),
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP,
    start_mileage INTEGER,
    end_mileage INTEGER,
    destination VARCHAR(255),
    purpose VARCHAR(255),
    fuel_consumed DECIMAL(8,2),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de servicios de taller (más detallada)
CREATE TABLE workshop_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folio_id VARCHAR(50) UNIQUE NOT NULL,
    client_id UUID REFERENCES clients(id),
    device_type VARCHAR(100) NOT NULL,
    device_model VARCHAR(100),
    device_serial VARCHAR(100),
    problem_description TEXT NOT NULL,
    initial_diagnosis TEXT,
    final_diagnosis TEXT,
    assigned_technician_id UUID REFERENCES users(id),
    received_by_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'received' CHECK (status IN ('received', 'diagnosing', 'waiting_parts', 'in_repair', 'testing', 'completed', 'delivered', 'cancelled')),
    priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    estimated_completion_date DATE,
    actual_completion_date DATE,
    estimated_cost DECIMAL(10,2),
    final_cost DECIMAL(10,2),
    diagnosis_time_hours DECIMAL(5,2), -- Tiempo en diagnóstico
    repair_time_hours DECIMAL(5,2), -- Tiempo en reparación
    total_time_hours DECIMAL(5,2), -- Tiempo total en taller
    received_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnosis_start_date TIMESTAMP,
    diagnosis_end_date TIMESTAMP,
    repair_start_date TIMESTAMP,
    repair_end_date TIMESTAMP,
    delivery_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de imágenes de servicios de taller
CREATE TABLE workshop_service_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workshop_service_id UUID REFERENCES workshop_services(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_type VARCHAR(50) CHECK (image_type IN ('before', 'during', 'after', 'diagnostic')),
    description TEXT,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de notificaciones
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('info', 'warning', 'error', 'success', 'deadline', 'overdue')),
    reference_type VARCHAR(50), -- 'service', 'workshop_service', 'vehicle', etc.
    reference_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de chat interno
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id), -- NULL para mensajes grupales
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
    reference_type VARCHAR(50), -- 'service', 'workshop_service', etc.
    reference_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de participantes de chat grupal
CREATE TABLE chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID, -- Para identificar conversaciones grupales
    user_id UUID REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicle_usage_vehicle_id ON vehicle_usage(vehicle_id);
CREATE INDEX idx_vehicle_usage_driver_id ON vehicle_usage(driver_id);
CREATE INDEX idx_workshop_services_folio ON workshop_services(folio_id);
CREATE INDEX idx_workshop_services_client_id ON workshop_services(client_id);
CREATE INDEX idx_workshop_services_technician_id ON workshop_services(assigned_technician_id);
CREATE INDEX idx_workshop_services_status ON workshop_services(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_receiver_id ON chat_messages(receiver_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
