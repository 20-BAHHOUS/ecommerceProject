import React, { useState } from 'react';
import Modal from './Modal';
import { FaMoneyBillWave, FaTimes } from 'react-icons/fa';

const NegotiablePriceModal = ({ isOpen, onClose, onSubmit, originalPrice }) => {
  const [negotiablePrice, setNegotiablePrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validate the price
    if (!negotiablePrice || isNaN(negotiablePrice) || negotiablePrice <= 0) {
      setError('Please enter a valid price');
      return;
    }

    // Call the onSubmit function with the negotiable price
    onSubmit(parseFloat(negotiablePrice));
    
    // Clear the form and close the modal
    setNegotiablePrice('');
    setError('');
    onClose();
  };

  const handleNoNegotiation = () => {
    // User doesn't want to negotiate, place order without negotiation
    // Pass null to indicate no negotiation is needed
    onSubmit(null);
    
    // Clear the form and close the modal
    setNegotiablePrice('');
    setError('');
    onClose();
  };

  // Custom header with close button
  const customHeader = (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold text-teal-700">Begin Negotiation</h3>
      <button 
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <FaTimes size={20} />
      </button>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={null} // We're providing our own custom header
      buttonText={null} // We're providing custom buttons
    >
      {customHeader}

      <div className="flex flex-col items-center text-center mb-6">
        <div className="mb-4 text-teal-600">
          <FaMoneyBillWave size={48} />
        </div>
        <p className="text-gray-700 text-lg mb-4">
          Would you like to suggest a negotiable price to the seller?
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Original price: {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "DZD",
          }).format(originalPrice)}
        </p>
        
        <div className="w-full">
          <div className="mb-4">
            <label htmlFor="negotiablePrice" className="block text-sm font-medium text-gray-700 text-left mb-1">
              Your suggested price (DZD)
            </label>
            <input
              type="number"
              id="negotiablePrice"
              value={negotiablePrice}
              onChange={(e) => {
                setNegotiablePrice(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter amount in DZD"
            />
            {error && <p className="text-red-500 text-sm mt-1 text-left">{error}</p>}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between gap-4">
        <button
          onClick={handleNoNegotiation}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200"
        >
          No Negotiation
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 active:bg-teal-800 transition-all duration-200"
        >
          Send
        </button>
      </div>
    </Modal>
  );
};

export default NegotiablePriceModal; 