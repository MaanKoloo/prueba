"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Wrench, Clock, DollarSign, Eye, Edit } from "lucide-react"
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

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  duration_minutes: number
  is_active: boolean
  created_at: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: 0,
    category: "reparacion",
    duration_minutes: 60,
  })

  // Mock data
  const getMockServices = (): Service[] => [
    {
      id: "1",
      name: "Reparación de Batería de Auto",
      description: "Diagnóstico y reparación completa de baterías de automóviles",
      price: 25000,
      category: "reparacion",
      duration_minutes: 120,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Mantención de UPS",
      description: "Servicio de mantención preventiva para sistemas UPS",
      price: 35000,
      category: "mantencion",
      duration_minutes: 90,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Instalación de Sistema Solar",
      description: "Instalación completa de paneles solares residenciales",
      price: 150000,
      category: "instalacion",
      duration_minutes: 480,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Diagnóstico Eléctrico",
      description: "Diagnóstico completo de sistemas eléctricos",
      price: 15000,
      category: "diagnostico",
      duration_minutes: 60,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Reparación de Inversor",
      description: "Reparación y calibración de inversores de corriente",
      price: 45000,
      category: "reparacion",
      duration_minutes: 180,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ]

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    let filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (categoryFilter !== "all") {
      filtered = filtered.filter((service) => service.category === categoryFilter)
    }

    setFilteredServices(filtered)
  }, [services, searchTerm, categoryFilter])

  const loadServices = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockServices = getMockServices()
      setServices(mockServices)
    } catch (error) {
      console.error("Error loading services:", error)
      setServices(getMockServices())
    }
  }

  const handleAddService = async () => {
    try {
      const newServiceData: Service = {
        id: Date.now().toString(),
        name: newService.name,
        description: newService.description,
        price: newService.price,
        category: newService.category,
        duration_minutes: newService.duration_minutes,
        is_active: true,
        created_at: new Date().toISOString(),
      }

      setServices((prev) => [newServiceData, ...prev])
      setIsAddDialogOpen(false)
      setNewService({
        name: "",
        description: "",
        price: 0,
        category: "reparacion",
        duration_minutes: 60,
      })
    } catch (error) {
      console.error("Error adding service:", error)
    }
  }

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      reparacion: { label: "Reparación", color: "bg-red-100 text-red-800" },
      mantencion: { label: "Mantención", color: "bg-blue-100 text-blue-800" },
      instalacion: { label: "Instalación", color: "bg-green-100 text-green-800" },
      diagnostico: { label: "Diagnóstico", color: "bg-yellow-100 text-yellow-800" },
    }

    const config = categoryConfig[category] || categoryConfig.reparacion
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getServiceStats = () => {
    return {
      total: services.length,
      active: services.filter((s) => s.is_active).length,
      avgPrice: services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length) : 0,
      totalRevenue: services.reduce((sum, s) => sum + s.price, 0),
    }
  }

  const stats = getServiceStats()

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Gestión de Servicios</h1>
          <p className="text-blue-600">Administra los servicios ofrecidos por la empresa</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-blue-900">Agregar Nuevo Servicio</DialogTitle>
              <DialogDescription>Registra un nuevo servicio en el catálogo</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Servicio</Label>
                <Input
                  id="name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="Ej: Reparación de Batería"
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Describe el servicio en detalle..."
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio (CLP)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: Number.parseInt(e.target.value) || 0 })}
                    placeholder="25000"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duración (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newService.duration_minutes}
                    onChange={(e) =>
                      setNewService({ ...newService, duration_minutes: Number.parseInt(e.target.value) || 0 })
                    }
                    placeholder="60"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={newService.category}
                  onValueChange={(value) => setNewService({ ...newService, category: value })}
                >
                  <SelectTrigger className="border-blue-200 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reparacion">Reparación</SelectItem>
                    <SelectItem value="mantencion">Mantención</SelectItem>
                    <SelectItem value="instalacion">Instalación</SelectItem>
                    <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddService} className="bg-blue-600 hover:bg-blue-700">
                  Agregar Servicio
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
            <CardTitle className="text-sm font-medium text-blue-600">Total Servicios</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600">En el catálogo</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Servicios Activos</CardTitle>
            <Wrench className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-blue-600">Disponibles</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Precio Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${stats.avgPrice.toLocaleString()}</div>
            <p className="text-xs text-blue-600">CLP promedio</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-blue-600">Valor del catálogo</p>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Catálogo de Servicios</CardTitle>
          <CardDescription className="text-blue-600">Gestiona todos los servicios disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-blue-200 focus:border-blue-500"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="reparacion">Reparación</SelectItem>
                <SelectItem value="mantencion">Mantención</SelectItem>
                <SelectItem value="instalacion">Instalación</SelectItem>
                <SelectItem value="diagnostico">Diagnóstico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-blue-900">Servicio</TableHead>
                <TableHead className="text-blue-900">Categoría</TableHead>
                <TableHead className="text-blue-900">Precio</TableHead>
                <TableHead className="text-blue-900">Duración</TableHead>
                <TableHead className="text-blue-900">Estado</TableHead>
                <TableHead className="text-blue-900">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-blue-900">{service.name}</div>
                      <div className="text-sm text-blue-600">{service.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(service.category)}</TableCell>
                  <TableCell className="font-medium text-blue-900">${service.price.toLocaleString()}</TableCell>
                  <TableCell className="text-blue-900">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      {service.duration_minutes} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={service.is_active ? "default" : "secondary"}
                      className={service.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {service.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedService(service)
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

      {/* Service Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Detalles del Servicio</DialogTitle>
            <DialogDescription>{selectedService?.name}</DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div>
                <Label>Nombre del Servicio</Label>
                <p className="text-sm font-medium text-blue-900">{selectedService.name}</p>
              </div>
              <div>
                <Label>Descripción</Label>
                <p className="text-sm mt-1 p-2 bg-blue-50 rounded text-blue-900">{selectedService.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoría</Label>
                  <div className="mt-1">{getCategoryBadge(selectedService.category)}</div>
                </div>
                <div>
                  <Label>Estado</Label>
                  <div className="mt-1">
                    <Badge variant={selectedService.is_active ? "default" : "secondary"}>
                      {selectedService.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Precio</Label>
                  <p className="text-sm font-medium text-blue-900">${selectedService.price.toLocaleString()} CLP</p>
                </div>
                <div>
                  <Label>Duración Estimada</Label>
                  <p className="text-sm text-blue-900">{selectedService.duration_minutes} minutos</p>
                </div>
              </div>
              <div>
                <Label>Fecha de Creación</Label>
                <p className="text-sm text-blue-700">{new Date(selectedService.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
