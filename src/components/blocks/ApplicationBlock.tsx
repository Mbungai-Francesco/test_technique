import { Loader2, Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import type { Application } from '@/types'
import { loadToast } from '@/lib/loadToast'
import { deleteApp } from '@/api/application'

interface props {
  app: Application
  chosen: () => void
  reFresh: () => void
}

const convertSizeToReadable = (size?: bigint) => {
  if (!size) return '0 B'

  const i = Math.floor(Math.log(Number(size)) / Math.log(1024))
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  return (Number(size) / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}

const ApplicationBlock = ({ app, chosen, reFresh }: props) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [del, setDelete] = useState(false)

  const { mutate } = useMutation({
    mutationFn: (val: string) => {
      setIsDeleting(true)
      loadToast('Deleting', '', 0, 'blue')
      return deleteApp(val)
    },
    onSuccess: (data) => {
      if (data == true) {
        toast.dismiss()

        loadToast('Success', 'Application deleted successfully', 3000, 'green')
        setIsDeleting(false)
        reFresh()
      } else loadToast('Warning', 'Deletion failed', 3000, 'red')
    },
    onError: (err) => {
      loadToast('Warning', 'Deletion failed', 3000, 'red')
      console.error('Error Deleting application:', err)
    },
  })

  return (
    <div className="w-full border-2 p-3 rounded-md hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex gap-3 items-center my-4">
        <img
          src={`data:image/webp;base64,${app.icon?.toString('base64')}`}
          alt="App Icon"
          style={{ width: '100px', height: '100px' }}
        />
        <p className="text-xl">
          Status : <span className="text-green-600">{app.scanResult}</span>
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl">{app.name}</p>
          <p className="text-sm text-gray-500">{app.filename}</p>
        </div>
        <div className='flex gap-1 items-center'>
          <Trash
            size={20}
            className="text-red-600 mr-4 hover:text-red-800"
            onClick={() => setDelete(true)}
          />
          <Pencil size={20} onClick={chosen} className=" mr-4 hover:text-black/50"/>
        </div>
      </div>
      <div className="w-full h-0 border border-b border-black/20 my-3"></div>

      <div>
        <p className="mb-2">Size : {convertSizeToReadable(app.fileSize)}</p>
        <p className="p-2 bg-black/10 rounded-md">
          {app.comment ? (
            app.comment
          ) : (
            <span className="text-gray-500">Add a comment</span>
          )}
        </p>
      </div>

      {/* Action Buttons */}
      {del && (
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => setDelete(false)}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={() => mutate(app.id)}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="w-5 h-5" />
                Delete
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ApplicationBlock
