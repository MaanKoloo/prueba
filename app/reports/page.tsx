"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Clock, Download, Filter } from "lucide-react"

// Mock data para reportes
const mockSalesData = [
  { month: "Ene", ventas: 45000, servicios: 32000, productos: 13000 },
  { month: "Feb", ventas: 52000, servicios: 38000, productos: 14000 },
  { month: "Mar", ventas: 48000, servicios: 35000, productos: 13000 },
  { month: "Abr", ventas: 61000, servicios: 42000, productos: 19000 },
  { month: "May", ventas: 55000, servicios: 39000, productos: 16000 },
  { month: "Jun", ventas: 67000, servicios: 48000, productos: 19000 },
]

const mockInventoryData = [
  { name: "Baterías", value: 45, color: "#0088FE" },
  { name: "Inversores", value: 30, color: "#00C49F" },
  { name: "Paneles", value: 15, color: "#FFBB28" },
  { name: "Accesorios", value: 10, color: "#FF8042" },
]

const mockServiceData = [
  { day: "Lun", completados: 12, pendientes: 3 },
  { day: "Mar", completados: 15, pendientes: 2 },
  { day: "Mié", completados: 18, pendientes: 4 },
  { day: "Jue", completados: 14, pendientes: 1 },
  { day: "Vie", completados: 20, pendientes: 5 },
  { day: "Sáb", completados: 8, pendientes: 2 },
  { day: "Dom", completados: 5, pendientes: 1 },
]

const mockTopProducts = [
  { id: 1, name: "Batería Litio 12V 100Ah", sales: 45, revenue: 67500 },
  { id: 2, name: "Inversor 3000W", sales: 32, revenue: 48000 },
  { id: 3, name: "Panel Solar 400W", sales: 28, revenue: 42000 },
  { id: 4, name: "Controlador MPPT 60A", sales: 25, revenue: 37500 },
  { id: 5, name: "Batería AGM 12V 200Ah", sales: 22, revenue: 33000 },
]

const mockTopServices = [
  { id: 1, name: "Instalación Sistema Solar", count: 35, revenue: 105000 },
  { id: 2, name: "Mantenimiento Preventivo", count: 28, revenue: 42000 },
  { id: 3, name: "Reparación Inversor", count: 22, revenue: 33000 },
  { id: 4, name: "Cambio de Baterías", count: 18, revenue: 27000 },
  { id: 5, name: "Diagnóstico Sistema", count: 15, revenue: 22500 },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last_30_days")
  const [reportType, setReportType] = useState("sales")
  const [loading, setLoading] = useState(false)

  const stats = [
    {
      title: "Ingresos Totales",
      value: "$328,450",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Productos Vendidos",
      value: "1,247",
      change: "+8.2%",
      trend: "up",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Servicios Completados",
      value: "156",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Tiempo Promedio",
      value: "2.4h",
      change: "-5.1%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const handleExportReport = () => {
    setLoading(true)
    // Simular exportación
    setTimeout(() => {
      setLoading(false)
      alert("Reporte exportado exitosamente")
    }, 2000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reportes y Análisis</h1>
          <p className="text-gray-600">Análisis detallado del rendimiento del negocio</p>
        </div>
        <Button onClick={handleExportReport} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          {loading ? "Exportando..." : "Exportar Reporte"}
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Filter className="h-5 w-5" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateRange">Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Últimos 7 días</SelectItem>
                  <SelectItem value="last_30_days">Últimos 30 días</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                  <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
                  <SelectItem value="last_year">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reportType">Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Ventas</SelectItem>
                  <SelectItem value="inventory">Inventario</SelectItem>
                  <SelectItem value="services">Servicios</SelectItem>
                  <SelectItem value="financial">Financiero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Fecha Inicio</Label>
              <Input type="date" id="startDate" />
            </div>
            <div>
              <Label htmlFor="endDate">Fecha Fin</Label>
              <Input type="date" id="endDate" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={index} className="border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendIcon className={`h-3 w-3 mr-1 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                  <span className="ml-1">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Evolución de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="ventas"
                      stackId="1"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      name="Ventas Totales"
                    />
                    <Area
                      type="monotone"
                      dataKey="servicios"
                      stackId="1"
                      stroke="#059669"
                      fill="#10b981"
                      name="Servicios"
                    />
                    <Area
                      type="monotone"
                      dataKey="productos"
                      stackId="1"
                      stroke="#dc2626"
                      fill="#ef4444"
                      name="Productos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Productos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sales} unidades</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${product.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Distribución de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockInventoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockInventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Stock por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInventoryData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-gray-500">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${item.value}%`, backgroundColor: item.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Servicios por Día</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockServiceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completados" fill="#10b981" name="Completados" />
                    <Bar dataKey="pendientes" fill="#f59e0b" name="Pendientes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Servicios Más Solicitados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopServices.map((service, index) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.count} servicios</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${service.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Métricas de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">94.5%</div>
                  <div className="text-sm text-gray-600">Satisfacción del Cliente</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2.1h</div>
                  <div className="text-sm text-gray-600">Tiempo Promedio de Servicio</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">87%</div>
                  <div className="text-sm text-gray-600">Eficiencia Operativa</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detailed Reports Table */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Reporte Detallado - Últimas Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-01-15</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Servicio
                  </Badge>
                </TableCell>
                <TableCell>Juan Pérez</TableCell>
                <TableCell>Instalación Sistema Solar</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Completado</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">$3,500.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-14</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    Producto
                  </Badge>
                </TableCell>
                <TableCell>María González</TableCell>
                <TableCell>Batería Litio 12V 100Ah</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Entregado</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">$1,500.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-13</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Servicio
                  </Badge>
                </TableCell>
                <TableCell>Carlos Rodríguez</TableCell>
                <TableCell>Mantenimiento Preventivo</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">En Proceso</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">$800.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-12</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    Producto
                  </Badge>
                </TableCell>
                <TableCell>Ana Martínez</TableCell>
                <TableCell>Inversor 3000W</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Entregado</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">$2,200.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-11</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Servicio
                  </Badge>
                </TableCell>
                <TableCell>Luis Fernández</TableCell>
                <TableCell>Reparación Inversor</TableCell>
                <TableCell>
                  <Badge className="bg-red-100 text-red-800">Pendiente</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">$450.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
