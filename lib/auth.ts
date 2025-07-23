"use client"

export interface User {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "colaborador"
  status: "active" | "inactive"
  createdAt: string
  lastLogin?: string
  avatar?: string
  phone?: string
  department?: string
}

const STORAGE_KEY = "litio_erp_users"
const CURRENT_USER_KEY = "litio_erp_current_user"
const PASSWORDS_KEY = "litio_erp_passwords"

// Usuarios por defecto
const defaultUsers: User[] = [
  {
    id: "1",
    email: "admin@litio.com",
    name: "Administrador Principal",
    role: "super_admin",
    status: "active",
    createdAt: new Date().toISOString(),
    department: "Administración",
    phone: "+56 9 1234 5678",
  },
  {
    id: "2",
    email: "taller@litio.com",
    name: "Admin Taller",
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
    department: "Taller",
    phone: "+56 9 2345 6789",
  },
  {
    id: "3",
    email: "user@litio.com",
    name: "Usuario Demo",
    role: "colaborador",
    status: "active",
    createdAt: new Date().toISOString(),
    department: "Ventas",
    phone: "+56 9 3456 7890",
  },
]

// Contraseñas por defecto
const defaultPasswords: Record<string, string> = {
  "admin@litio.com": "admin123",
  "taller@litio.com": "taller123",
  "user@litio.com": "user123",
}

export function initializeUsers() {
  if (typeof window === "undefined") return

  const existingUsers = localStorage.getItem(STORAGE_KEY)
  const existingPasswords = localStorage.getItem(PASSWORDS_KEY)

  if (!existingUsers) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
    console.log("Usuarios inicializados:", defaultUsers.length)
  }

  if (!existingPasswords) {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(defaultPasswords))
    console.log("Contraseñas inicializadas")
  }
}

export function signIn(email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "No disponible en servidor" }
  }

  // Inicializar usuarios si no existen
  initializeUsers()

  try {
    const usersStr = localStorage.getItem(STORAGE_KEY)
    const passwordsStr = localStorage.getItem(PASSWORDS_KEY)

    if (!usersStr || !passwordsStr) {
      return { success: false, error: "Error al cargar datos del sistema" }
    }

    const users: User[] = JSON.parse(usersStr)
    const passwords: Record<string, string> = JSON.parse(passwordsStr)

    console.log("Intentando login para:", email)
    console.log(
      "Usuarios disponibles:",
      users.map((u) => u.email),
    )

    // Buscar usuario
    const user = users.find((u: User) => u.email === email)

    if (!user) {
      console.log("Usuario no encontrado")
      return { success: false, error: "Usuario no encontrado" }
    }

    if (user.status !== "active") {
      console.log("Usuario inactivo")
      return { success: false, error: "Usuario inactivo" }
    }

    // Verificar contraseña
    if (passwords[email] !== password) {
      console.log("Contraseña incorrecta")
      return { success: false, error: "Contraseña incorrecta" }
    }

    // Actualizar último login
    const updatedUser = { ...user, lastLogin: new Date().toISOString() }
    const updatedUsers = users.map((u: User) => (u.id === user.id ? updatedUser : u))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers))
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))

    console.log("Login exitoso para:", email)
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Error en signIn:", error)
    return { success: false, error: "Error interno del sistema" }
  }
}

export function signOut() {
  if (typeof window === "undefined") return
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const userStr = localStorage.getItem(CURRENT_USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function hasPermission(requiredRole: User["role"]): boolean {
  const user = getCurrentUser()
  if (!user) return false

  const roleHierarchy = {
    super_admin: 3,
    admin: 2,
    colaborador: 1,
  }

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

export function updateUserProfile(updates: Partial<User>): boolean {
  if (typeof window === "undefined") return false

  const currentUser = getCurrentUser()
  if (!currentUser) return false

  try {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    const updatedUser = { ...currentUser, ...updates }

    const updatedUsers = users.map((u: User) => (u.id === currentUser.id ? updatedUser : u))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers))
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))

    return true
  } catch (error) {
    console.error("Error updating profile:", error)
    return false
  }
}

export function changePassword(currentPassword: string, newPassword: string): boolean {
  if (typeof window === "undefined") return false

  const user = getCurrentUser()
  if (!user) return false

  try {
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}")

    if (passwords[user.email] !== currentPassword) {
      return false
    }

    passwords[user.email] = newPassword
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords))

    return true
  } catch (error) {
    console.error("Error changing password:", error)
    return false
  }
}

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []

  try {
    initializeUsers()
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

export function createUser(userData: Omit<User, "id" | "createdAt">, password: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const users = getAllUsers()
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}")

    // Verificar si el email ya existe
    if (users.some((u) => u.email === userData.email)) {
      return false
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    passwords[userData.email] = password

    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords))

    return true
  } catch (error) {
    console.error("Error creating user:", error)
    return false
  }
}

export function deleteUser(id: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const users = getAllUsers()
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}")

    const userToDelete = users.find((u) => u.id === id)
    if (!userToDelete) return false

    const filteredUsers = users.filter((u) => u.id !== id)
    delete passwords[userToDelete.email]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredUsers))
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords))

    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}

export function getUserById(id: string): User | null {
  const users = getAllUsers()
  return users.find((u) => u.id === id) || null
}

export function getUserByEmail(email: string): User | null {
  const users = getAllUsers()
  return users.find((u) => u.email === email) || null
}
