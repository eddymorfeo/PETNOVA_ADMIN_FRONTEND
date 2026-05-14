"use client";

import { toast } from "sonner";

type ProcessToastMessages<TResult> = {
  loading: string;
  success: string | ((result: TResult) => string);
  error: string;
  successDescription?: string | ((result: TResult) => string | undefined);
};

export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function withProcessToast<TResult>(
  action: () => Promise<TResult>,
  messages: ProcessToastMessages<TResult>,
) {
  const toastId = toast.loading(messages.loading);

  try {
    const result = await action();

    const successMessage =
      typeof messages.success === "function"
        ? messages.success(result)
        : messages.success;

    const successDescription =
      typeof messages.successDescription === "function"
        ? messages.successDescription(result)
        : messages.successDescription;

    toast.success(successMessage, {
      id: toastId,
      description: successDescription,
    });

    return result;
  } catch (error) {
    toast.error(messages.error, {
      id: toastId,
      description: getErrorMessage(error, messages.error),
    });

    throw error;
  }
}
