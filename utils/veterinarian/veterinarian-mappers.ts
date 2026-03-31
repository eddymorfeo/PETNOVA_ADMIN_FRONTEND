import type {
  CreateVeterinarianPayload,
  UpdateVeterinarianPayload,
  VeterinarianFormValues,
  VeterinarianItem,
} from "@/types/veterinarian/veterinarian.type";

export function formatVeterinarianDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function mapVeterinarianToFormValues(
  item: VeterinarianItem,
): VeterinarianFormValues {
  return {
    userId: item.user_id,
    licenseNumber: item.license_number ?? "",
    specialtyId: item.specialty_id ?? "",
    isActive: item.is_active,
  };
}

export function mapCreateVeterinarianFormToPayload(
  values: VeterinarianFormValues,
): CreateVeterinarianPayload {
  return {
    userId: values.userId,
    licenseNumber: values.licenseNumber.trim() || undefined,
    specialtyId: values.specialtyId || undefined,
  };
}

export function mapUpdateVeterinarianFormToPayload(
  values: VeterinarianFormValues,
): UpdateVeterinarianPayload {
  return {
    userId: values.userId,
    licenseNumber: values.licenseNumber.trim() || undefined,
    specialtyId: values.specialtyId || undefined,
    isActive: values.isActive,
  };
}

export function buildVeterinarianStats(items: VeterinarianItem[]) {
  return {
    totalVeterinarians: items.length,
    activeVeterinarians: items.filter((item) => item.is_active).length,
  };
}