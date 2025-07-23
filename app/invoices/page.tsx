"use client"

import { useEffect, useState } from "react"
import { Plus, Search, FileText, DollarSign, Calendar, Eye, Edit, Download } from "lucide-react"
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

interface Invoice {
  id: string
  invoice_number: string
  client_name: string
  service_name: string
  amount: number
  status: string
  issue_date: string
  due_date: string
  notes: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    client_name: "",
    service_name: "",
    amount: 0,
    due_date: "",
    notes: "",
  })

  // Mock data
  const getMockInvoices = (): Invoice[] => [
    {
      id: "1",
      invoice_number: "FAC-2024-001",
      client_name: "Juan Pérez",
      service_name: "Reparación de Batería de Auto",
      amount: 25000,
      status: "paid",
      issue_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 2592000000).toISOString(),
      notes: "Servicio completado satisfactoriamente",
    },
    {
      id: "2",
      invoice_number: "FAC-2024-002",
      client_name: "María González",
      service_name: "Mantención de UPS",
      amount: 35000,
      status: "pending",
      issue_date: new Date(Date.now() - 86400000).toISOString(),
      due_date: new Date(Date.now() + 2505600000).toISOString(),
      notes: "",
    },
    {
      id: "3",
      invoice_number: "FAC-2024-003",
      client_name: "Empresa Solar Chile",
      service_name: "Instalación de Sistema Solar",
      amount: 150000,
      status: "overdue",
      issue_date: new Date(Date.now() - 2592000000).toISOString(),
      due_date: new Date(Date.now() - 86400000).toISOString(),
      notes: "Instalación completa de paneles solares",
    },
    {
      id: "4",
      invoice_number: "FAC-2024-004",
      client_name: "Luis Torres",
      service_name: "Diagnóstico Eléctrico",
      amount: 15000,
      status: "draft",
      issue_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 2592000000).toISOString(),
      notes: "Borrador - pendiente de envío",
    },
  ]

  useEffect(() => {
    loadInvoices()
  }, [])

  useEffect(() => {
    let filtered = invoices.filter(
      (invoice) =>
        invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.service_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, statusFilter])

  const loadInvoices = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockInvoices = getMockInvoices()
      setInvoices(mockInvoices)
    } catch (error) {
      console.error("Error loading invoices:", error)
      setInvoices(getMockInvoices())
    }
  }

  const generateInvoiceNumber = (): string => {
    const year = new Date().getFullYear()
    const count = invoices.length + 1
    return `FAC-${year}-${count.toString().padStart(3, "0")}`
  }

  const handleAddInvoice = async () => {
    try {
      const newInvoiceData: Invoice = {
        id: Date.now().toString(),
        invoice_number: generateInvoiceNumber(),
        client_name: newInvoice.client_name,
        service_name: newInvoice.service_name,
        amount: newInvoice.amount,
        status: "draft",
        issue_date: new Date().toISOString(),
        due_date: newInvoice.due_date,
        notes: newInvoice.notes,
      }

      setInvoices((prev) => [newInvoiceData, ...prev])
      setIsAddDialogOpen(false)
      setNewInvoice({
        client_name: "",
        service_name: "",
        amount: 0,
        due_date: "",
        notes: "",
      })
    } catch (error) {
      console.error("Error adding invoice:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Borrador", color: "bg-gray-100 text-gray-800" },
      pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      paid: { label: "Pagada", color: "bg-green-100 text-green-800" },
      overdue: { label: "Vencida", color: "bg-red-100 text-red-800" },
      cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status] || statusConfig.draft
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getInvoiceStats = () => {
    return {
      total: invoices.length,
      pending: invoices.filter((i) => i.status === "pending").length,
      paid: invoices.filter((i) => i.status === "paid").length,
      overdue: invoices.filter((i) => i.status === "overdue").length,
      totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
      paidAmount: invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0),
    }
  }

  const stats = getInvoiceStats()

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Gestión de Facturas</h1>
          <p className="text-blue-600">Administra las facturas y pagos de la empresa</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Factura
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-blue-900">Crear Nueva Factura</DialogTitle>
              <DialogDescription>Registra una nueva factura en el sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client_name">Cliente</Label>
                <Input
                  id="client_name"
                  value={newInvoice.client_name}
                  onChange={(e) => setNewInvoice({ ...newInvoice, client_name: e.target.value })}
                  placeholder="Nombre del cliente"
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="service_name">Servicio</Label>
                <Input
                  id="service_name"
                  value={newInvoice.service_name}
                  onChange={(e) => setNewInvoice({ ...newInvoice, service_name: e.target.value })}
                  placeholder="Descripción del servicio"
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="amount">Monto (CLP)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number.parseInt(e.target.value) || 0 })}
                  placeholder="25000"
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="due_date">Fecha de Vencimiento</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newInvoice.due_date}
                  onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                  placeholder="Observaciones adicionales..."
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddInvoice} className="bg-blue-600 hover:bg-blue-700">
                  Crear Factura
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Facturas</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600">En el sistema</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-blue-600">Por cobrar</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Pagadas</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <p className="text-xs text-blue-600">Cobradas</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Vencidas</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-blue-600">Atrasadas</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Facturado</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">${stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-blue-600">CLP total</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Cobrado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.paidAmount.toLocaleString()}</div>
            <p className="text-xs text-blue-600">CLP cobrado</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Lista de Facturas</CardTitle>
          <CardDescription className="text-blue-600">Gestiona todas las facturas emitidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Buscar facturas..."
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
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="paid">Pagada</SelectItem>
                <SelectItem value="overdue">Vencida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-blue-900">N° Factura</TableHead>
                <TableHead className="text-blue-900">Cliente</TableHead>
                <TableHead className="text-blue-900">Servicio</TableHead>
                <TableHead className="text-blue-900">Monto</TableHead>
                <TableHead className="text-blue-900">Estado</TableHead>
                <TableHead className="text-blue-900">Vencimiento</TableHead>
                <TableHead className="text-blue-900">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono font-bold text-blue-900">{invoice.invoice_number}</TableCell>
                  <TableCell className="font-medium text-blue-900">{invoice.client_name}</TableCell>
                  <TableCell className="text-blue-900">{invoice.service_name}</TableCell>
                  <TableCell className="font-medium text-blue-900">${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-sm text-blue-700">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedInvoice(invoice)
                          setIsViewDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Detalles de la Factura</DialogTitle>
            <DialogDescription>{selectedInvoice?.invoice_number}</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Número de Factura</Label>
                  <p className="text-sm font-mono font-bold text-blue-900">{selectedInvoice.invoice_number}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <p className="text-sm font-medium text-blue-900">{selectedInvoice.client_name}</p>
                </div>
                <div>
                  <Label>Monto</Label>
                  <p className="text-sm font-bold text-blue-900">${selectedInvoice.amount.toLocaleString()} CLP</p>
                </div>
              </div>
              <div>
                <Label>Servicio</Label>
                <p className="text-sm text-blue-900">{selectedInvoice.service_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha de Emisión</Label>
                  <p className="text-sm text-blue-700">{new Date(selectedInvoice.issue_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Fecha de Vencimiento</Label>
                  <p className="text-sm text-blue-700">{new Date(selectedInvoice.due_date).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedInvoice.notes && (
                <div>
                  <Label>Notas</Label>
                  <p className="text-sm mt-1 p-2 bg-blue-50 rounded text-blue-900">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
