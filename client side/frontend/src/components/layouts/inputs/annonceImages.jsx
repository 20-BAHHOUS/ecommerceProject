import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaPlus, FaTrash, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { parseImages } from '../../../utils/parseImages';

const AnnonceImages = ({ setValue, watch }) => {
  const images = watch('images') || [];
  const [previewErrors, setPreviewErrors] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = [...images, ...acceptedFiles];
    if (newImages.length > 8) {
      toast.warning('Maximum 8 images allowed');
      setValue('images', newImages.slice(0, 8));
    } else {
      setValue('images', newImages);
    }
  }, [setValue, images]);

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setValue('images', newImages);
    
    // Also clear any error for this image
    if (previewErrors[indexToRemove]) {
      const newErrors = { ...previewErrors };
      delete newErrors[indexToRemove];
      setPreviewErrors(newErrors);
    }
  };

  const handleImageError = (index) => {
    setPreviewErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    maxFiles: 8
  });

  // Helper function to get image source URL
  const getImageSrc = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    } else if (typeof file === 'string') {
      return parseImages(file);
    }
    return null;
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(file => {
        if (file instanceof File && file._objectUrl) {
          URL.revokeObjectURL(file._objectUrl);
        }
      });
    };
  }, [images]);

  return (
    <div>
      {/* Image Grid with Upload Button */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Upload Button - Always First in Grid */}
        {images.length < 8 && (
          <div
            {...getRootProps()}
            className="h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <input {...getInputProps()} />
            <FaPlus className="text-gray-400 text-xl mb-2" />
            <span className="text-sm text-gray-500">Add Photo</span>
          </div>
        )}

        {/* Image Previews */}
        {images.map((file, index) => (
          <div key={index} className="relative h-32">
            <div className="w-full h-full rounded overflow-hidden bg-gray-100 border border-gray-200">
              {previewErrors[index] ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <FaImage className="text-gray-300 text-xl" />
                </div>
              ) : (
                <img
                  src={getImageSrc(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
              title="Remove image"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Simple Counter */}
      <div className="mt-2 text-sm text-gray-500 text-right">
        {images.length}/8 photos
      </div>
    </div>
  );
};

export default AnnonceImages;
