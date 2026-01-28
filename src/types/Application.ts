import type { AppState, VirusCheckStatus } from '.'

export interface Application {
  id: string
  userId: string
  hash: string
  icon?: Buffer
  filename: string
  filePath: string
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
  hash: string
  filename: string
  filePath: string
  fileSize: bigint
  fileData: Buffer
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