import type {
  AccountFormValues,
  AccountUser,
  AccountUserApi,
  UpdateAccountPayload,
} from "@/types/account/account.type";

export function mapAccountUserToFormValues(user: AccountUser): AccountFormValues {
  return {
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? "",
    password: "",
    confirmPassword: "",
  };
}

export function mapAccountFormToPayload(
  values: AccountFormValues,
): UpdateAccountPayload {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    password: values.password.trim() || undefined,
  };
}

export function mapAccountApiToAccountUser(user: AccountUserApi): AccountUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.full_name,
    phone: user.phone ?? "",
    isActive: user.is_active,
    createdBy: user.created_by ?? null,
    updatedBy: user.updated_by ?? null,
    createdAt: user.created_at ?? null,
    updatedAt: user.updated_at ?? null,
  };
}