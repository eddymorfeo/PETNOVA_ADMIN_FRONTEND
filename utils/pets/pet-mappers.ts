import type {
  CreatePetPayload,
  PetClientOption,
  PetFormValues,
  PetItem,
  UpdatePetPayload,
} from "@/types/pets/pet.type";

export function buildClientLabel(client: PetClientOption | null | undefined): string {
  if (!client) return "";
  return `${client.full_name} - ${client.document_id ?? "Sin documento"}`;
}

export function mapPetToFormValues(pet: PetItem): PetFormValues {
  return {
    clientId: pet.client_id,
    clientLabel: buildClientLabel(pet.client ?? undefined),
    name: pet.name ?? "",
    speciesId: pet.species_id ?? "",
    breedId: pet.breed_id ?? "",
    sex: pet.sex ?? "",
    birthDate: pet.birth_date ?? "",
    color: pet.color ?? "",
    microchip: pet.microchip ?? "",
    isSterilized: Boolean(pet.is_sterilized),
    allergies: pet.allergies ?? "",
    notes: pet.notes ?? "",
    isActive: pet.is_active,
  };
}

export function mapCreatePetFormToPayload(values: PetFormValues): CreatePetPayload {
  return {
    clientId: values.clientId,
    name: values.name.trim(),
    speciesId: values.speciesId,
    breedId: values.breedId || undefined,
    sex: values.sex,
    birthDate: values.birthDate,
    color: values.color.trim() || undefined,
    microchip: values.microchip.trim() || undefined,
    isSterilized: values.isSterilized,
    allergies: values.allergies.trim() || undefined,
    notes: values.notes.trim() || undefined,
    isActive: values.isActive,
  };
}

export function mapUpdatePetFormToPayload(values: PetFormValues): UpdatePetPayload {
  const payload: UpdatePetPayload = {};

  if (values.clientId) payload.clientId = values.clientId;
  if (values.name.trim()) payload.name = values.name.trim();
  if (values.speciesId) payload.speciesId = values.speciesId;
  if (values.breedId) payload.breedId = values.breedId;
  if (values.sex) payload.sex = values.sex;
  if (values.birthDate) payload.birthDate = values.birthDate;
  if (values.color.trim()) payload.color = values.color.trim();
  if (values.microchip.trim()) payload.microchip = values.microchip.trim();
  payload.isSterilized = values.isSterilized;
  if (values.allergies.trim()) payload.allergies = values.allergies.trim();
  if (values.notes.trim()) payload.notes = values.notes.trim();
  payload.isActive = values.isActive;

  return payload;
}