import type { AppState, VirusCheckStatus } from '.'

export interface Application {
  id: string
  userId: string
  hash: string
  icon?: Buffer
  filename: string
  fileSize: bigint
  mimeType: string
  name: string
  comment?: string
  virusCheckStatus: AppState
  scanResult?: VirusCheckStatus
  permalink?: string

  uploadDate: Date
  updatedAt: Date
}

export interface ApplicationCreateDto {
  userId: string
  filename: string
  fileSize: number
  fileData: File
  mimeType: string
  name: string
  comment?: string
}

export interface ApplicationUpdateDto {
  name?: string
  comment?: string
  icon?: Buffer
  virusCheckStatus: AppState
  scanResult?: VirusCheckStatus
  permalink?: string
}