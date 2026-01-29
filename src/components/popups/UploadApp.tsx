import { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  File,
  Loader2,
  Upload,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import type { ApplicationCreateDto } from '@/types'
import { useAppContext } from '@/hooks/useAppContext'
import { loadToast } from '@/lib/loadToast'
import { createApp } from '@/api/application'

interface props {
  isOpen: boolean
  onClose: () => void
  reFresh: () => void
}

export const UploadApp = ({ isOpen, onClose, reFresh }: props) => {
  const { id } = useAppContext()

  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')

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
    if (!file.name.endsWith('.apk')) {
      setError('Please select a valid APK file')
      return
    }

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB')
      return
    }

    setSelectedFile(file)
    setName(file.name.replace('.apk', ''))
    setError('')
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('Please select a file')
      return
    }

    setIsUploading(true)
    setError('')

    const formData = new FormData();
    formData.append('fileData', selectedFile);
    formData.append('name', name);
    formData.append('comment', comment);
    formData.append('userId', id);
    formData.append('filename', selectedFile.name);
    formData.append('fileSize', selectedFile.size.toString());
    formData.append('mimeType', selectedFile.type);

    // const newApp: ApplicationCreateDto = {
    //   name,
    //   comment,
    //   userId: id,
    //   fileData:  selectedFile,
    //   filename: selectedFile.name,
    //   fileSize: selectedFile.size,
    //   mimeType: selectedFile.type,
    //   // file will be handled in the backend via FormData
    // }

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
    setName('')
    setError('')
  }

  const { mutate } = useMutation({
    mutationFn: (val: FormData) => {
      loadToast('Uploading', '', 0, 'blue')
      return createApp(val)
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
      } else loadToast('Warning', 'Upload failed', 3000, 'red')
    },
    onError: (err) => {
      loadToast('Warning', 'Upload failed', 3000, 'red')
      console.error('Error uploading application:', err)
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
                Upload Application
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Upload an APK file to scan for malware
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
                Your application is being scanned...
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
                      Drag and drop your APK file here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".apk"
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
                      Maximum file size: 100MB
                    </p>
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-white rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <File className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
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

              {/* Info Box */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Automatic Scanning</p>
                    <p>
                      Your application will be automatically scanned using
                      VirusTotal's 68+ antivirus engines. This may take a few
                      minutes.
                    </p>
                  </div>
                </div>
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
                  disabled={!selectedFile || isUploading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload & Scan
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
