import { Bounce, Id, toast } from "react-toastify";

let toastId: Id | null = null;

export const useNotification = () => {
  const resetToast = () => {
    toastId = null;
  };

  const showToast = (
    message: string,
    theme: string,
    type: "success" | "error" | "warn" | "info"
  ) => {
    if (!toastId) {
      toastId = toast[type](message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: theme,
        transition: Bounce,
        onClose: resetToast,
      });
    } else {
      toast.update(toastId, {
        render: message,
        autoClose: 5000,
        theme: theme,
      });
    }
  };

  return {
    success: (message: string, theme: string) => {
      console.log("🟢 Success Toast Triggered:", message);
      showToast(message, theme, "success");
    },
    error: (message: string | null, theme: string) => {
      console.log("🔴 Error Toast Triggered:", message);
      showToast(message || "", theme, "error");
    },
    warning: (message: string, theme: string) =>
      showToast(message, theme, "warn"),
    information: (message: string, theme: string) =>
      showToast(message, theme, "info"),
  };
};
