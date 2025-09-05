import { api } from './axios-instance';

export interface ConsultationRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterest: string;  // Changed from serviceType to match backend
  consultationDate: string;
  consultationTime: string;
  message: string;
  country: string;
  timezone: string;
  scheduledAt?: string;
}

export interface Consultation {
  id?: number;
  name: string;
  email: string;
  phone: string;
  country?: string;
  timezone?: string;
  scheduledAt?: string;
  status?: string;
  createdAt?: string;
  company?: string;
  consultationDate?: string;
  consultationTime?: string;
  message?: string;
  serviceInterest?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    profile?: {
      phone: string;
    };
  };
}
export interface ConsultationsResponse {
  consultations: Consultation[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
export const consultationsService = {
  createConsultation: async (data: ConsultationRequest) => {
    const mappedData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      timezone: data.timezone,
      serviceInterest: data.serviceInterest,
      message: data.message,
      scheduledAt: new Date(`${data.consultationDate}T${data.consultationTime}:00.000Z`).toISOString()
    };

    const response = await api.post<{ consultations: Consultation[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>('/consultations', mappedData);
    // Defensive: always return required properties
    return {
      consultations: response.data?.consultations || [],
      pagination: response.data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 }
    };
  },

  getAllConsultations: async (
    page = 1, limit = 20, status?: string, search?: string
  ): Promise<ConsultationsResponse> => {
    const params: any = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await api.get('/admin/consultations', { params });
      const data = response.data as Partial<ConsultationsResponse>;
      return {
        consultations: data.consultations || [],
        pagination: data.pagination || { page, limit, total: 0, totalPages: 1 }
      };
  },

  getConsultations: async () => {
    const response = await api.get('/consultations');
    return response.data;
  },

  getConsultation: async (id: number) => {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  },

  updateConsultation: async (id: number, data: Partial<ConsultationRequest>) => {
    const response = await api.patch(`/consultations/${id}`, data);
    return response.data;
  }
};
