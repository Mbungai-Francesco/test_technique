import { api, link } from '.'
import type {
  Application,
  ApplicationCreateDto,
  ApplicationUpdateDto,
} from '@/types'

const route = 'application'

export const createApp = async (app: FormData) => {
  try {
    const res = await api.post(`${link}/${route}`, app, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('message', res.statusText)
    return res.data as Application
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Get all applications
export const getAllApps = async () => {
  try {
    const res = await api.get(`${link}/${route}`)
    console.log('message', res.statusText)
    return res.data as Array<Application>
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Get all applications by user ID
export const getAppsByUser = async (userId: string) => {
  try {
    const res = await api.get(`${link}/${route}/user/${userId}`)
    console.log('message', res.statusText)    
    return res.data as Array<Application>
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Get a single application by ID
export const getAppById = async (id: string) => {
  try {
    const res = await api.get(`${link}/${route}/${id}`)
    console.log('message', res.statusText)
    return res.data as Application
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Download application file
export const downloadAppFile = async (id: string) => {
  try {
    const res = await api.get(`${link}/${route}/${id}/download`, {
      responseType: 'blob',
    })
    console.log('message', res.statusText)
    return res.data as Blob
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Update an application
export const updateApp = async (id: string, app: FormData) => {
  try {
    const res = await api.patch(`${link}/${route}/${id}`, app, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('message', res.statusText)
    return res.data as Application
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Delete an application by ID
export const deleteApp = async (id: string) => {
  try {
    const res = await api.delete(`${link}/${route}/${id}`)
    console.log('message', res.statusText)
    return true
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}

// Delete all applications by user ID
export const deleteAppsByUser = async (userId: string) => {
  try {
    const res = await api.delete(`${link}/${route}/user/${userId}`)
    console.log('message', res.statusText)
    return true
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}
