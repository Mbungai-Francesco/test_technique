import { Pencil } from "lucide-react";
import type { Application } from "@/types"

const convertBufferToBase64 = (buffer ?: Buffer) => {
  if(!buffer) return '';

  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

const convertSizeToReadable = (size ?: bigint) => {
  if(!size) return '0 B';

  const i = Math.floor(Math.log(Number(size)) / Math.log(1024));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  return (Number(size) / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

const ApplicationBlock = (app ?: Application) => {
  return (
    <div className="w-full border-2 p-3 rounded-md hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex gap-3 items-center my-4">
        <img src={convertBufferToBase64(app?.icon)} alt="icon" />
        <p className="text-xl">Status : <span className="text-green-600">{app?.scanResult}</span></p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl">{app?.name}</p>
          <p className="text-sm text-gray-500">{app?.filename}</p>
        </div>
        <Pencil size={20}/>
      </div>
      <div className="w-full h-0 border border-b border-black/20 my-3"></div>

      <div>
        <p className="mb-2">Size : {convertSizeToReadable(app?.fileSize)}</p>
        <p className="p-2 bg-black/10 rounded-md">
          {(app?.comment) ? (app.comment) : 
            <span className="text-gray-500">Add a comment</span>}
        </p>
      </div>
    </div>
  )
}

export default ApplicationBlock