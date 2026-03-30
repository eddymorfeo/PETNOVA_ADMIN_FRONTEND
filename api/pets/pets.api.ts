import { apiClient } from "@/lib/http/api-client";
import type {
  BreedListResponse,
  ClientSearchResponse,
  CreatePetPayload,
  PetItem,
  PetListResponse,
  PetResponse,
  SpeciesListResponse,
  UpdatePetPayload,
  PetClientOption,
  SpeciesOption,
  BreedOption,
} from "@/types/pets/pet.type";

export async function fetchPets(): Promise<PetItem[]> {
  const response = await apiClient<PetListResponse>("/pets", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function createPet(payload: CreatePetPayload): Promise<PetItem> {
  const response = await apiClient<PetResponse>("/pets", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updatePet(
  petId: string,
  payload: UpdatePetPayload,
): Promise<PetItem> {
  const response = await apiClient<PetResponse>(`/pets/${petId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deletePet(petId: string): Promise<PetItem> {
  const response = await apiClient<PetResponse>(`/pets/${petId}`, {
    method: "DELETE",
    auth: true,
  });

  return response.data;
}

// export async function searchClients(query: string): Promise<PetClientOption[]> {
//   const response = await apiClient<ClientSearchResponse>(
//     `/clients/search?query=${encodeURIComponent(query)}`,
//     {
//       method: "GET",
//       auth: true,
//     },
//   );

//   return response.data;
// }

export async function fetchSpecies(): Promise<SpeciesOption[]> {
  const response = await apiClient<SpeciesListResponse>("/species", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function fetchBreeds(speciesId?: string): Promise<BreedOption[]> {
  const endpoint = speciesId
    ? `/breeds?speciesId=${encodeURIComponent(speciesId)}`
    : "/breeds";

  const response = await apiClient<BreedListResponse>(endpoint, {
    method: "GET",
    auth: true,
  });

  return response.data;
}