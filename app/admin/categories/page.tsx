'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiGrid,
  FiX,
  FiSave,
  FiFolder
} from 'react-icons/fi'
import { getCategories, addCategory, updateCategory, deleteCategory, createSampleCategories } from '@/lib/firebase'
import ImageUpload from '@/components/ImageUpload'

interface Category {
  id?: string
  name: string
  description: string
  icon: string
  image?: string
  subcategories: string[]
  productCount?: number
  createdAt?: any
  updatedAt?: any
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [imageUploadError, setImageUploadError] = useState<string>('')

  const [categoryForm, setCategoryForm] = useState<Category>({
    name: '',
    description: '',
    icon: '🌱',
    image: '',
    subcategories: []
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData as Category[])
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = () => {
    setCategoryForm({
      name: '',
      description: '',
      icon: '🌱',
      image: '',
      subcategories: []
    })
    setEditingCategory(null)
    setImageUploadError('')
    setShowAddModal(true)
  }

  const handleEditCategory = (category: Category) => {
    setCategoryForm(category)
    setEditingCategory(category)
    setShowAddModal(true)
  }

  const handleSaveCategory = async () => {
    try {
      if (editingCategory && editingCategory.id) {
        await updateCategory(editingCategory.id, categoryForm)
      } else {
        await addCategory(categoryForm)
      }
      await loadCategories()
      setShowAddModal(false)
      setEditingCategory(null)
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
      await loadCategories()
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleSubcategoryAdd = (subcategory: string) => {
    if (subcategory.trim() && !categoryForm.subcategories.includes(subcategory.trim())) {
      setCategoryForm({
        ...categoryForm,
        subcategories: [...categoryForm.subcategories, subcategory.trim()]
      })
    }
  }

  const handleSubcategoryRemove = (index: number) => {
    setCategoryForm({
      ...categoryForm,
      subcategories: categoryForm.subcategories.filter((_, i) => i !== index)
    })
  }

  const commonIcons = [
    '🌱', '🪴', '🌿', '🌸', '🌺', '🌻', '🌹', '🌷', '🌾', '🍃',
    '🛠️', '⚒️', '🔧', '✂️', '🏺', '🪣', '🌰', '🌱', '💧', '☀️'
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your products into categories</p>
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full lg:w-auto"
        >
          <FiPlus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span>{category.icon}</span>
                )}
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(category.id!)}
                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
              </div>

              {category.subcategories.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">Subcategories:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.slice(0, 3).map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full truncate max-w-20"
                      >
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="text-xs text-gray-500">+{category.subcategories.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {category.productCount || 0} products
                </span>
                <span className="text-xs text-gray-400">
                  {category.createdAt ? new Date(category.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <FiFolder className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No categories found</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <button
              onClick={handleAddCategory}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Create your first category
            </button>
            <span className="text-gray-300 hidden sm:inline">or</span>
            <button
              onClick={async () => {
                const success = await createSampleCategories()
                if (success) {
                  await loadCategories()
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Load sample categories
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Enter category description"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Icon (Emoji)</label>
                  <div className="grid grid-cols-10 gap-2 mb-3">
                    {commonIcons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setCategoryForm({ ...categoryForm, icon })}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${
                          categoryForm.icon === icon
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Or enter custom emoji"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Image (Optional)</label>
                  <p className="text-xs text-gray-500 mb-3">Upload an image to use instead of emoji icon</p>
                  <ImageUpload
                    value={categoryForm.image}
                    onChange={(url) => setCategoryForm({ ...categoryForm, image: url })}
                    onError={(error) => setImageUploadError(error)}
                    folder="categories"
                    placeholder="Upload category image"
                    className="w-full"
                  />
                  {imageUploadError && (
                    <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>
                  )}
                </div>

                {/* Subcategories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategories</label>
                  <div className="space-y-2">
                    {categoryForm.subcategories.map((subcategory, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">{subcategory}</span>
                        <button
                          onClick={() => handleSubcategoryRemove(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a subcategory"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleSubcategoryAdd((e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement
                          handleSubcategoryAdd(input.value)
                          input.value = ''
                        }}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl overflow-hidden">
                        {categoryForm.image ? (
                          <img
                            src={categoryForm.image}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span>{categoryForm.icon}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{categoryForm.name || 'Category Name'}</h4>
                        <p className="text-sm text-gray-600">{categoryForm.description || 'Category description'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCategory}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <FiSave size={16} />
                    <span>{editingCategory ? 'Update' : 'Create'} Category</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FiTrash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Category</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this category? This action cannot be undone and may affect associated products.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
} 