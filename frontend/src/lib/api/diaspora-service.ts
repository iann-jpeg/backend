import { api } from './axios-instance';

export interface DiasporaRequest {
  id?: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  timezone: string;
  serviceInterest: string;
  scheduledAt?: string;
  status?: string;
  createdAt?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface DiasporaRequestsResponse {
  diasporaRequests: DiasporaRequest[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const diasporaService = {
  getAllDiasporaRequests: async (
    page = 1, limit = 20, status?: string, search?: string
  ): Promise<DiasporaRequestsResponse> => {
    const params: any = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await api.get('/admin/diaspora', { params });
    // Defensive: always return required properties
    const data = response.data as Partial<DiasporaRequestsResponse>;
    return {
      diasporaRequests: data.diasporaRequests || [],
      pagination: data.pagination || { page, limit, total: 0, totalPages: 1 }
    };
  },

  updateDiasporaRequestStatus: async (id: number, status: string) => {
    const response = await api.put(`/admin/diaspora/${id}/status`, { status });
    return response.data;
  },
};
