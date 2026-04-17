import toast from "react-hot-toast";

type ToastType = "success" | "error" | "loading";

export const showToast = (message: string, type: ToastType = "success") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "loading":
      toast.loading(message);
      break;
  }
};

export const successToast = (message: string) => showToast(message, "success");
export const errorToast = (message: string) => showToast(message, "error");
export const loadingToast = (message: string) => showToast(message, "loading");

// Async operation wrapper with toast
export const withToast = async <T,>(
  promise: Promise<T>,
  messages: {
    loading?: string;
    success?: string;
    error?: string;
  } = {}
): Promise<T | null> => {
  const {
    loading = "Processing...",
    success = "Success!",
    error = "Something went wrong",
  } = messages;

  const toastId = toast.loading(loading);

  try {
    const result = await promise;
    toast.success(success, { id: toastId });
    return result;
  } catch (err) {
    toast.error(error, { id: toastId });
    return null;
  }
};
