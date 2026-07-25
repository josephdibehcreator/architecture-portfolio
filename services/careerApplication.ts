/**
 * Career API service
 * Handles all API calls related to career applications
 */

import { ApiResponse, getApiBaseUrl } from './api'

export interface CareerApplication {
  _id?: string
  fullName: string
  email: string
  phone?: string
  motivationLetter: string
  jobTitle: string
  cvUrl: string
  portfolioUrl?: string | null
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  createdAt?: string
  updatedAt?: string
}

export interface CreateApplicationData {
  fullName: string
  email: string
  phone?: string
  motivationLetter: string
  jobTitle: string
  cv: File
  portfolio?: File
  careerId?: string
}

/**
 * Create a new career application with file uploads
 */
export async function createApplication(
  data: CreateApplicationData
): Promise<ApiResponse<CareerApplication>> {
  const formData = new FormData()
  
  formData.append('fullName', data.fullName)
  formData.append('email', data.email)
  if (data.phone) {
    formData.append('phone', data.phone)
  }
  formData.append('motivationLetter', data.motivationLetter)
  formData.append('jobTitle', data.jobTitle)
  formData.append('cv', data.cv)
  
  if (data.portfolio) {
    formData.append('portfolio', data.portfolio)
  }

  if (data.careerId) {
    formData.append('careerId', data.careerId)
  }

  // Note: Using direct fetch for FormData uploads (api.ts helpers set Content-Type: JSON)
  // Use centralized API base URL from api.ts
  const API_BASE_URL = getApiBaseUrl()

  try {
    const response = await fetch(`${API_BASE_URL}/career`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for FormData
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP error! status: ${response.status}`,
        error: result.error || result.message,
      }
    }

    return {
      success: true,
      data: result.data || result,
      message: result.message,
    }
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export default {
  createApplication,
}
