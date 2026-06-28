type ToastType = "success" | "error" | "info";

let toastHandler:
  | ((message: string, type?: ToastType) => void)
  | null = null;

/**
 * Enregistre la fonction showToast du ToastProvider.
 */
export function registerToastHandler(
  handler: (message: string, type?: ToastType) => void
) {
  toastHandler = handler;
}

/**
 * Permet d'afficher un toast depuis n'importe où
 * dans l'application.
 */
export function showGlobalToast(
  message: string,
  type: ToastType = "info"
) {
  toastHandler?.(message, type);
}