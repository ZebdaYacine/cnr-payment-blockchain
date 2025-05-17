import { Bounce, Id, toast } from "react-toastify";

let toastId: Id | null = null;

// A utility function to reset the toastId when the toast closes.
const resetToastId = () => {
  toastId = null;
};

// A function to show a toast notification with the provided settings.
const showToast = (
  message: string,
  theme: string,
  type: "success" | "error" | "warn" | "info"
) => {
  // Dismiss the previous toast (if any) before showing the new one.
  if (toastId) {
    toast.dismiss(toastId);
  }

  // Create a new toast and store the toastId.
  toastId = toast[type](message, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: theme,
    transition: Bounce,
    onClose: resetToastId, // Reset the toastId when the toast closes.
  });
};

export const useNotification = () => ({
  success: (message: string, theme: string) => {
    console.log("🟢 Success Toast Triggered:", message);
    showToast(message, theme, "success");
  },
  error: (message: string | null, theme: string) => {
    console.log("🔴 Error Toast Triggered:", message);
    showToast(message || "", theme, "error");
  },
  warning: (message: string, theme: string) => {
    console.log("🟠 Warning Toast Triggered:", message);
    showToast(message, theme, "warn");
  },
  information: (message: string, theme: string) => {
    console.log("🔵 Information Toast Triggered:", message);
    showToast(message, theme, "info");
  },
});
