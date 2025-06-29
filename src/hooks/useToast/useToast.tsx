// hooks/useToast.ts
import { useIonToast } from '@ionic/react';

type ToastPosition = 'top' | 'bottom' | 'middle';

const useToast = () => {
  const [present, dismiss] = useIonToast();

  const showToast = (
    message: string,
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary',
    position: ToastPosition = 'bottom'
  ) => {
    present({
      message,
      color,
      duration: 5000,
      position,
      buttons: [{ text: 'okay', handler: () => dismiss() }]
    });
  };

  // Convenience methods with preset colors
  const showError = (message: string, position?: ToastPosition) => showToast(message, 'danger', position);
  const showSuccess = (message: string,position?: ToastPosition ) => showToast(message, 'success',position);
  const showWarning = (message: string, position?: ToastPosition) => showToast(message, 'warning',position);
  const showInfo = (message: string, position?: ToastPosition) => showToast(message, 'primary',position);

  return { 
    showToast,
    showError,
    showSuccess, 
    showWarning,
    showInfo
  };
};

export default useToast;