/**
 * Admin API service
 * Handles all API calls related to admin authentication and dashboard
 */

import { get, post, ApiResponse , put} from '../api'

export interface Admin {
  id: string
  email: string
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  admin: Admin
}

export interface DashboardStats {
  counts: {
    projects: number
    testimonials: number
    inquiries: number
    paidBookings: number
    blogPosts: number
    newsPosts: number
    careerApplications: number
  }
  recentActivity: {
    inquiries: Array<{
      _id: string
      firstName: string
      lastName: string
      email: string
      status: string
      paymentStatus: string
      createdAt: string
    }>
    bookings: Array<{
      _id: string
      firstName: string
      lastName: string
      email: string
      amount: number | null
      paidAt: string
      createdAt: string
    }>
  }
  stripe: {
    totalRevenue: number
    lastPaymentStatus: string | null
    lastPaymentDate: string | null
  }
}

/**
 * Login admin
 */
export async function loginAdmin(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
  return post<LoginResponse>('/admin/auth/login', credentials)
}

/**
 * Logout admin
 */
export async function logoutAdmin(): Promise<ApiResponse<void>> {
  return post<void>('/admin/auth/logout', {})
}

/**
 * Get current admin info
 */
export async function getCurrentAdmin(): Promise<ApiResponse<{ admin: Admin }>> {
  return get<{ admin: Admin }>('/admin/auth/me')
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
  return post<{ accessToken: string }>('/admin/auth/refresh', {})
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return get<DashboardStats>('/admin/dashboard/stats')
}

/**
 * Update admin profile (email and/or password)
 */
export async function updateAdminProfile(payload: {
  email: string
  currentPassword: string
  newPassword?: string
}): Promise<ApiResponse<{ admin: Admin }>> {
  return put<{ admin: Admin }>('/admin/auth/profile', payload)
}

