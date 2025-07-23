"use client"

import { useState, useEffect } from "react"
import { Bell, Check, X, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCurrentUser } from "@/lib/auth"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
  user_id?: string
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-600" />
    default:
      return <Info className="h-4 w-4 text-blue-600" />
  }
}

const getNotificationBgColor = (type: string) => {
  switch (type) {
    case "success":
      return "bg-green-50 border-green-200"
    case "warning":
      return "bg-yellow-50 border-yellow-200"
    case "error":
      return "bg-red-50 border-red-200"
    default:
      return "bg-blue-50 border-blue-200"
  }
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Ahora"
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
  if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const currentUser = getCurrentUser()

  const getMockNotifications = (): Notification[] => {
    const baseNotifications = [
      {
        id: "1",
        title: "Bienvenido a Intranet Litio Service",
        message: "Sistema de gestión integral para servicios de energía solar",
        type: "info" as const,
        read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Stock Bajo - Batería 12V",
        message: "Quedan solo 3 unidades de Batería Litio 12V 100Ah",
        type: "warning" as const,
        read: false,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        title: "Nueva Factura Generada",
        message: "Factura INV-000123 creada exitosamente por $450.000 CLP",
        type: "success" as const,
        read: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ]

    if (currentUser?.role === "super_admin") {
      baseNotifications.push({
        id: "4",
        title: "Backup Completado",
        message: "Respaldo automático del sistema completado exitosamente",
        type: "success" as const,
        read: false,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      })
    }

    if (currentUser?.role === "admin" || currentUser?.role === "super_admin") {
      baseNotifications.push({
        id: "5",
        title: "Nuevo Usuario Registrado",
        message: "Se ha registrado un nuevo colaborador en el sistema",
        type: "info" as const,
        read: true,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      })
    }

    return baseNotifications
  }

  const loadNotifications = async () => {
    setLoading(true)
    try {
      // Simular carga de notificaciones
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockNotifications = getMockNotifications()
      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Error loading notifications:", error)
      setNotifications(getMockNotifications())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [currentUser])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative hover:bg-blue-50">
        <Bell className="h-5 w-5 text-blue-600" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-blue-600">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg border-blue-200">
          <CardHeader className="pb-3 bg-blue-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-blue-900">Notificaciones</CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-blue-600 hover:bg-blue-100">
                    <Check className="h-4 w-4 mr-1" />
                    Marcar todas
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-blue-100">
                  <X className="h-4 w-4 text-blue-600" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-blue-600">Cargando notificaciones...</div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-gray-500">No hay notificaciones</div>
                </div>
              ) : (
                <div className="divide-y divide-blue-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-blue-50 transition-colors ${!notification.read ? "bg-blue-25" : ""}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-blue-900">{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-blue-500 mt-2">{formatTimeAgo(notification.created_at)}</p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 hover:bg-blue-100"
                                >
                                  <Check className="h-3 w-3 text-blue-600" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 hover:bg-red-100"
                              >
                                <X className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { NotificationCenter }
