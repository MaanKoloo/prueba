"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Clock, User, Calendar, Eye, Edit } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AttendanceRecord {
  id: string
  employee_name: string
  date: string
  check_in: string
  check_out: string
  hours_worked: number
  status: string
  notes: string
}

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newRecord, setNewRecord] = useState({
    employee_name: "",
    date: new Date().toISOString().split("T")[0],
    check_in: "",
    check_out: "",
    notes: "",
  })

  // Mock data
  const getMockAttendanceRecords = (): AttendanceRecord[] => [
    {
      id: "1",
      employee_name: "Carlos Mendoza",
      date: new Date().toISOString().split("T")[0],
      check_in: "08:00",
      check_out: "17:30",
      hours_worked: 8.5,
      status: "present",
      notes: "",
    },
    {
      id: "2",
      employee_name: "Ana Silva",
      date: new Date().toISOString().split("T")[0],
      check_in: "08:15",
      check_out: "17:45",
      hours_worked: 8.5,
      status: "present",
      notes: "Llegada tardía por tráfico",
    },
    {
      id: "3",
      employee_name: "Pedro Ramírez",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      check_in: "08:00",
      check_out: "16:00",
      hours_worked: 8,
      status: "present",
      notes: "Salida temprana autorizada",
    },
    {
      id: "4",
      employee_name: "Luis Torres",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      check_in: "",
      check_out: "",
      hours_worked: 0,
      status: "absent",
      notes: "Licencia médica",
    },
    {
      id: "5",
      employee_name: "María González",
      date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
      check_in: "09:00",
      check_out: "18:00",
      hours_worked: 8,
      status: "late",
      notes: "Reunión externa en la mañana",
    },
  ]

  useEffect(() => {
    loadAttendanceRecords()
  }, [])

  useEffect(() => {
    let filtered = attendanceRecords.filter((record) =>
      record.employee_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

    setFilteredRecords(filtered)
  }, [attendanceRecords, searchTerm, statusFilter])

  const loadAttendanceRecords = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockRecords = getMockAttendanceRecords()
      setAttendanceRecords(mockRecords)
    } catch (error) {
      console.error("Error loading attendance records:", error)
      setAttendanceRecords(getMockAttendanceRecords())
    }
  }

  const calculateHours = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0
    const [inHour, inMin] = checkIn.split(":").map(Number)
    const [outHour, outMin] = checkOut.split(":").map(Number)
    const inMinutes = inHour * 60 + inMin
    const outMinutes = outHour * 60 + outMin
    return Math.round(((outMinutes - inMinutes) / 60) * 100) / 100
  }

  const handleAddRecord = async () => {
    try {
      const hoursWorked = calculateHours(newRecord.check_in, newRecord.check_out)
      let status = "present"

      if (!newRecord.check_in || !newRecord.check_out) {
        status = "absent"
      } else if (newRecord.check_in > "08:15") {
        status = "late"
      }

      const newRecordData: AttendanceRecord = {
        id: Date.now().toString(),
        employee_name: newRecord.employee_name,
        date: newRecord.date,
        check_in: newRecord.check_in,
        check_out: newRecord.check_out,
        hours_worked: hoursWorked,
        status: status,
        notes: newRecord.notes,
      }

      setAttendanceRecords((prev) => [newRecordData, ...prev])
      setIsAddDialogOpen(false)
      setNewRecord({
        employee_name: "",
        date: new Date().toISOString().split("T")[0],
        check_in: "",
        check_out: "",
        notes: "",
      })
    } catch (error) {
      console.error("Error adding attendance record:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { label: "Presente", color: "bg-green-100 text-green-800" },
      late: { label: "Tardanza", color: "bg-yellow-100 text-yellow-800" },
      absent: { label: "Ausente", color: "bg-red-100 text-red-800" },
      early_leave: { label: "Salida Temprana", color: "bg-orange-100 text-orange-800" },
    }

    const config = statusConfig[status] || statusConfig.present
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getAttendanceStats = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayRecords = attendanceRecords.filter((r) => r.date === today)

    return {
      total: attendanceRecords.length,
      present: attendanceRecords.filter((r) => r.status === "present").length,
      late: attendanceRecords.filter((r) => r.status === "late").length,
      absent: attendanceRecords.filter((r) => r.status === "absent").length,
      todayPresent: todayRecords.filter((r) => r.status === "present" || r.status === "late").length,
    }
  }

  const stats = getAttendanceStats()

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Control de Asistencia</h1>
          <p className="text-blue-600">Gestión de horarios y asistencia del personal</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Asistencia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-blue-900">Registrar Asistencia</DialogTitle>
              <DialogDescription>Registra la asistencia de un empleado</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="employee_name">Empleado</Label>
                <Input
                  id="employee_name"
                  value={newRecord.employee_name}
                  onChange={(e) => setNewRecord({ ...newRecord, employee_name: e.target.value })}
                  placeholder="Nombre del empleado"
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="check_in">Hora de Entrada</Label>
                  <Input
                    id="check_in"
                    type="time"
                    value={newRecord.check_in}
                    onChange={(e) => setNewRecord({ ...newRecord, check_in: e.target.value })}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="check_out">Hora de Salida</Label>
                  <Input
                    id="check_out"
                    type="time"
                    value={newRecord.check_out}
                    onChange={(e) => setNewRecord({ ...newRecord, check_out: e.target.value })}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Input
                  id="notes"
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  placeholder="Observaciones adicionales..."
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddRecord} className="bg-blue-600 hover:bg-blue-700">
                  Registrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Registros</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600">En el sistema</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Presentes</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-blue-600">Asistencias</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Tardanzas</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
            <p className="text-xs text-blue-600">Llegadas tarde</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Ausencias</CardTitle>
            <User className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <p className="text-xs text-blue-600">No asistieron</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Hoy Presentes</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todayPresent}</div>
            <p className="text-xs text-blue-600">En el día</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Registros de Asistencia</CardTitle>
          <CardDescription className="text-blue-600">Control de horarios del personal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Buscar empleado..."
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
                <SelectItem value="present">Presente</SelectItem>
                <SelectItem value="late">Tardanza</SelectItem>
                <SelectItem value="absent">Ausente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-blue-900">Empleado</TableHead>
                <TableHead className="text-blue-900">Fecha</TableHead>
                <TableHead className="text-blue-900">Entrada</TableHead>
                <TableHead className="text-blue-900">Salida</TableHead>
                <TableHead className="text-blue-900">Horas</TableHead>
                <TableHead className="text-blue-900">Estado</TableHead>
                <TableHead className="text-blue-900">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium text-blue-900">{record.employee_name}</TableCell>
                  <TableCell className="text-blue-900">{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-blue-900">{record.check_in || "-"}</TableCell>
                  <TableCell className="text-blue-900">{record.check_out || "-"}</TableCell>
                  <TableCell className="text-blue-900">{record.hours_worked}h</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedRecord(record)
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

      {/* Attendance Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Detalles de Asistencia</DialogTitle>
            <DialogDescription>{selectedRecord?.employee_name}</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Empleado</Label>
                  <p className="text-sm font-medium text-blue-900">{selectedRecord.employee_name}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha</Label>
                  <p className="text-sm text-blue-900">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Horas Trabajadas</Label>
                  <p className="text-sm font-medium text-blue-900">{selectedRecord.hours_worked} horas</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hora de Entrada</Label>
                  <p className="text-sm text-blue-900">{selectedRecord.check_in || "No registrada"}</p>
                </div>
                <div>
                  <Label>Hora de Salida</Label>
                  <p className="text-sm text-blue-900">{selectedRecord.check_out || "No registrada"}</p>
                </div>
              </div>
              {selectedRecord.notes && (
                <div>
                  <Label>Notas</Label>
                  <p className="text-sm mt-1 p-2 bg-blue-50 rounded text-blue-900">{selectedRecord.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
