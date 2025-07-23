"use client"

// Claves de almacenamiento
export const STORAGE_KEYS = {
  USERS: "litio_erp_users",
  INVENTORY: "litio_erp_inventory",
  SERVICES: "litio_erp_services",
  CLIENTS: "litio_erp_clients",
  INVOICES: "litio_erp_invoices",
  VEHICLES: "litio_erp_vehicles",
  ATTENDANCE: "litio_erp_attendance",
  WORKSHOP_ORDERS: "litio_erp_workshop_orders",
  SETTINGS: "litio_erp_settings",
  PASSWORDS: "litio_erp_passwords",
  CURRENT_USER: "litio_erp_current_user",
}

// Interfaces
export interface InventoryItem {
  id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  minStock: number
  supplier: string
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number
  duration: number
  active: boolean
  createdAt: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  rfc?: string
  createdAt: string
}

export interface Invoice {
  id: string
  clientId: string
  clientName: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue"
  createdAt: string
  dueDate: string
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  plates: string
  vin: string
  color: string
  clientId: string
  clientName: string
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  userId: string
  userName: string
  date: string
  checkIn: string
  checkOut?: string
  hours?: number
  status: "present" | "absent" | "late"
}

export interface WorkshopOrder {
  id: string
  vehicleId: string
  vehiclePlates: string
  clientId: string
  clientName: string
  services: string[]
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  assignedTo?: string
  estimatedCost: number
  actualCost?: number
  createdAt: string
  completedAt?: string
}

// Funciones genéricas de almacenamiento
export function getStorageData<T>(key: string): T[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading ${key}:`, error)
    return []
  }
}

export function setStorageData<T>(key: string, data: T[]): boolean {
  if (typeof window === "undefined") return false

  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Error saving ${key}:`, error)
    return false
  }
}

export function addStorageItem<T extends { id: string }>(key: string, item: Omit<T, "id">): T {
  const items = getStorageData<T>(key)
  const newItem = {
    ...item,
    id: Date.now().toString(),
  } as T

  items.push(newItem)
  setStorageData(key, items)

  return newItem
}

export function updateStorageItem<T extends { id: string }>(key: string, id: string, updates: Partial<T>): boolean {
  const items = getStorageData<T>(key)
  const index = items.findIndex((item) => item.id === id)

  if (index === -1) return false

  items[index] = { ...items[index], ...updates }
  return setStorageData(key, items)
}

export function deleteStorageItem(key: string, id: string): boolean {
  const items = getStorageData(key)
  const filteredItems = items.filter((item) => item.id !== id)

  return setStorageData(key, filteredItems)
}

// Funciones específicas para cada módulo
export const inventoryStorage = {
  getAll: () => getStorageData<InventoryItem>(STORAGE_KEYS.INVENTORY),
  add: (item: Omit<InventoryItem, "id">) => addStorageItem<InventoryItem>(STORAGE_KEYS.INVENTORY, item),
  update: (id: string, updates: Partial<InventoryItem>) =>
    updateStorageItem<InventoryItem>(STORAGE_KEYS.INVENTORY, id, updates),
  delete: (id: string) => deleteStorageItem(STORAGE_KEYS.INVENTORY, id),
}

export const servicesStorage = {
  getAll: () => getStorageData<Service>(STORAGE_KEYS.SERVICES),
  add: (service: Omit<Service, "id">) => addStorageItem<Service>(STORAGE_KEYS.SERVICES, service),
  update: (id: string, updates: Partial<Service>) => updateStorageItem<Service>(STORAGE_KEYS.SERVICES, id, updates),
  delete: (id: string) => deleteStorageItem(STORAGE_KEYS.SERVICES, id),
}

export const clientsStorage = {
  getAll: () => getStorageData<Client>(STORAGE_KEYS.CLIENTS),
  add: (client: Omit<Client, "id">) => addStorageItem<Client>(STORAGE_KEYS.CLIENTS, client),
  update: (id: string, updates: Partial<Client>) => updateStorageItem<Client>(STORAGE_KEYS.CLIENTS, id, updates),
  delete: (id: string) => deleteStorageItem(STORAGE_KEYS.CLIENTS, id),
}

export const invoicesStorage = {
  getAll: () => getStorageData<Invoice>(STORAGE_KEYS.INVOICES),
  add: (invoice: Omit<Invoice, "id">) => addStorageItem<Invoice>(STORAGE_KEYS.INVOICES, invoice),
  update: (id: string, updates: Partial<Invoice>) => updateStorageItem<Invoice>(STORAGE_KEYS.INVOICES, id, updates),
  delete: (id: string) => deleteStorageItem(STORAGE_KEYS.INVOICES, id),
}

