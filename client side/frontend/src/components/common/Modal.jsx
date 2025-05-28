import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children, buttonText = "OK" }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-teal-100"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {title && <h3 className="text-xl font-semibold mb-4 text-teal-700 border-b border-teal-100 pb-2">{title}</h3>}
        <div className="mb-6 text-gray-700">{children}</div>
        {buttonText !== null && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 active:bg-teal-800 transition-all duration-200 transform hover:scale-[1.02]"
            >
              {buttonText}
            </button>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

export default Modal; 