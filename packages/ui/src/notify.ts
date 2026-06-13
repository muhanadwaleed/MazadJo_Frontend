import { toast as sonnerToast, type ExternalToast } from "sonner";

const DURATION = {
  success: 4000,
  info: 4000,
  validation: 5000,
  error: 6000,
} as const;

/**
 * MazadJo floating feedback — wraps Sonner with consistent timing per type.
 * Validation maps to Sonner `warning` (form fixes, missing fields).
 */
export const notify = {
  success(message: string, options?: ExternalToast) {
    return sonnerToast.success(message, {
      duration: DURATION.success,
      ...options,
    });
  },

  error(message: string, options?: ExternalToast) {
    return sonnerToast.error(message, {
      duration: DURATION.error,
      ...options,
    });
  },

  /** Form validation and recoverable input issues. */
  validation(message: string, options?: ExternalToast) {
    return sonnerToast.warning(message, {
      duration: DURATION.validation,
      ...options,
    });
  },

  info(message: string, options?: ExternalToast) {
    return sonnerToast.info(message, {
      duration: DURATION.info,
      ...options,
    });
  },

  loading(message: string, options?: ExternalToast) {
    return sonnerToast.loading(message, options);
  },

  dismiss: sonnerToast.dismiss,
  promise: sonnerToast.promise,
};

export { sonnerToast as toast };
