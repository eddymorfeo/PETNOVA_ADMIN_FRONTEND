import type {
  AccountFormValues,
  AccountUser,
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
    password: values.password?.trim() || undefined,
  };
}