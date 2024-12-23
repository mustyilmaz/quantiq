import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000); 

    return () => clearTimeout(timer); 
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded shadow-lg transition-transform transform ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
      style={{ zIndex: 1000, opacity: 1, transition: 'opacity 0.5s ease-in-out' }}
    >
      <p className="text-white">{message}</p>
      <button onClick={onClose} className="text-white mt-2 underline">
        Kapat
      </button>
    </div>
  );
};

export default Notification;