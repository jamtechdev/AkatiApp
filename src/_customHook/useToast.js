// useToast.js
import {useState} from 'react';
import {Toast} from '../components';

const useToast = () => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastDescription, setToastDescription] = useState('');
  const [toastDuration, setToastDuration] = useState(3000);
  const [type, setType] = useState('');

  const showToast = (message, type, description = '', duration = 3000) => {
    setToastMessage(message);
    setToastDescription(description);
    setToastDuration(duration);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, duration);
    setType(type);
  };

  const ToastComponent = (
    <Toast
      visible={toastVisible}
      message={toastMessage}
      description={toastDescription}
      duration={toastDuration}
      onHide={() => setToastVisible(false)}
      type={type}
    />
  );

  return [showToast, ToastComponent];
};

export default useToast;
