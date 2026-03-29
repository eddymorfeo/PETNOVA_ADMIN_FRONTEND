import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserFormValues,
  UserItem,
} from "@/types/users/user.type";

export function mapUserToFormValues(user: UserItem): UserFormValues {
  return {
    username: user.username,
    email: user.email,
    fullName: user.full_name,
    phone: user.phone ?? "",
    password: "",
    isActive: user.is_active,
  };
}

export function mapCreateFormToPayload(values: UserFormValues): CreateUserPayload {
  return {
    username: values.username.trim(),
    email: values.email.trim(),
    fullName: values.fullName.trim(),
    phone: values.phone.trim() || undefined,
    password: values.password,
  };
}

export function mapUpdateFormToPayload(values: UserFormValues): UpdateUserPayload {
  return {
    username: values.username.trim(),
    email: values.email.trim(),
    fullName: values.fullName.trim(),
    phone: values.phone.trim() || "",
    password: values.password.trim() || undefined,
    isActive: values.isActive,
  };
}