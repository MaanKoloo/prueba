"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  min_stock: number
  sku: string
  created_at: string
}

const categories = ["Baterías", "Paneles Solares", "Inversores", "Controladores", "Cables", "Estructuras", "Accesorios"]

const getStockStatus = (stock: number, minStock: number) => {
  if (stock === 0) return { label: "Sin Stock", color: "bg-red-100 text-red-800", icon: XCircle }
  if (stock <= minStock) return { label: "Stock Bajo", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle }
  return { label: "En Stock", color: "bg-green-100 text-green-800", icon: CheckCircle }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(price)
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const getMockProducts = (): Product[] => [
    {
      id: "1",
      name: "Batería Litio 12V 100Ah",
      description: "Batería de litio de alta capacidad para sistemas solares",
      category: "Baterías",
      price: 450000,
      stock: 15,
      min_stock: 5,
      sku: "BAT-LIT-12V-100",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Panel Solar 400W Monocristalino",
      description: "Panel solar monocristalino de alta eficiencia",
      category: "Paneles Solares",
      price: 280000,
      stock: 8,
      min_stock: 3,
      sku: "PAN-SOL-400W",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Inversor 3000W 24V",
      description: "Inversor de onda pura para sistemas residenciales",
      category: "Inversores",
      price: 320000,
      stock: 2,
      min_stock: 3,
      sku: "INV-3000W-24V",
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Controlador MPPT 60A",
      description: "Controlador de carga MPPT para optimización de energía",
      category: "Controladores",
      price: 180000,
      stock: 12,
      min_stock: 4,
      sku: "CTRL-MPPT-60A",
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Cable Solar 4mm² (Metro)",
      description: "Cable especial para instalaciones solares",
      category: "Cables",
      price: 2500,
      stock: 0,
      min_stock: 50,
      sku: "CAB-SOL-4MM",
      created_at: new Date().toISOString(),
    },
    {
      id: "6",
      name: "Estructura Aluminio Techo",
      description: "Estructura de montaje para paneles en techo",
      category: "Estructuras",
      price: 85000,
      stock: 6,
      min_stock: 2,
      sku: "EST-ALU-TECHO",
      created_at: new Date().toISOString(),
    },
  ]

  const loadProducts = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const mockProducts = getMockProducts()
      setProducts(mockProducts)
    } catch (error) {
      console.error("Error loading products:", error)
      setProducts(getMockProducts())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleAddProduct = (formData: FormData) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      price: Number.parseInt(formData.get("price") as string),
      stock: Number.parseInt(formData.get("stock") as string),
      min_stock: Number.parseInt(formData.get("min_stock") as string),
      sku: formData.get("sku") as string,
      created_at: new Date().toISOString(),
    }

    setProducts((prev) => [newProduct, ...prev])
    setIsAddDialogOpen(false)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const lowStockCount = products.filter((p) => p.stock <= p.min_stock && p.stock > 0).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Cargando inventario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Inventario</h1>
          <p className="text-blue-600">Gestión de productos y stock</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-blue-900">Nuevo Producto</DialogTitle>
            </DialogHeader>
            <form action={handleAddProduct} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input id="name" name="name" required className="border-blue-200 focus:border-blue-500" />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" className="border-blue-200 focus:border-blue-500" />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select name="category" required>
                  <SelectTrigger className="border-blue-200 focus:border-blue-500">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio (CLP)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" name="sku" required className="border-blue-200 focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Actual</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="min_stock">Stock Mínimo</Label>
                  <Input
                    id="min_stock"
                    name="min_stock"
                    type="number"
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Agregar Producto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatPrice(totalValue)}</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{lowStockCount}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Sin Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{outOfStockCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-blue-200">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-500"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 border-blue-200 focus:border-blue-500">
                <Filter className="h-4 w-4 mr-2 text-blue-400" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock, product.min_stock)
          const StatusIcon = stockStatus.icon

          return (
            <Card key={product.id} className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-blue-900">{product.name}</CardTitle>
                    <p className="text-sm text-blue-600 mt-1">{product.sku}</p>
                  </div>
                  <Badge className={stockStatus.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {stockStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{product.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Categoría</p>
                    <p className="font-medium text-blue-900">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600">Precio</p>
                    <p className="font-bold text-blue-900">{formatPrice(product.price)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                  <div>
                    <p className="text-sm text-blue-600">Stock Actual</p>
                    <p className="font-bold text-blue-900">{product.stock} unidades</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600">Stock Mínimo</p>
                    <p className="font-medium text-blue-700">{product.min_stock} unidades</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="border-blue-200">
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-900 mb-2">No se encontraron productos</h3>
              <p className="text-blue-600">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