export const vehiclesStorage = {
  getAll: () => getStorageData<Vehicle>(STORAGE_KEYS.VEHICLES),
  add: (vehicle: Omit<Vehicle, "id">) => addStorageItem<Vehicle>(STORAGE_KEYS.VEHICLES, vehicle),
  update: (id: string, updates: Partial<Vehicle>) => updateStorageItem<Vehicle>(STORAGE_KEYS.VEHICLES, id, updates),
  delete: (id: string) => deleteStorageItem(STORAGE_KEYS.VEHICLES, id),
}

export const attendanceStorage = {
  getAll: () => getStorageData<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE),
  add: (record: Omit<AttendanceRecord, "id">) => addStorageItem<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE, record),
  update: (id: string, updates: Partial<AttendanceRecord>) =>
    updateStorageItem<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE, id, updates),
  delete: (id: string) => deleteStorageItem(STORAGE_KEYS.ATTENDANCE, id),
}

export const workshopStorage = {
  getAll: () => getStorageData<WorkshopOrder>(STORAGE_KEYS.WORKSHOP_ORDERS),
  add: (order: Omit<WorkshopOrder, "id">) => addStorageItem<WorkshopOrder>(STORAGE_KEYS.WORKSHOP_ORDERS, order),
  update: (id: string, updates: Partial<WorkshopOrder>) =>
    updateStorageItem<WorkshopOrder>(STORAGE_KEYS.WORKSHOP_ORDERS, id, updates),
  delete: (id: string) => deleteStorageItem(STORAGE_KEYS.WORKSHOP_ORDERS, id),
}

// Función para exportar todos los datos
export function exportAllData() {
  const data = {
    users: getStorageData(STORAGE_KEYS.USERS),
    inventory: getStorageData(STORAGE_KEYS.INVENTORY),
    services: getStorageData(STORAGE_KEYS.SERVICES),
    clients: getStorageData(STORAGE_KEYS.CLIENTS),
    invoices: getStorageData(STORAGE_KEYS.INVOICES),
    vehicles: getStorageData(STORAGE_KEYS.VEHICLES),
    attendance: getStorageData(STORAGE_KEYS.ATTENDANCE),
    workshopOrders: getStorageData(STORAGE_KEYS.WORKSHOP_ORDERS),
    settings: getStorageData(STORAGE_KEYS.SETTINGS),
    exportDate: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `litio-erp-backup-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Función para importar datos
export function importData(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        // Importar cada módulo
        if (data.users) setStorageData(STORAGE_KEYS.USERS, data.users)
        if (data.inventory) setStorageData(STORAGE_KEYS.INVENTORY, data.inventory)
        if (data.services) setStorageData(STORAGE_KEYS.SERVICES, data.services)
        if (data.clients) setStorageData(STORAGE_KEYS.CLIENTS, data.clients)
        if (data.invoices) setStorageData(STORAGE_KEYS.INVOICES, data.invoices)
        if (data.vehicles) setStorageData(STORAGE_KEYS.VEHICLES, data.vehicles)
        if (data.attendance) setStorageData(STORAGE_KEYS.ATTENDANCE, data.attendance)
        if (data.workshopOrders) setStorageData(STORAGE_KEYS.WORKSHOP_ORDERS, data.workshopOrders)
        if (data.settings) setStorageData(STORAGE_KEYS.SETTINGS, data.settings)

        resolve(true)
      } catch (error) {
        console.error("Error importing data:", error)
        resolve(false)
      }
    }
    reader.readAsText(file)
  })
}

// Función para limpiar todos los datos
export function clearAllData(): boolean {
  if (typeof window === "undefined") return false

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
    return true
  } catch (error) {
    console.error("Error clearing data:", error)
    return false
  }
}

// Función para obtener estadísticas
export function getDataStats() {
  return {
    users: getStorageData(STORAGE_KEYS.USERS).length,
    inventory: getStorageData(STORAGE_KEYS.INVENTORY).length,
    services: getStorageData(STORAGE_KEYS.SERVICES).length,
    clients: getStorageData(STORAGE_KEYS.CLIENTS).length,
    invoices: getStorageData(STORAGE_KEYS.INVOICES).length,
    vehicles: getStorageData(STORAGE_KEYS.VEHICLES).length,
    attendance: getStorageData(STORAGE_KEYS.ATTENDANCE).length,
    workshopOrders: getStorageData(STORAGE_KEYS.WORKSHOP_ORDERS).length,
  }
}
