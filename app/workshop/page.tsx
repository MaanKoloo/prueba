"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Wrench, Clock, User, Eye, Edit, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WorkOrder {
  id: string
  client_name: string
  service_name: string
  technician_name: string
  status: string
  priority: string
  created_at: string
  scheduled_date: string
  description: string
  estimated_hours: number
}

export default function WorkshopPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<WorkOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({
    client_name: "",
    service_name: "",
    technician_name: "",
    priority: "medium",
    scheduled_date: "",
    description: "",
    estimated_hours: 2,
  })

  // Mock data
  const getMockWorkOrders = (): WorkOrder[] => [
    {
      id: "1",
      client_name: "Juan Pérez",
      service_name: "Reparación de Batería de Auto",
      technician_name: "Carlos Mendoza",
      status: "in_progress",
      priority: "high",
      created_at: new Date().toISOString(),
      scheduled_date: new Date().toISOString(),
      description: "Batería de auto no mantiene carga, requiere diagnóstico completo",
      estimated_hours: 3,
    },
    {
      id: "2",
      client_name: "María González",
      service_name: "Mantención de UPS",
      technician_name: "Ana Silva",
      status: "pending",
      priority: "medium",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      scheduled_date: new Date(Date.now() + 86400000).toISOString(),
      description: "Mantención preventiva de sistema UPS empresarial",
      estimated_hours: 2,
    },
    {
      id: "3",
      client_name: "Empresa Solar Chile",
      service_name: "Instalación de Sistema Solar",
      technician_name: "Pedro Ramírez",
      status: "completed",
      priority: "high",
      created_at: new Date(Date.now() - 172800000).toISOString(),
      scheduled_date: new Date(Date.now() - 86400000).toISOString(),
      description: "Instalación completa de paneles solares en edificio comercial",
      estimated_hours: 8,
    },
    {
      id: "4",
      client_name: "Luis Torres",
      service_name: "Diagnóstico Eléctrico",
      technician_name: "Carlos Mendoza",
      status: "scheduled",
      priority: "low",
      created_at: new Date(Date.now() - 259200000).toISOString(),
      scheduled_date: new Date(Date.now() + 172800000).toISOString(),
      description: "Diagnóstico de sistema eléctrico residencial",
      estimated_hours: 1,
    },
  ]

  useEffect(() => {
    loadWorkOrders()
  }, [])

  useEffect(() => {
    let filtered = workOrders.filter(
      (order) =>
        order.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.technician_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [workOrders, searchTerm, statusFilter])

  const loadWorkOrders = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockOrders = getMockWorkOrders()
      setWorkOrders(mockOrders)
    } catch (error) {
      console.error("Error loading work orders:", error)
      setWorkOrders(getMockWorkOrders())
    }
  }

  const handleAddOrder = async () => {
    try {
      const newOrderData: WorkOrder = {
        id: Date.now().toString(),
        client_name: newOrder.client_name,
        service_name: newOrder.service_name,
        technician_name: newOrder.technician_name,
        status: "pending",
        priority: newOrder.priority,
        created_at: new Date().toISOString(),
        scheduled_date: newOrder.scheduled_date,
        description: newOrder.description,
        estimated_hours: newOrder.estimated_hours,
      }

      setWorkOrders((prev) => [newOrderData, ...prev])
      setIsAddDialogOpen(false)
      setNewOrder({
        client_name: "",
        service_name: "",
        technician_name: "",
        priority: "medium",
        scheduled_date: "",
        description: "",
        estimated_hours: 2,
      })
    } catch (error) {
      console.error("Error adding work order:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      scheduled: { label: "Programado", color: "bg-blue-100 text-blue-800" },
      in_progress: { label: "En Progreso", color: "bg-orange-100 text-orange-800" },
      completed: { label: "Completado", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status] || statusConfig.pending
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Baja", color: "bg-gray-100 text-gray-800" },
      medium: { label: "Media", color: "bg-blue-100 text-blue-800" },
      high: { label: "Alta", color: "bg-red-100 text-red-800" },
    }

    const config = priorityConfig[priority] || priorityConfig.medium
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getWorkshopStats = () => {
    return {
      total: workOrders.length,
      pending: workOrders.filter((o) => o.status === "pending").length,
      in_progress: workOrders.filter((o) => o.status === "in_progress").length,
      completed: workOrders.filter((o) => o.status === "completed").length,
    }
  }

  const stats = getWorkshopStats()

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Taller de Servicio</h1>
          <p className="text-blue-600">Gestión de órdenes de trabajo y servicios técnicos</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Orden
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-blue-900">Crear Nueva Orden de Trabajo</DialogTitle>
              <DialogDescription>Registra una nueva orden de servicio</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client_name">Cliente</Label>
                <Input
                  id="client_name"
                  value={newOrder.client_name}
                  onChange={(e) => setNewOrder({ ...newOrder, client_name: e.target.value })}
                  placeholder="Nombre del cliente"
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="service_name">Servicio</Label>
                <Input
                  id="service_name"
                  value={newOrder.service_name}
                  onChange={(e) => setNewOrder({ ...newOrder, service_name: e.target.value })}
                  placeholder="Tipo de servicio"
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="technician_name">Técnico Asignado</Label>
                <Input
                  id="technician_name"
                  value={newOrder.technician_name}
                  onChange={(e) => setNewOrder({ ...newOrder, technician_name: e.target.value })}
                  placeholder="Nombre del técnico"
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={newOrder.priority}
                    onValueChange={(value) => setNewOrder({ ...newOrder, priority: value })}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="estimated_hours">Horas Estimadas</Label>
                  <Input
                    id="estimated_hours"
                    type="number"
                    value={newOrder.estimated_hours}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, estimated_hours: Number.parseInt(e.target.value) || 0 })
                    }
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="scheduled_date">Fecha Programada</Label>
                <Input
                  id="scheduled_date"
                  type="datetime-local"
                  value={newOrder.scheduled_date}
                  onChange={(e) => setNewOrder({ ...newOrder, scheduled_date: e.target.value })}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newOrder.description}
                  onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                  placeholder="Describe el trabajo a realizar..."
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddOrder} className="bg-blue-600 hover:bg-blue-700">
                  Crear Orden
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Órdenes</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600">En el sistema</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-blue-600">Por asignar</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">En Progreso</CardTitle>
            <User className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.in_progress}</div>
            <p className="text-xs text-blue-600">En ejecución</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-blue-600">Finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Table */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Órdenes de Trabajo</CardTitle>
          <CardDescription className="text-blue-600">Gestiona todas las órdenes de servicio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Buscar órdenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-blue-200 focus:border-blue-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="scheduled">Programado</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-blue-900">Cliente</TableHead>
                <TableHead className="text-blue-900">Servicio</TableHead>
                <TableHead className="text-blue-900">Técnico</TableHead>
                <TableHead className="text-blue-900">Estado</TableHead>
                <TableHead className="text-blue-900">Prioridad</TableHead>
                <TableHead className="text-blue-900">Fecha</TableHead>
                <TableHead className="text-blue-900">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-blue-900">{order.client_name}</TableCell>
                  <TableCell className="text-blue-900">{order.service_name}</TableCell>
                  <TableCell className="text-blue-900">{order.technician_name}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell className="text-sm text-blue-700">
                    {new Date(order.scheduled_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsViewDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Work Order Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Detalles de la Orden de Trabajo</DialogTitle>
            <DialogDescription>Orden #{selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <p className="text-sm font-medium text-blue-900">{selectedOrder.client_name}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Servicio</Label>
                  <p className="text-sm text-blue-900">{selectedOrder.service_name}</p>
                </div>
                <div>
                  <Label>Técnico Asignado</Label>
                  <p className="text-sm text-blue-900">{selectedOrder.technician_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prioridad</Label>
                  <div className="mt-1">{getPriorityBadge(selectedOrder.priority)}</div>
                </div>
                <div>
                  <Label>Horas Estimadas</Label>
                  <p className="text-sm text-blue-900">{selectedOrder.estimated_hours} horas</p>
                </div>
              </div>
              <div>
                <Label>Fecha Programada</Label>
                <p className="text-sm text-blue-700">{new Date(selectedOrder.scheduled_date).toLocaleString()}</p>
              </div>
              <div>
                <Label>Descripción</Label>
                <p className="text-sm mt-1 p-2 bg-blue-50 rounded text-blue-900">{selectedOrder.description}</p>
              </div>
              <div>
                <Label>Fecha de Creación</Label>
                <p className="text-sm text-blue-700">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
