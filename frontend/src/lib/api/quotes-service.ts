import { api } from './axios-instance';

export interface Quote {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location?: string;
  product: string;
  budget?: string;
  coverage?: string;
  details?: string;
  contactMethod: string;
  bestTime?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  documents?: Array<{
    id: number;
    originalName: string;
    [key: string]: any;
  }>;
}

export interface QuotesResponse {
  quotes: Quote[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
export const quotesService = {
  getAllQuotes: async (
    page = 1, limit = 20, status?: string, search?: string
  ): Promise<QuotesResponse> => {
    const params: any = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await api.get('/admin/quotes', { params });
    // Defensive: always return required properties
      const data = response.data as Partial<QuotesResponse>;
      return {
        quotes: data.quotes || [],
        pagination: data.pagination || { page, limit, total: 0, totalPages: 1 }
      };
  },
  // Add more quote-related methods as needed
};
