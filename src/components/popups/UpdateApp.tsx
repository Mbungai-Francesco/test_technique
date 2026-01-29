import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import type { Application } from '@/types'
import { useAppContext } from '@/hooks/useAppContext'
import { loadToast } from '@/lib/loadToast'
import { updateApp } from '@/api/application'

interface props {
  isOpen: boolean
  onClose: () => void
  reFresh: () => void
  app: Application
}

const convertSizeToReadable = (size?: bigint) => {
  if (!size) return '0 B'

  const i = Math.floor(Math.log(Number(size)) / Math.log(1024))
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  return (Number(size) / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}

export const UpdateApp = ({ isOpen, onClose, reFresh, app }: props) => {
  const { id } = useAppContext()

  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [name, setName] = useState(app.name)
  const [comment, setComment] = useState(app.comment)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    // console.log("app : ", app);
    setName(app.name)
    setComment(app.comment)
  }, [isOpen])

  useEffect(() => {
    if (selectedFile) setPreviewUrl(URL.createObjectURL(selectedFile))
  }, [selectedFile])

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  // Process file
  const handleFile = (file: File) => {
    // Validate file type
    if (
      !file.name.endsWith('.png') &&
      !file.name.endsWith('.jpeg') &&
      !file.name.endsWith('.jpg') &&
      !file.name.endsWith('.webp')
    ) {
      setError('Please select a valid PNG file')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    // setName(file.name.replace('.apk', ''))
    setError('')
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsUploading(true)
    setError('')

    const formData = new FormData()

    formData.append('name', name)
    formData.append('comment', comment || '')
    formData.append('userId', id)
    if (selectedFile) formData.append('icon', selectedFile)

    console.log(formData)

    mutate(formData)
  }

  // Reset and close
  const handleClose = () => {
    setSelectedFile(null)
    setName('')
    setComment('')
    setError('')
    setIsUploading(false)
    setUploadSuccess(false)
    onClose()
    toast.dismiss()
  }

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setError('')
  }

  const { mutate } = useMutation({
    mutationFn: (val: FormData) => {
      loadToast('Updating', '', 0, 'blue')
      return updateApp(app.id, val)
    },
    onSuccess: (data) => {
      if (data !== null) {
        setUploadSuccess(true)
        toast.dismiss()

        setTimeout(() => {
          handleClose()
        }, 1500)

        setIsUploading(false)
        reFresh()
      } else loadToast('Warning', 'Update failed', 3000, 'red')
    },
    onError: (err) => {
      loadToast('Warning', 'Update failed', 3000, 'red')
      console.error('Error updating application:', err)
    },
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Update Application
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Upload an image to serve as icon
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Success State */}
          {uploadSuccess && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Successful!
              </h3>
              <p className="text-gray-600">
                Your application is being updated...
              </p>
            </div>
          )}

          {/* Form */}
          {!uploadSuccess && (
            <form onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="mb-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : selectedFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!selectedFile ? (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drag and drop your icon file here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.gif,.webp"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Files
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                      Maximum file size: 10MB
                    </p>
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-white rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Icon</span>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {convertSizeToReadable(BigInt(selectedFile.size))}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Application Name */}
              <div className="mt-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Application Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Instagram"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* Comment */}
              <div className="mt-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Comment (Optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a description or notes about this application..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isUploading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    (name == app.name &&
                      comment == app.comment &&
                      !selectedFile) ||
                    isUploading
                  }
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Update
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
