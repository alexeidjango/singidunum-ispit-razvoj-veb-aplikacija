import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import axios from "axios";

/**
 * Maps a DRF error response onto react-hook-form fields via setError.
 * Returns a form-level message (non_field_errors / detail) or null.
 */
export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): string | null {
  if (!axios.isAxiosError(error)) return null;

  const data = error.response?.data;
  if (!data || typeof data !== "object") return null;

  let formMessage: string | null = null;

  for (const [key, value] of Object.entries(data)) {
    if (key === "non_field_errors" && Array.isArray(value)) {
      formMessage = value[0] ?? null;
    } else if (key === "detail" && typeof value === "string") {
      formMessage = value;
    } else if (Array.isArray(value) && value.length > 0) {
      setError(key as Path<T>, { type: "server", message: value[0] });
    }
  }

  return formMessage;
}
