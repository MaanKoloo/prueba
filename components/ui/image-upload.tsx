"use client"

import { useState, useCallback } from "react"
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void
  maxImages?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export function ImageUpload({
  onImagesChange,
  maxImages = 5,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
}: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>("")

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de archivo no soportado: ${file.type}`
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `El archivo es muy grande. Máximo ${maxSize}MB`
    }
    return null
  }

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const fileArray = Array.from(files)
      const newImages: File[] = []
      const newPreviews: string[] = []
      let errorMessage = ""

      for (const file of fileArray) {
        if (images.length + newImages.length >= maxImages) {
          errorMessage = `Máximo ${maxImages} imágenes permitidas`
          break
        }

        const validationError = validateFile(file)
        if (validationError) {
          errorMessage = validationError
          break
        }

        newImages.push(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string)
          if (newPreviews.length === newImages.length) {
            setPreviews((prev) => [...prev, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      }

      if (errorMessage) {
        setError(errorMessage)
        setTimeout(() => setError(""), 5000)
        return
      }

      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      onImagesChange(updatedImages)
      setError("")
    },
    [images, maxImages, maxSize, acceptedTypes, onImagesChange],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    },
    [handleFiles],
  )

  const removeImage = useCallback(
    (index: number) => {
      const updatedImages = images.filter((_, i) => i !== index)
      const updatedPreviews = previews.filter((_, i) => i !== index)
      setImages(updatedImages)
      setPreviews(updatedPreviews)
      onImagesChange(updatedImages)
    },
    [images, previews, onImagesChange],
  )

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : images.length >= maxImages
              ? "border-gray-200 bg-gray-50"
              : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleInputChange}
          className="hidden"
          id="image-upload"
          disabled={images.length >= maxImages}
        />

        <div className="space-y-2">
          <Upload className="h-8 w-8 mx-auto text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">
              {images.length >= maxImages
                ? `Máximo ${maxImages} imágenes alcanzado`
                : "Arrastra imágenes aquí o haz clic para seleccionar"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Soporta: JPG, PNG, GIF, WebP (máx. {maxSize}MB cada una)
            </p>
          </div>
          {images.length < maxImages && (
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
              className="mt-2"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Seleccionar Imágenes
            </Button>
          )}
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                {images[index]?.name.substring(0, 10)}...
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500">
        {images.length} de {maxImages} imágenes seleccionadas
      </div>
    </div>
  )
}
