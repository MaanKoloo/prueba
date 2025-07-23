"use client"

import { useEffect, useState } from "react"
import { Package, Wrench, FileText, TrendingUp, AlertTriangle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface DashboardStats {
  totalProducts: number
  lowStockProducts: number
  activeServices: number
  pendingInvoices: number
  todayAttendance: number
  monthlyRevenue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    activeServices: 0,
    pendingInvoices: 0,
    todayAttendance: 0,
    monthlyRevenue: 0,
  })

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      // Obtener estadísticas de productos
      const { data: products } = await supabase.from("products").select("stock_quantity, min_stock")

      const totalProducts = products?.length || 0
      const lowStockProducts = products?.filter((p) => p.stock_quantity <= p.min_stock).length || 0

      // Obtener servicios activos
      const { data: services } = await supabase.from("services").select("id").in("status", ["received", "in_progress"])

      const activeServices = services?.length || 0

      // Obtener facturas pendientes
      const { data: invoices } = await supabase.from("invoices").select("id, total_amount").eq("status", "pending")

      const pendingInvoices = invoices?.length || 0

      // Calcular ingresos del mes
      const monthlyRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

      setStats({
        totalProducts,
        lowStockProducts,
        activeServices,
        pendingInvoices,
        todayAttendance: 8, // Simulado
        monthlyRevenue,
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    }
  }

  const statCards = [
    {
      title: "Productos en Inventario",
      value: stats.totalProducts,
      description: `${stats.lowStockProducts} con stock bajo`,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Servicios Activos",
      value: stats.activeServices,
      description: "En proceso y recibidos",
      icon: Wrench,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Asistencia Hoy",
      value: stats.todayAttendance,
      description: "Empleados presentes",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Facturas Pendientes",
      value: stats.pendingInvoices,
      description: `$${stats.monthlyRevenue.toFixed(2)} en total`,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertas del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Stock Bajo</p>
                <p className="text-xs text-gray-600">Batería Litio 12V 100Ah</p>
              </div>
              <Badge variant="outline" className="text-orange-600">
                Urgente
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Servicio Pendiente</p>
                <p className="text-xs text-gray-600">SRV-0001 - Juan Pérez</p>
              </div>
              <Badge variant="outline" className="text-blue-600">
                Pendiente
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Factura Pagada</p>
                <p className="text-xs text-gray-600">INV-0001 - $150.00</p>
              </div>
              <Badge variant="outline" className="text-green-600">
                Completado
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Resumen Financiero
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ingresos del Mes</span>
              <span className="font-bold text-green-600">${stats.monthlyRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Servicios Completados</span>
              <span className="font-bold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Promedio por Servicio</span>
              <span className="font-bold">${(stats.monthlyRevenue / 12).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Meta Mensual</span>
                <span className="font-bold text-blue-600">$5,000.00</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min((stats.monthlyRevenue / 5000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
