import React, { useState } from 'react';
import AnnouncementOrderModal from './AnnouncementOrderModal';

const AnnouncementOrderModalExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // This function would be called when checking if the user can place an order
  const handleOrderAttempt = (announcementOwnerId, currentUserId) => {
    // If the user is trying to order their own announcement
    if (announcementOwnerId === currentUserId) {
      openModal();
      return false;
    }
    // Otherwise proceed with order
    return true;
  };

  return (
    <div>
      {/* This button is just for demonstration purposes */}
      <button 
        onClick={() => handleOrderAttempt('user123', 'user123')} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try to Place Order (Same User)
      </button>
      
      {/* This is the actual modal component */}
      <AnnouncementOrderModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default AnnouncementOrderModalExample; 