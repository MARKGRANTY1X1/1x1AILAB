import React, { useState, useEffect } from 'react';
import { ToastMessage } from '../types';
import { CheckIcon, ArrowTopRightOnSquareIcon } from './Icons';

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

const getToastStyles = (type: ToastMessage['type']) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-100 dark:bg-green-900',
        border: 'border-green-400 dark:border-green-600',
        text: 'text-green-800 dark:text-green-200',
        icon: 'text-green-500',
      };
    case 'error':
      return {
        bg: 'bg-red-100 dark:bg-red-900',
        border: 'border-red-400 dark:border-red-600',
        text: 'text-red-800 dark:text-red-200',
        icon: 'text-red-500',
      };
    case 'info':
    default:
      return {
        bg: 'bg-blue-100 dark:bg-blue-900',
        border: 'border-blue-400 dark:border-blue-600',
        text: 'text-blue-800 dark:text-blue-200',
        icon: 'text-blue-500',
      };
  }
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const styles = getToastStyles(toast.type);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 400); // Wait for animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 400);
  };
  
  const animationClass = isExiting ? 'animate-[toast-out_0.4s_ease-out_forwards]' : 'animate-[toast-in_0.4s_ease-out_forwards]';

  return (
    <div
      className={`relative w-full ${styles.bg} border-l-4 ${styles.border} ${styles.text} p-4 pr-10 shadow-lg rounded-md flex items-start ${animationClass}`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${styles.icon}`}>
         <CheckIcon className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-medium flex-1">
        {toast.message}
        {toast.link && (
            <a 
              href={toast.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-2 inline-flex items-center font-bold hover:underline"
            >
                View Transaction <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1" />
            </a>
        )}
      </div>
      <button
        onClick={handleClose}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1 rounded-md hover:bg-black/10 focus:outline-none"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
