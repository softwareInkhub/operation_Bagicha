'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiUpload, 
  FiX, 
  FiImage, 
  FiLoader,
  FiCheck,
  FiAlertCircle 
} from 'react-icons/fi'
import { uploadImage, validateImageFile, compressImage } from '@/lib/firebase'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  folder?: string
  maxWidth?: number
  quality?: number
  className?: string
  placeholder?: string
  showPreview?: boolean
  compress?: boolean
}

export default function ImageUpload({
  value,
  onChange,
  onError,
  folder = 'images',
  maxWidth = 800,
  quality = 0.8,
  className = '',
  placeholder = 'Click or drag to upload image',
  showPreview = true,
  compress = true
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      onError?.(validation.error || 'Invalid file')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      let fileToUpload = file

      // Compress image if enabled
      if (compress) {
        setUploadProgress(25)
        fileToUpload = await compressImage(file, maxWidth, quality)
      }

      setUploadProgress(50)

      // Upload to Firebase Storage
      const url = await uploadImage(fileToUpload, folder)
      
      setUploadProgress(100)
      onChange(url)
      
      setTimeout(() => {
        setUploadProgress(0)
        setUploading(false)
      }, 500)
    } catch (error) {
      console.error('Upload error:', error)
      onError?.(error instanceof Error ? error.message : 'Upload failed')
      setUploading(false)
      setUploadProgress(0)
    }
  }, [onChange, onError, folder, maxWidth, quality, compress])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const removeImage = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${dragOver 
            ? 'border-green-500 bg-green-50' 
            : value 
              ? 'border-gray-200 bg-gray-50' 
              : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
          }
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onClick={!value ? handleClick : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={!value ? { scale: 1.02 } : {}}
        whileTap={!value ? { scale: 0.98 } : {}}
      >
        {/* Existing Image Preview */}
        {value && showPreview && (
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
                className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Change Image"
              >
                <FiUpload size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage()
                }}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                title="Remove Image"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Upload UI */}
        {!value && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${dragOver ? 'bg-green-100' : 'bg-gray-100'}
              `}>
                <FiImage className={`w-8 h-8 ${dragOver ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
            </div>
            
            <div>
              <p className="text-gray-700 font-medium">{placeholder}</p>
              <p className="text-sm text-gray-500 mt-1">
                Supports JPEG, PNG, WebP, GIF (max 5MB)
              </p>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex flex-col items-center justify-center space-y-3"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <motion.div
                  className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <div className="text-center">
                <p className="text-gray-700 font-medium">Uploading...</p>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{uploadProgress}%</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* File Info (when image is selected) */}
      {value && !showPreview && (
        <div className="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Image uploaded</p>
              <p className="text-xs text-gray-500">Ready to save</p>
            </div>
          </div>
          <button
            onClick={removeImage}
            className="text-red-500 hover:text-red-700 p-1"
            title="Remove Image"
          >
            <FiX size={16} />
          </button>
        </div>
      )}
    </div>
  )
} 