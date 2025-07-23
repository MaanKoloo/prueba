"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Car, MapPin, Clock, Fuel, Eye, Edit } from "lucide-react"
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

interface Vehicle {
  id: string
  license_plate: string
  brand: string
  model: string
  year: number
  vehicle_type: string
  status: string
  mileage: number
  fuel_type: string
  notes: string
}

interface VehicleUsage {
  id: string
  start_datetime: string
  end_datetime: string
  destination: string
  purpose: string
  status: string
  driver: {
    full_name: string
  }
  vehicle: {
    license_plate: string
    brand: string
    model: string
  }
}

interface User {
  id: string
  full_name: string
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehicleUsage, setVehicleUsage] = useState<VehicleUsage[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false)
  const [isAddUsageDialogOpen, setIsAddUsageDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    license_plate: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    vehicle_type: "auto",
    fuel_type: "gasolina",
    mileage: 0,
    notes: "",
  })
  const [newUsage, setNewUsage] = useState({
    vehicle_id: "",
    driver_id: "",
    destination: "",
    purpose: "",
    start_datetime: "",
  })

  // Mock data
  const getMockVehicles = (): Vehicle[] => [
    {
      id: "1",
      license_plate: "AB-CD-12",
      brand: "Toyota",
      model: "Hilux",
      year: 2022,
      vehicle_type: "camioneta",
      status: "available",
      mileage: 45000,
      fuel_type: "diesel",
      notes: "Vehículo para entregas y servicios técnicos",
    },
    {
      id: "2",
      license_plate: "EF-GH-34",
      brand: "Chevrolet",
      model: "Spark",
      year: 2021,
      vehicle_type: "auto",
      status: "in_use",
      mileage: 32000,
      fuel_type: "gasolina",
      notes: "Auto para gestiones administrativas",
    },
    {
      id: "3",
      license_plate: "IJ-KL-56",
      brand: "Ford",
      model: "Transit",
      year: 2020,
      vehicle_type: "furgon",
      status: "maintenance",
      mileage: 78000,
      fuel_type: "diesel",
      notes: "Furgón para transporte de equipos pesados",
    },
    {
      id: "4",
      license_plate: "MN-OP-78",
      brand: "Honda",
      model: "CB 150",
      year: 2023,
      vehicle_type: "moto",
      status: "available",
      mileage: 8500,
      fuel_type: "gasolina",
      notes: "Moto para entregas rápidas en la ciudad",
    },
  ]

  const getMockVehicleUsage = (): VehicleUsage[] => [
    {
      id: "1",
      start_datetime: new Date().toISOString(),
      end_datetime: "",
      destination: "Las Condes",
      purpose: "Entrega de batería reparada",
      status: "active",
      driver: { full_name: "Carlos Mendoza" },
      vehicle: { license_plate: "EF-GH-34", brand: "Chevrolet", model: "Spark" },
    },
    {
      id: "2",
      start_datetime: new Date(Date.now() - 86400000).toISOString(),
      end_datetime: new Date(Date.now() - 82800000).toISOString(),
      destination: "Providencia",
      purpose: "Servicio técnico a domicilio",
      status: "completed",
      driver: { full_name: "Ana Silva" },
      vehicle: { license_plate: "AB-CD-12", brand: "Toyota", model: "Hilux" },
    },
    {
      id: "3",
      start_datetime: new Date(Date.now() - 172800000).toISOString(),
      end_datetime: new Date(Date.now() - 169200000).toISOString(),
      destination: "Maipú",
      purpose: "Recolección de equipos",
      status: "completed",
      driver: { full_name: "Pedro Ramírez" },
      vehicle: { license_plate: "IJ-KL-56", brand: "Ford", model: "Transit" },
    },
  ]

  const getMockUsers = (): User[] => [
    { id: "1", full_name: "Carlos Mendoza" },
    { id: "2", full_name: "Ana Silva" },
    { id: "3", full_name: "Pedro Ramírez" },
    { id: "4", full_name: "Luis Torres" },
  ]

  useEffect(() => {
    loadVehicles()
    loadVehicleUsage()
    loadUsers()
  }, [])

  useEffect(() => {
    let filtered = vehicles.filter(
      (vehicle) =>
        vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.status === statusFilter)
    }

    setFilteredVehicles(filtered)
  }, [vehicles, searchTerm, statusFilter])

  const loadVehicles = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockVehicles = getMockVehicles()
      setVehicles(mockVehicles)
    } catch (error) {
      console.error("Error loading vehicles:", error)
      setVehicles(getMockVehicles())
    }
  }

  const loadVehicleUsage = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const mockUsage = getMockVehicleUsage()
      setVehicleUsage(mockUsage)
    } catch (error) {
      console.error("Error loading vehicle usage:", error)
      setVehicleUsage(getMockVehicleUsage())
    }
  }

  const loadUsers = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const mockUsers = getMockUsers()
      setUsers(mockUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      setUsers(getMockUsers())
    }
  }

  const validateChileanLicensePlate = (plate: string) => {
    const regex = /^[A-Z]{2}-[A-Z]{2}-\d{2}$/
    return regex.test(plate)
  }

  const handleAddVehicle = async () => {
    try {
      if (!validateChileanLicensePlate(newVehicle.license_plate)) {
        alert("Formato de patente inválido. Use formato chileno: AA-BB-99")
        return
      }

      const newVehicleData: Vehicle = {
        id: Date.now().toString(),
        license_plate: newVehicle.license_plate,
        brand: newVehicle.brand,
        model: newVehicle.model,
        year: newVehicle.year,
        vehicle_type: newVehicle.vehicle_type,
        status: "available",
        mileage: newVehicle.mileage,
        fuel_type: newVehicle.fuel_type,
        notes: newVehicle.notes,
      }

      setVehicles((prev) => [newVehicleData, ...prev])
      setIsAddVehicleDialogOpen(false)
      setNewVehicle({
        license_plate: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        vehicle_type: "auto",
        fuel_type: "gasolina",
        mileage: 0,
        notes: "",
      })
    } catch (error) {
      console.error("Error adding vehicle:", error)
    }
  }

  const handleAddUsage = async () => {
    try {
      const selectedVehicle = vehicles.find((v) => v.id === newUsage.vehicle_id)
      const selectedDriver = users.find((u) => u.id === newUsage.driver_id)

      const newUsageData: VehicleUsage = {
        id: Date.now().toString(),
        start_datetime: newUsage.start_datetime,
        end_datetime: "",
        destination: newUsage.destination,
        purpose: newUsage.purpose,
        status: "active",
        driver: { full_name: selectedDriver?.full_name || "Conductor" },
        vehicle: {
          license_plate: selectedVehicle?.license_plate || "",
          brand: selectedVehicle?.brand || "",
          model: selectedVehicle?.model || "",
        },
      }

      setVehicleUsage((prev) => [newUsageData, ...prev])

      // Actualizar estado del vehículo a "in_use"
      setVehicles((prev) =>
        prev.map((vehicle) => (vehicle.id === newUsage.vehicle_id ? { ...vehicle, status: "in_use" } : vehicle)),
      )

      setIsAddUsageDialogOpen(false)
      setNewUsage({
        vehicle_id: "",
        driver_id: "",
        destination: "",
        purpose: "",
        start_datetime: "",
      })
    } catch (error) {
      console.error("Error adding vehicle usage:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: "Disponible", variant: "default" as const, color: "bg-green-100 text-green-800" },
      in_use: { label: "En Uso", variant: "secondary" as const, color: "bg-blue-100 text-blue-800" },
      maintenance: { label: "Mantenimiento", variant: "outline" as const, color: "bg-yellow-100 text-yellow-800" },
      inactive: { label: "Inactivo", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status] || statusConfig.available
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getVehicleStats = () => {
    return {
      total: vehicles.length,
      available: vehicles.filter((v) => v.status === "available").length,
      in_use: vehicles.filter((v) => v.status === "in_use").length,
      maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    }
  }

  const stats = getVehicleStats()

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Gestión de Vehículos</h1>
          <p className="text-blue-600">Control de flota y uso de vehículos</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddUsageDialogOpen} onOpenChange={setIsAddUsageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">
                <MapPin className="h-4 w-4 mr-2" />
                Asignar Vehículo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-blue-900">Asignar Vehículo</DialogTitle>
                <DialogDescription>Registra el uso de un vehículo</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vehicle">Vehículo</Label>
                  <Select
                    value={newUsage.vehicle_id}
                    onValueChange={(value) => setNewUsage({ ...newUsage, vehicle_id: value })}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles
                        .filter((v) => v.status === "available")
                        .map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.license_plate} - {vehicle.brand} {vehicle.model}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="driver">Conductor</Label>
                  <Select
                    value={newUsage.driver_id}
                    onValueChange={(value) => setNewUsage({ ...newUsage, driver_id: value })}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Seleccionar conductor" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    value={newUsage.destination}
                    onChange={(e) => setNewUsage({ ...newUsage, destination: e.target.value })}
                    placeholder="Ej: Centro de Santiago"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Propósito</Label>
                  <Input
                    id="purpose"
                    value={newUsage.purpose}
                    onChange={(e) => setNewUsage({ ...newUsage, purpose: e.target.value })}
                    placeholder="Ej: Entrega de batería reparada"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="start_datetime">Fecha y Hora de Salida</Label>
                  <Input
                    id="start_datetime"
                    type="datetime-local"
                    value={newUsage.start_datetime}
                    onChange={(e) => setNewUsage({ ...newUsage, start_datetime: e.target.value })}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddUsageDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddUsage} className="bg-blue-600 hover:bg-blue-700">
                    Asignar Vehículo
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddVehicleDialogOpen} onOpenChange={setIsAddVehicleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Vehículo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-blue-900">Agregar Nuevo Vehículo</DialogTitle>
                <DialogDescription>Registra un nuevo vehículo en la flota</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="license_plate">Patente (Formato: AA-BB-99)</Label>
                  <Input
                    id="license_plate"
                    value={newVehicle.license_plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value.toUpperCase() })}
                    placeholder="AB-CD-12"
                    maxLength={8}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={newVehicle.brand}
                      onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                      placeholder="Toyota"
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      placeholder="Hilux"
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Año</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year: Number.parseInt(e.target.value) || 0 })}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Kilometraje</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={newVehicle.mileage}
                      onChange={(e) => setNewVehicle({ ...newVehicle, mileage: Number.parseInt(e.target.value) || 0 })}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicle_type">Tipo de Vehículo</Label>
                    <Select
                      value={newVehicle.vehicle_type}
                      onValueChange={(value) => setNewVehicle({ ...newVehicle, vehicle_type: value })}
                    >
                      <SelectTrigger className="border-blue-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="camioneta">Camioneta</SelectItem>
                        <SelectItem value="furgon">Furgón</SelectItem>
                        <SelectItem value="moto">Moto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fuel_type">Tipo de Combustible</Label>
                    <Select
                      value={newVehicle.fuel_type}
                      onValueChange={(value) => setNewVehicle({ ...newVehicle, fuel_type: value })}
                    >
                      <SelectTrigger className="border-blue-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gasolina">Gasolina</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electrico">Eléctrico</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    value={newVehicle.notes}
                    onChange={(e) => setNewVehicle({ ...newVehicle, notes: e.target.value })}
                    placeholder="Observaciones adicionales..."
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddVehicleDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddVehicle} className="bg-blue-600 hover:bg-blue-700">
                    Agregar Vehículo
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Vehículos</CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600">En la flota</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Disponibles</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-xs text-blue-600">Listos para usar</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">En Uso</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.in_use}</div>
            <p className="text-xs text-blue-600">Actualmente asignados</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Mantenimiento</CardTitle>
            <Fuel className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.maintenance}</div>
            <p className="text-xs text-blue-600">En reparación</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Flota de Vehículos</CardTitle>
          <CardDescription className="text-blue-600">Gestiona todos los vehículos de la empresa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Buscar vehículos..."
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
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="in_use">En Uso</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-blue-900">Patente</TableHead>
                <TableHead className="text-blue-900">Vehículo</TableHead>
                <TableHead className="text-blue-900">Tipo</TableHead>
                <TableHead className="text-blue-900">Combustible</TableHead>
                <TableHead className="text-blue-900">Kilometraje</TableHead>
                <TableHead className="text-blue-900">Estado</TableHead>
                <TableHead className="text-blue-900">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-mono font-bold text-blue-900">{vehicle.license_plate}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-blue-900">
                        {vehicle.brand} {vehicle.model}
                      </div>
                      <div className="text-sm text-blue-600">Año {vehicle.year}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {vehicle.vehicle_type === "auto"
                        ? "Auto"
                        : vehicle.vehicle_type === "camioneta"
                          ? "Camioneta"
                          : vehicle.vehicle_type === "furgon"
                            ? "Furgón"
                            : "Moto"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {vehicle.fuel_type === "gasolina"
                        ? "Gasolina"
                        : vehicle.fuel_type === "diesel"
                          ? "Diesel"
                          : vehicle.fuel_type === "electrico"
                            ? "Eléctrico"
                            : "Híbrido"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-blue-900">{vehicle.mileage.toLocaleString()} km</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedVehicle(vehicle)
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

      {/* Recent Usage */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Clock className="h-5 w-5" />
            Uso Reciente de Vehículos
          </CardTitle>
          <CardDescription className="text-blue-600">Últimos movimientos de la flota</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-blue-900">Vehículo</TableHead>
                <TableHead className="text-blue-900">Conductor</TableHead>
                <TableHead className="text-blue-900">Destino</TableHead>
                <TableHead className="text-blue-900">Propósito</TableHead>
                <TableHead className="text-blue-900">Fecha/Hora</TableHead>
                <TableHead className="text-blue-900">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleUsage.map((usage) => (
                <TableRow key={usage.id}>
                  <TableCell className="font-mono text-blue-900">
                    {usage.vehicle.license_plate} - {usage.vehicle.brand} {usage.vehicle.model}
                  </TableCell>
                  <TableCell className="text-blue-900">{usage.driver.full_name}</TableCell>
                  <TableCell className="text-blue-900">{usage.destination}</TableCell>
                  <TableCell className="text-blue-900">{usage.purpose}</TableCell>
                  <TableCell className="text-sm text-blue-700">
                    {new Date(usage.start_datetime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={usage.status === "completed" ? "default" : "secondary"}>
                      {usage.status === "completed" ? "Completado" : usage.status === "active" ? "Activo" : "Cancelado"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vehicle Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Detalles del Vehículo</DialogTitle>
            <DialogDescription>
              {selectedVehicle?.license_plate} - {selectedVehicle?.brand} {selectedVehicle?.model}
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patente</Label>
                  <p className="text-sm font-mono font-bold text-blue-900">{selectedVehicle.license_plate}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <div className="mt-1">{getStatusBadge(selectedVehicle.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Marca y Modelo</Label>
                  <p className="text-sm font-medium text-blue-900">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </p>
                </div>
                <div>
                  <Label>Año</Label>
                  <p className="text-sm text-blue-900">{selectedVehicle.year}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Vehículo</Label>
                  <p className="text-sm text-blue-900">{selectedVehicle.vehicle_type}</p>
                </div>
                <div>
                  <Label>Combustible</Label>
                  <p className="text-sm text-blue-900">{selectedVehicle.fuel_type}</p>
                </div>
              </div>
              <div>
                <Label>Kilometraje</Label>
                <p className="text-sm font-medium text-blue-900">{selectedVehicle.mileage.toLocaleString()} km</p>
              </div>
              {selectedVehicle.notes && (
                <div>
                  <Label>Notas</Label>
                  <p className="text-sm mt-1 p-2 bg-blue-50 rounded text-blue-900">{selectedVehicle.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
