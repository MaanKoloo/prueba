// Configuración de base de datos MySQL para producción
const mysql = require("mysql2/promise")

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "litio_user",
  password: process.env.DB_PASSWORD || "litio_password_2024",
  database: process.env.DB_NAME || "litio_erp",
  port: process.env.DB_PORT || 3306,
  charset: "utf8mb4",
  timezone: "+00:00",
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Pool de conexiones
let pool

function createPool() {
  pool = mysql.createPool(dbConfig)

  pool.on("connection", (connection) => {
    console.log("Nueva conexión establecida como id " + connection.threadId)
  })

  pool.on("error", (err) => {
    console.error("Error en la base de datos:", err)
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      createPool()
    } else {
      throw err
    }
  })
}

// Inicializar pool
createPool()

// Función para ejecutar queries
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Error ejecutando query:", error)
    throw error
  }
}

// Función para transacciones
async function transaction(callback) {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// Funciones de utilidad para usuarios
const userQueries = {
  // Obtener todos los usuarios
  getAll: () => query('SELECT * FROM users WHERE status = "active" ORDER BY created_at DESC'),

  // Obtener usuario por email
  getByEmail: (email) => query('SELECT * FROM users WHERE email = ? AND status = "active"', [email]),

  // Obtener usuario por ID
  getById: (id) => query('SELECT * FROM users WHERE id = ? AND status = "active"', [id]),

  // Crear nuevo usuario
  create: (userData) => {
    const { email, password, name, role, phone, department, position } = userData
    return query(
      "INSERT INTO users (email, password, name, role, phone, department, position) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [email, password, name, role, phone, department, position],
    )
  },

  // Actualizar usuario
  update: (id, userData) => {
    const fields = Object.keys(userData)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(userData)
    return query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id])
  },

  // Eliminar usuario (soft delete)
  delete: (id) => query('UPDATE users SET status = "inactive" WHERE id = ?', [id]),

  // Actualizar último login
  updateLastLogin: (id) => query("UPDATE users SET last_login = NOW() WHERE id = ?", [id]),
}

// Funciones para inventario
const inventoryQueries = {
  getAll: () => query("SELECT * FROM inventory ORDER BY name"),
  getById: (id) => query("SELECT * FROM inventory WHERE id = ?", [id]),
  create: (data) => {
    const { name, description, category, price, stock, min_stock, supplier, sku, location } = data
    return query(
      "INSERT INTO inventory (name, description, category, price, stock, min_stock, supplier, sku, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, description, category, price, stock, min_stock, supplier, sku, location],
    )
  },
  update: (id, data) => {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(data)
    return query(`UPDATE inventory SET ${fields} WHERE id = ?`, [...values, id])
  },
  delete: (id) => query("DELETE FROM inventory WHERE id = ?", [id]),
  getLowStock: () => query("SELECT * FROM inventory WHERE stock <= min_stock"),
}

// Funciones para servicios
const serviceQueries = {
  getAll: () => query("SELECT * FROM services WHERE active = TRUE ORDER BY name"),
  getById: (id) => query("SELECT * FROM services WHERE id = ?", [id]),
  create: (data) => {
    const { name, description, category, price, duration } = data
    return query("INSERT INTO services (name, description, category, price, duration) VALUES (?, ?, ?, ?, ?)", [
      name,
      description,
      category,
      price,
      duration,
    ])
  },
  update: (id, data) => {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(data)
    return query(`UPDATE services SET ${fields} WHERE id = ?`, [...values, id])
  },
  delete: (id) => query("UPDATE services SET active = FALSE WHERE id = ?", [id]),
}

// Funciones para clientes
const clientQueries = {
  getAll: () => query("SELECT * FROM clients ORDER BY name"),
  getById: (id) => query("SELECT * FROM clients WHERE id = ?", [id]),
  create: (data) => {
    const { name, email, phone, address, city, state, postal_code, rfc } = data
    return query(
      "INSERT INTO clients (name, email, phone, address, city, state, postal_code, rfc) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, phone, address, city, state, postal_code, rfc],
    )
  },
  update: (id, data) => {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(data)
    return query(`UPDATE clients SET ${fields} WHERE id = ?`, [...values, id])
  },
  delete: (id) => query("DELETE FROM clients WHERE id = ?", [id]),
}

