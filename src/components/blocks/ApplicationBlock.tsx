import { Pencil } from 'lucide-react'
import type { Application } from '@/types'

interface props {
  app: Application
  chosen: () => void
}

const convertBufferToBase64 = (buffer?: Buffer) => {
  if (!buffer) return undefined
  console.log('icon buffer', buffer)

  let binary = ''
  const bytes = new Uint8Array(buffer)
  console.log('icon bytes', bytes)

  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

const convertSizeToReadable = (size?: bigint) => {
  if (!size) return '0 B'

  const i = Math.floor(Math.log(Number(size)) / Math.log(1024))
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  return (Number(size) / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}

const ApplicationBlock = ({ app, chosen }: props) => {
  return (
    <div className="w-full border-2 p-3 rounded-md hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex gap-3 items-center my-4">
        <img
          // src={convertBufferToBase64(app.icon) || undefined}
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
        <Pencil size={20} onClick={chosen} />
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
    </div>
  )
}

export default ApplicationBlock
