import React from "react";
import {PlusCircle, XCircle} from "lucide-react"

const MultipleImageSelector = ({ images, setImages, maxImages = 5 }) => {
  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + images.length > maxImages) {
        alert(`You can only add up ${maxImages} images maximum`);
        return;
      }
      setImages([...images, ...files]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div>
      <div className="flex flex-row relative gap-2 mb-4 cursor-pointer">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index}`}
              className="h-30 w-30 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-2"
            >
                
              <XCircle size={20} className="text-gray-500 hover:text-red-500" />
            </button>
            
          </div>
        ))}
      </div>

      {images.length < maxImages && (
        <label className="text-gray-600 text-sm mt-2 p-4 gap-2 mb-4 cursor-pointer flex items-center justify-center">
          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-lg relative">
            <PlusCircle size={20} className="text-gray-500" />
          </div>
          
          <input
            alt="preview"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full h-full object-cover rounded hidden"
          />
        </label>
      )}
    </div>
  );
};

export default MultipleImageSelector;