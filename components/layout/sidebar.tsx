"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Package, Wrench, Users, FileText, Car, Clock, Cog, BarChart3, X } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { getDataStats } from "@/lib/storage"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "admin", "colaborador"],
  },
  {
    name: "Inventario",
    href: "/inventory",
    icon: Package,
    roles: ["super_admin", "admin", "colaborador"],
    badge: "inventory",
  },
  {
    name: "Servicios",
    href: "/services",
    icon: Wrench,
    roles: ["super_admin", "admin", "colaborador"],
    badge: "services",
  },
  {
    name: "Clientes",
    href: "/users",
    icon: Users,
    roles: ["super_admin", "admin", "colaborador"],
    badge: "clients",
  },
  {
    name: "Facturas",
    href: "/invoices",
    icon: FileText,
    roles: ["super_admin", "admin", "colaborador"],
    badge: "invoices",
  },
  {
    name: "Vehículos",
    href: "/vehicles",
    icon: Car,
    roles: ["super_admin", "admin", "colaborador"],
    badge: "vehicles",
  },
  {
    name: "Taller",
    href: "/workshop",
    icon: Wrench,
    roles: ["super_admin", "admin"],
    badge: "workshopOrders",
  },
  {
    name: "Asistencia",
    href: "/attendance",
    icon: Clock,
    roles: ["super_admin", "admin"],
    badge: "attendance",
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: BarChart3,
    roles: ["super_admin", "admin"],
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: Cog,
    roles: ["super_admin", "admin"],
  },
]

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Actualizar estadísticas
    const updateStats = () => {
      const dataStats = getDataStats()
      setStats(dataStats)
    }

    updateStats()

    // Actualizar cada 30 segundos
    const interval = setInterval(updateStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const hasAccess = (roles: string[]) => {
    return user && roles.includes(user.role)
  }

  const getBadgeCount = (badgeKey: string) => {
    return stats[badgeKey] || 0
  }

  const filteredNavigation = navigation.filter((item) => hasAccess(item.roles))

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LS</span>
              </div>
              <span className="font-semibold text-gray-900">Litio Service</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{user?.name?.charAt(0) || "U"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "Usuario"}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || "colaborador"}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href
                const badgeCount = item.badge ? getBadgeCount(item.badge) : 0

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    )}
                    onClick={onClose}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {badgeCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {badgeCount}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Litio Service ERP v1.0</p>
              <p>© 2024 Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
