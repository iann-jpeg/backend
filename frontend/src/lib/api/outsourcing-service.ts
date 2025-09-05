import { api } from './axios-instance';

export interface OutsourcingRequest {
  organizationName: string;
  coreFunctions?: string;
  location: string;
  address?: string;
  email: string;
  services: string[];
  natureOfOutsourcing: 'full' | 'partial' | 'on-demand';
  budgetRange: string;
}

export const outsourcingService = {
  createOutsourcingRequest: async (data: OutsourcingRequest) => {
    const response = await api.post('/outsourcing', data);
    return response.data;
  },

  getOutsourcingRequests: async () => {
    const response = await api.get('/outsourcing');
    return response.data;
  },

  getOutsourcingRequest: async (id: number) => {
    const response = await api.get(`/outsourcing/${id}`);
    return response.data;
  },

  updateOutsourcingRequest: async (id: number, data: Partial<OutsourcingRequest>) => {
    const response = await api.patch(`/outsourcing/${id}`, data);
    return response.data;
  }
};
