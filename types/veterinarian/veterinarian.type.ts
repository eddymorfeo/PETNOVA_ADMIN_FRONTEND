export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type VeterinarianItem = {
  id: string;
  user_id: string;
  license_number: string | null;
  specialty_id: string | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  username: string;
  email: string;
  full_name: string;
  phone: string | null;
  specialty_code: string | null;
  specialty_name: string | null;
  specialty_description: string | null;
};

export type VeterinarianUserOption = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone: string | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type VeterinarianSpecialtyOption = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type VeterinarianFormValues = {
  userId: string;
  licenseNumber: string;
  specialtyId: string;
  isActive: boolean;
};

export type CreateVeterinarianPayload = {
  userId: string;
  licenseNumber?: string;
  specialtyId?: string;
};

export type UpdateVeterinarianPayload = {
  userId?: string;
  licenseNumber?: string;
  specialtyId?: string;
  isActive?: boolean;
};

export type VeterinarianListResponse = ApiResponse<VeterinarianItem[]>;
export type VeterinarianResponse = ApiResponse<VeterinarianItem>;
export type VeterinarianUsersResponse = ApiResponse<VeterinarianUserOption[]>;
export type VeterinarianSpecialtiesResponse = ApiResponse<VeterinarianSpecialtyOption[]>;