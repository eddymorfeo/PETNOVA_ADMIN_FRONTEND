export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ClientItem = {
  id: string;
  email: string;
  password_hash?: string | null;
  full_name: string;
  phone: string | null;
  document_id: string | null;
  address: string | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ClientFormValues = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  documentId: string;
  address: string;
  isActive: boolean;
};

export type CreateClientPayload = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  documentId?: string;
  address?: string;
  isActive?: boolean;
};

export type UpdateClientPayload = Partial<{
  fullName: string;
  email: string;
  password: string;
  phone: string;
  documentId: string;
  address: string;
  isActive: boolean;
}>;

export type ClientResponse = ApiResponse<ClientItem>;
export type ClientListResponse = ApiResponse<ClientItem[]>;