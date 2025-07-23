"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"
import { getCurrentUser, initializeUsers } from "@/lib/auth"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Inicializar usuarios por defecto
    initializeUsers()

    // Verificar autenticación
    const user = getCurrentUser()
    const authenticated = !!user

    setIsAuthenticated(authenticated)
    setIsLoading(false)

    // Redirigir si no está autenticado y no está en login
    if (!authenticated && pathname !== "/login") {
      router.push("/login")
    }

    // Redirigir si está autenticado y está en login
    if (authenticated && pathname === "/login") {
      router.push("/dashboard")
    }
  }, [pathname, router])

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Si no está autenticado y está en login, mostrar solo el contenido
  if (!isAuthenticated && pathname === "/login") {
    return <>{children}</>
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated) {
    return null
  }

  // Layout principal para usuarios autenticados
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
