import { confirmAlert } from 'react-confirm-alert';

export const showAlert = (message, buttonLabel = 'OK') => {
  confirmAlert({
    message,
    buttons: [
      {
        label: buttonLabel
      }
    ]
  });
};