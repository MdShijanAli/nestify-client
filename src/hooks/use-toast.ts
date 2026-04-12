import { useCallback } from "react";
import { toast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const showToast = useCallback((props: ToastProps) => {
    const { title, description, variant } = props;
    const message = title
      ? `${title}${description ? " - " + description : ""}`
      : description;

    if (variant === "destructive") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  }, []);

  return {
    toast: showToast,
  };
}
