import type {
  ClientFormValues,
  ClientItem,
  CreateClientPayload,
  UpdateClientPayload,
} from "@/types/clients/client.type";

export function mapClientToFormValues(client: ClientItem): ClientFormValues {
  return {
    fullName: client.full_name ?? "",
    email: client.email ?? "",
    password: "",
    phone: client.phone ?? "",
    documentId: client.document_id ?? "",
    address: client.address ?? "",
    isActive: client.is_active,
  };
}

export function mapCreateClientFormToPayload(
  values: ClientFormValues,
): CreateClientPayload {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    password: values.password,
    phone: values.phone.trim() || undefined,
    documentId: values.documentId.trim() || undefined,
    address: values.address.trim() || undefined,
    isActive: values.isActive,
  };
}

export function mapUpdateClientFormToPayload(
  values: ClientFormValues,
): UpdateClientPayload {
  const payload: UpdateClientPayload = {};

  if (values.fullName.trim()) {
    payload.fullName = values.fullName.trim();
  }

  if (values.email.trim()) {
    payload.email = values.email.trim();
  }

  if (values.password.trim()) {
    payload.password = values.password.trim();
  }

  if (values.phone.trim()) {
    payload.phone = values.phone.trim();
  }

  if (values.documentId.trim()) {
    payload.documentId = values.documentId.trim();
  }

  if (values.address.trim()) {
    payload.address = values.address.trim();
  }

  payload.isActive = values.isActive;

  return payload;
}