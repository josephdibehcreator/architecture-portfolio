import { get, put, ApiResponse } from '../api'

export interface CareerAutoReplyTemplate {
  key: string
  subject: string
  bodyHtml: string
  bodyText?: string | null
  updatedAt?: string | null
  updatedBy?: {
    id: string
    email: string
  } | null
}

export async function getCareerAutoReplyTemplate(): Promise<ApiResponse<CareerAutoReplyTemplate>> {
  return get<CareerAutoReplyTemplate>('/admin/settings/career-auto-reply-template')
}

export async function updateCareerAutoReplyTemplate(
  data: Pick<CareerAutoReplyTemplate, 'subject' | 'bodyHtml' | 'bodyText'>
): Promise<ApiResponse<CareerAutoReplyTemplate>> {
  return put<CareerAutoReplyTemplate>('/admin/settings/career-auto-reply-template', data)
}

export default {
  getCareerAutoReplyTemplate,
  updateCareerAutoReplyTemplate,
}

