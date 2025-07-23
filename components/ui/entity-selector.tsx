"use client"

import { useState } from "react"
import { Plus, User, Users, Truck, Wrench } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"

interface EntitySelectorProps {
  type: "client" | "technician" | "driver" | "user"
  value: string
  onValueChange: (value: string) => void
  items: any[]
  onItemAdded: () => void
  placeholder: string
}

export function EntitySelector({
  type,
  value,
  onValueChange,
  items,
  onItemAdded,
  placeholder,
}: EntitySelectorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newEntity, setNewEntity] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const getEntityConfig = () => {
    switch (type) {
      case "client":
        return {
          title: "Crear Nuevo Cliente",
          icon: <User className="h-4 w-4" />,
          fields: [
            { key: "name", label: "Nombre", type: "text", required: true },
            { key: "email", label: "Email", type: "email", required: true },
            { key: "phone", label: "Teléfono", type: "tel", required: true },
            { key: "address", label: "Dirección", type: "text", required: false },
            { key: "rut", label: "RUT", type: "text", required: false },
          ],
          table: "clients",
        }
      case "technician":
      case "user":
        return {
          title: "Crear Nuevo Usuario",
          icon: <Users className="h-4 w-4" />,
          fields: [
            { key: "full_name", label: "Nombre Completo", type: "text", required: true },
            { key: "email", label: "Email", type: "email", required: true },
            { key: "phone", label: "Teléfono", type: "tel", required: false },
            { key: "role", label: "Rol", type: "select", required: true, options: [
              { value: "colaborador", label: "Colaborador" },
              { value: "admin", label: "Administrador" },
            ]},
          ],
          table: "users",
          extraData: { is_active: true, password_hash: "temp123" },
        }
      case "driver":
        return {
          title: "Crear Nuevo Chofer",
          icon: <Truck className="h-4 w-4" />,
          fields: [
            { key: "full_name", label: "Nombre Completo", type: "text", required: true },
            { key: "email", label: "Email", type: "email", required: true },
            { key: "phone", label: "Teléfono", type: "tel", required: true },
            { key: "license_number", label: "Número de Licencia", type: "text", required: true },
            { key: "license_type", label: "Tipo de Licencia", type: "select", required: true, options: [
              { value: "A1", label: "A1 - Motocicletas" },
              { value: "A2", label: "A2 - Motocicletas de mayor cilindrada" },
              { value: "B", label: "B - Automóviles" },
              { value: "C", label: "C - Camiones" },
              { value: "D", label: "D - Transporte de pasajeros" },
              { value: "E", label: "E - Articulados" },
            ]},
          ],
          table: "users",
          extraData: { role: "colaborador", is_active: true, password_hash: "temp123" },
        }
      default:
        return {
          title: "Crear Nueva Entidad",
          icon: <Plus className="h-4 w-4" />,
          fields: [],
          table: "",
        }
    }
  }

  const config = getEntityConfig()

  const handleCreate = async () => {
    setLoading(true)
    try {
      const dataToInsert = {
        ...newEntity,
        ...config.extraData,
      }

      const { data, error } = await supabase
        .from(config.table)
        .insert([dataToInsert])
        .select()
        .single()

      if (error) throw error

      // Select the newly created entity
      onValueChange(data.id)
      
      // Refresh the items list
      onItemAdded()
      
      // Close dialog and reset form
      setIsCreateDialogOpen(false)
      setNewEntity({})
    } catch (error) {
      console.error(`Error creating ${type}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: any) => {
    if (field.type === "select") {
      return (
        <Select
          value={newEntity[field.key] || ""}
          onValueChange={(value) => setNewEntity({ ...newEntity, [field.key]: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Seleccionar ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    return (
      <Input
        type={field.type}
        value={newEntity[field.key] || ""}
        onChange={(e) => setNewEntity({ ...newEntity, [field.key]: e.target.value })}
        placeholder={field.label}
        required={field.required}
      />
    )
  }

  return (
    <div className="flex space-x-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name || item.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" type="button">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {config.icon}
              <span>{config.title}</span>
            </DialogTitle>
            <DialogDescription>
              Completa la información para crear un nuevo {type === "client" ? "cliente" : type === "driver" ? "chofer" : "usuario"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                disabled={loading || !config.fields.filter(f => f.required).every(f => newEntity[f.key])}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Creando..." : "Crear"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
