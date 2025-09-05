import { api } from './axios-instance';

export interface Claim {
  id?: number;
  policyNumber: string;
  claimType: string;
  incidentDate: string;
  estimatedLoss: number;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status?: string;
  documents?: string[];
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ClaimsResponse {
  claims: Claim[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
export const claimsService = {
  getAllClaims: async (
    page = 1, limit = 20, status?: string, search?: string
  ): Promise<ClaimsResponse> => {
    const params: any = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await api.get('/admin/claims', { params });
    // Defensive: always return required properties
    const data = response.data as any;
    // If backend returns { claims, pagination } (like quotes), use that
    if (data && data.claims && data.pagination) {
      return {
        claims: data.claims,
        pagination: data.pagination
      };
    }
    // If backend returns { data: { claims, pagination } }
    if (data && data.data && data.data.claims && data.data.pagination) {
      return {
        claims: data.data.claims,
        pagination: data.data.pagination
      };
    }
    // Fallback
    return {
      claims: [],
      pagination: { page, limit, total: 0, totalPages: 1 }
    };
  },
  getClaimById: async (id: number) => {
    const response = await api.get(`/admin/claims/${id}`);
    return response.data;
  },
  updateClaimStatus: async (id: number, status: string) => {
    const response = await api.put(`/admin/claims/${id}/status`, { status });
    return response.data;
  },
};
