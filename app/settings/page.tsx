"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  Shield,
  Database,
  Bell,
  Download,
  Upload,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { getCurrentUser, hasPermission } from "@/lib/auth"
import {
  getStorageData,
  setStorageData,
  clearAllData,
  exportAllData,
  importAllData,
  getStorageStats,
  STORAGE_KEYS,
} from "@/lib/storage"

interface SystemSettings {
  id: string
  company_name: string
  company_address: string
  company_phone: string
  company_email: string
  currency: string
  timezone: string
  language: string
  theme: string
  notifications_enabled: boolean
  email_notifications: boolean
  backup_enabled: boolean
  backup_frequency: string
  max_file_size: number
  session_timeout: number
  created_at: string
  updated_at: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const currentUser = getCurrentUser()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const storedSettings = getStorageData<SystemSettings>(STORAGE_KEYS.SETTINGS)

    if (storedSettings.length > 0) {
      setSettings(storedSettings[0])
    } else {
      // Crear configuración por defecto
      const defaultSettings: SystemSettings = {
        id: "1",
        company_name: "Litio Service SpA",
        company_address: "Av. Providencia 1234, Santiago, Chile",
        company_phone: "+56 2 2345 6789",
        company_email: "contacto@litioservice.cl",
        currency: "CLP",
        timezone: "America/Santiago",
        language: "es",
        theme: "light",
        notifications_enabled: true,
        email_notifications: true,
        backup_enabled: true,
        backup_frequency: "daily",
        max_file_size: 10,
        session_timeout: 60,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setStorageData(STORAGE_KEYS.SETTINGS, [defaultSettings])
      setSettings(defaultSettings)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return

    setLoading(true)
    try {
      const updatedSettings = {
        ...settings,
        updated_at: new Date().toISOString(),
      }

      setStorageData(STORAGE_KEYS.SETTINGS, [updatedSettings])
      setSettings(updatedSettings)

      setMessage({ type: "success", text: "Configuración guardada exitosamente" })

      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Error al guardar la configuración" })
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    try {
      const data = exportAllData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `litio-erp-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessage({ type: "success", text: "Datos exportados exitosamente" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Error al exportar los datos" })
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        importAllData(data)
        setMessage({ type: "success", text: "Datos importados exitosamente" })
        setTimeout(() => {
          setMessage(null)
          window.location.reload()
        }, 2000)
      } catch (error) {
        setMessage({ type: "error", text: "Error al importar los datos. Archivo inválido." })
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    clearAllData()
    setMessage({ type: "success", text: "Todos los datos han sido eliminados" })
    setTimeout(() => {
      window.location.href = "/login"
    }, 2000)
  }

  const storageStats = getStorageStats()

  if (!currentUser) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Debes iniciar sesión para acceder a la configuración.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configuración del Sistema</h1>
        <p className="text-gray-600">Administra la configuración general del sistema ERP</p>
      </div>

      {message && (
        <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="backup">Respaldo</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
              <CardDescription>Configura los datos básicos de tu empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Nombre de la Empresa</Label>
                  <Input
                    id="company_name"
                    value={settings.company_name}
                    onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="company_email">Email de Contacto</Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={settings.company_email}
                    onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company_address">Dirección</Label>
                <Textarea
                  id="company_address"
                  value={settings.company_address}
                  onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="company_phone">Teléfono</Label>
                  <Input
                    id="company_phone"
                    value={settings.company_phone}
                    onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Moneda</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => setSettings({ ...settings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Santiago">Hora de Santiago de Chile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>Administra las opciones de seguridad del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="session_timeout">Tiempo de Sesión (minutos)</Label>
                <Input
                  id="session_timeout"
                  type="number"
                  min="15"
                  max="480"
                  value={settings.session_timeout}
                  onChange={(e) => setSettings({ ...settings, session_timeout: Number.parseInt(e.target.value) || 60 })}
                />
                <p className="text-sm text-gray-500 mt-1">Tiempo después del cual la sesión expira automáticamente</p>
              </div>

              <div>
                <Label htmlFor="max_file_size">Tamaño Máximo de Archivo (MB)</Label>
                <Input
                  id="max_file_size"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.max_file_size}
                  onChange={(e) => setSettings({ ...settings, max_file_size: Number.parseInt(e.target.value) || 10 })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>Controla cómo y cuándo recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications_enabled">Notificaciones del Sistema</Label>
                  <p className="text-sm text-gray-500">Recibir notificaciones dentro del sistema</p>
                </div>
                <Switch
                  id="notifications_enabled"
                  checked={settings.notifications_enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications_enabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notifications">Notificaciones por Email</Label>
                  <p className="text-sm text-gray-500">Recibir notificaciones por correo electrónico</p>
                </div>
                <Switch
                  id="email_notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, email_notifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Respaldo de Datos
              </CardTitle>
              <CardDescription>Administra las copias de seguridad del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backup_enabled">Respaldo Automático</Label>
                  <p className="text-sm text-gray-500">Crear respaldos automáticos de los datos</p>
                </div>
                <Switch
                  id="backup_enabled"
                  checked={settings.backup_enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, backup_enabled: checked })}
                />
              </div>

              {settings.backup_enabled && (
                <div>
                  <Label htmlFor="backup_frequency">Frecuencia de Respaldo</Label>
                  <Select
                    value={settings.backup_frequency}
                    onValueChange={(value) => setSettings({ ...settings, backup_frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleExportData} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Datos
                </Button>

                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    style={{ display: "none" }}
                    id="import-file"
                  />
                  <Button onClick={() => document.getElementById("import-file")?.click()} variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Datos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Información del Sistema
              </CardTitle>
              <CardDescription>Estadísticas y administración del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(storageStats).map(([key, count]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{key.replace("_", " ")}</div>
                  </div>
                ))}
              </div>

              {hasPermission(currentUser.role, "super_admin") && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Zona de Peligro</h3>
                  <p className="text-sm text-gray-600 mb-4">Estas acciones son irreversibles. Úsalas con precaución.</p>

                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Todos los Datos
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>¿Estás seguro?</DialogTitle>
                        <DialogDescription>
                          Esta acción eliminará TODOS los datos del sistema de forma permanente. No se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleClearAllData}>
                          Sí, Eliminar Todo
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>
    </div>
  )
}
