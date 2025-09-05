
import { api } from './axios-instance';
import type { Consultation, ConsultationRequest } from './consultations-service';

export const adminService = {
  // ============= NOTIFICATIONS & SYSTEM STATS =============
  async getNotifications() {
    // Use the admin endpoint for fetching notifications
    return api.get('/admin/notifications');
  },

  async getUserStats() {
    // Use the admin endpoint for fetching user stats
    return api.get('/admin/users/stats');
  },
  async getConsultationById(id: number) {
    // Use the admin endpoint for fetching a single consultation
    const response = await api.get(`/admin/consultations/${id}`);
    return response.data;
  },

  async updateConsultationStatus(id: number, status: string) {
    // Use the admin endpoint for updating consultation status
    const response = await api.put(`/admin/consultations/${id}/status`, { status });
    return response.data;
  },

  async scheduleMeeting(id: number, scheduleData: any) {
    // Use the admin endpoint for scheduling a meeting
    const response = await api.post(`/admin/consultations/${id}/schedule`, scheduleData);
    return response.data;
  },

  async sendWhatsAppMeetingDetails(id: number, options: { includeLink?: boolean; message?: string }) {
    // Use the admin endpoint for sending WhatsApp meeting details
    const response = await api.post(`/admin/consultations/${id}/send-whatsapp`, options);
    return response.data;
  },

  // ============= QUOTES MANAGEMENT =============
  async updateQuoteStatus(id: number, status: string): Promise<{ success: boolean; error?: string }> {
    const response = await api.put(`/admin/quotes/${id}/status`, { status });
    const data = response.data;
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as { success: boolean; error?: string };
    }
    return { success: false, error: 'Invalid response from server' };
  },

  async deleteQuote(id: number): Promise<{ success: boolean; error?: string }> {
    const response = await api.delete(`/admin/quotes/${id}`);
    const data = response.data;
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as { success: boolean; error?: string };
    }
    return { success: false, error: 'Invalid response from server' };
  },

  async exportData(entity: 'quotes', format: 'csv' | 'json') {
    // Use the admin endpoint for exporting quotes data
    const response = await api.get(`/admin/quotes/export/${format}`, { responseType: 'blob' });
    return response;
  },

  async downloadDocument(documentId: number, originalName: string) {
    // Download a document attached to a quote (assuming endpoint exists)
    const response = await api.get(`/uploads/quotes/${documentId}`, { responseType: 'blob' });
    // Trigger download in browser
  const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
    const a = document.createElement('a');
    a.href = url;
    a.download = originalName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return true;
  }
};
