import { Bounce, Id, toast } from "react-toastify";

let toastId: Id | null = null;

export const useNotification = () => {
  return {
    success: (message: string, theme: string) => {
      if (!toastId) {
        toastId = toast.success(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: theme,
          transition: Bounce,
          onClose: () => { toastId = null; }
        });
      } else {
        toast.update(toastId, {
          render: message,
          autoClose: 5000,
          theme: theme,
        });
      }
    },
    error: (message: string, theme: string) => {
      if (!toastId) {
        toastId = toast.error(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: theme,
          transition: Bounce,
          onClose: () => { toastId = null; }
        });
      } else {
        toast.update(toastId, {
          render: message,
          autoClose: 5000,
          theme: theme,
        });
      }
    },
    warning: (message: string, theme: string) => {
      if (!toastId) {
        toastId = toast.warn(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: theme,
          transition: Bounce,
          onClose: () => { toastId = null; }
        });
      } else {
        toast.update(toastId, {
          render: message,
          autoClose: 5000,
          theme: theme,
        });
      }
    },
    info: (message: string, theme: string) => {
      if (!toastId) {
        toastId = toast.info(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: theme,
          transition: Bounce,
          onClose: () => { toastId = null; }
        });
      } else {
        toast.update(toastId, {
          render: message,
          autoClose: 5000,
          theme: theme,
        });
      }
    },
  };
};
