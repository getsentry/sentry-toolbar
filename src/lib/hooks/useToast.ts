import {useContext} from 'react';
import {ToastContext} from 'toolbar/context/ToastContext';

export default function useToast() {
  return useContext(ToastContext);
}
