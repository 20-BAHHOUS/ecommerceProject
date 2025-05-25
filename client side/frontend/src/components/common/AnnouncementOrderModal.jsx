import React from 'react';
import Modal from './Modal';
import { FaExclamationCircle } from 'react-icons/fa';

const AnnouncementOrderModal = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Order Not Allowed"
      buttonText="OK"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 text-teal-600">
          <FaExclamationCircle size={48} />
        </div>
        <p className="text-gray-700 text-lg">
          You cannot place an order on your own announcement.
        </p>
      </div>
    </Modal>
  );
};

export default AnnouncementOrderModal; 