// Funciones para vehículos
const vehicleQueries = {
  getAll: () =>
    query(`
    SELECT v.*, c.name as client_name 
    FROM vehicles v 
    LEFT JOIN clients c ON v.client_id = c.id 
    ORDER BY v.created_at DESC
  `),
  getById: (id) =>
    query(
      `
    SELECT v.*, c.name as client_name 
    FROM vehicles v 
    LEFT JOIN clients c ON v.client_id = c.id 
    WHERE v.id = ?
  `,
      [id],
    ),
  getByClient: (clientId) => query("SELECT * FROM vehicles WHERE client_id = ?", [clientId]),
  create: (data) => {
    const { client_id, brand, model, year, plates, vin, color, engine, mileage } = data
    return query(
      "INSERT INTO vehicles (client_id, brand, model, year, plates, vin, color, engine, mileage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [client_id, brand, model, year, plates, vin, color, engine, mileage],
    )
  },
  update: (id, data) => {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(data)
    return query(`UPDATE vehicles SET ${fields} WHERE id = ?`, [...values, id])
  },
  delete: (id) => query("DELETE FROM vehicles WHERE id = ?", [id]),
}

// Funciones para órdenes de taller
const workshopQueries = {
  getAll: () =>
    query(`
    SELECT wo.*, c.name as client_name, v.brand, v.model, v.plates,
           u.name as assigned_user_name
    FROM workshop_orders wo
    LEFT JOIN clients c ON wo.client_id = c.id
    LEFT JOIN vehicles v ON wo.vehicle_id = v.id
    LEFT JOIN users u ON wo.assigned_to = u.id
    ORDER BY wo.created_at DESC
  `),
  getById: (id) =>
    query(
      `
    SELECT wo.*, c.name as client_name, v.brand, v.model, v.plates,
           u.name as assigned_user_name
    FROM workshop_orders wo
    LEFT JOIN clients c ON wo.client_id = c.id
    LEFT JOIN vehicles v ON wo.vehicle_id = v.id
    LEFT JOIN users u ON wo.assigned_to = u.id
    WHERE wo.id = ?
  `,
      [id],
    ),
  create: (data) => {
    const {
      order_number,
      client_id,
      client_name,
      vehicle_id,
      vehicle_info,
      description,
      status,
      priority,
      assigned_to,
      estimated_cost,
    } = data
    return query(
      "INSERT INTO workshop_orders (order_number, client_id, client_name, vehicle_id, vehicle_info, description, status, priority, assigned_to, estimated_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        order_number,
        client_id,
        client_name,
        vehicle_id,
        vehicle_info,
        description,
        status,
        priority,
        assigned_to,
        estimated_cost,
      ],
    )
  },
  update: (id, data) => {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(data)
    return query(`UPDATE workshop_orders SET ${fields} WHERE id = ?`, [...values, id])
  },
  delete: (id) => query("DELETE FROM workshop_orders WHERE id = ?", [id]),
}

// Funciones para asistencia
const attendanceQueries = {
  getAll: () =>
    query(`
    SELECT a.*, u.name as user_name 
    FROM attendance a 
    LEFT JOIN users u ON a.user_id = u.id 
    ORDER BY a.date DESC, a.check_in DESC
  `),
  getByUser: (userId) =>
    query(
      `
    SELECT a.*, u.name as user_name 
    FROM attendance a 
    LEFT JOIN users u ON a.user_id = u.id 
    WHERE a.user_id = ? 
    ORDER BY a.date DESC
  `,
      [userId],
    ),
  getByDate: (date) =>
    query(
      `
    SELECT a.*, u.name as user_name 
    FROM attendance a 
    LEFT JOIN users u ON a.user_id = u.id 
    WHERE a.date = ? 
    ORDER BY a.check_in
  `,
      [date],
    ),
  create: (data) => {
    const { user_id, date, check_in, check_out, hours_worked, status, notes } = data
    return query(
      "INSERT INTO attendance (user_id, date, check_in, check_out, hours_worked, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user_id, date, check_in, check_out, hours_worked, status, notes],
    )
  },
  update: (id, data) => {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(data)
    return query(`UPDATE attendance SET ${fields} WHERE id = ?`, [...values, id])
  },
  delete: (id) => query("DELETE FROM attendance WHERE id = ?", [id]),
}

module.exports = {
  query,
  transaction,
  userQueries,
  inventoryQueries,
  serviceQueries,
  clientQueries,
  vehicleQueries,
  workshopQueries,
  attendanceQueries,
}
