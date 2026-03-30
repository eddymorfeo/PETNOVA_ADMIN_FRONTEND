export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PetClientOption = {
  id: string;
  full_name: string;
  document_id: string | null;
  email: string;
};

export type SpeciesOption = {
  id: string;
  name: string;
};

export type BreedOption = {
  id: string;
  name: string;
  species_id: string;
};

export type PetItem = {
  id: string;
  client_id: string;
  client?: PetClientOption | null;
  name: string;
  species_id: string;
  species?: SpeciesOption | null;
  breed_id: string | null;
  breed?: BreedOption | null;
  sex: string | null;
  birth_date: string | null;
  color: string | null;
  microchip: string | null;
  is_sterilized: boolean | null;
  allergies: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type PetFormValues = {
  clientId: string;
  clientLabel: string;
  name: string;
  speciesId: string;
  breedId: string;
  sex: string;
  birthDate: string;
  color: string;
  microchip: string;
  isSterilized: boolean;
  allergies: string;
  notes: string;
  isActive: boolean;
};

export type CreatePetPayload = {
  clientId: string;
  name: string;
  speciesId: string;
  breedId?: string;
  sex: string;
  birthDate: string;
  color?: string;
  microchip?: string;
  isSterilized?: boolean;
  allergies?: string;
  notes?: string;
  isActive?: boolean;
};

export type UpdatePetPayload = Partial<{
  clientId: string;
  name: string;
  speciesId: string;
  breedId: string;
  sex: string;
  birthDate: string;
  color: string;
  microchip: string;
  isSterilized: boolean;
  allergies: string;
  notes: string;
  isActive: boolean;
}>;

export type PetResponse = ApiResponse<PetItem>;
export type PetListResponse = ApiResponse<PetItem[]>;
export type ClientSearchResponse = ApiResponse<PetClientOption[]>;
export type SpeciesListResponse = ApiResponse<SpeciesOption[]>;
export type BreedListResponse = ApiResponse<BreedOption[]>;