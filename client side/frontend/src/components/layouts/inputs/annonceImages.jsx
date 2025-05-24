import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaTrash, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

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

  return (
    <div className="space-y-4">
      {/* Image Counter */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">
          {images.length} of 8 images
        </span>
        <span className="text-xs text-gray-500">
          {8 - images.length} slots remaining
        </span>
      </div>

      {/* Image Grid with Upload Button */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Upload Button - Always First in Grid */}
        {images.length < 8 && (
          <div
            {...getRootProps()}
            className={`relative aspect-square group border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out
              ${isDragActive 
                ? 'border-teal-500 bg-teal-50/50' 
                : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50/50'
              } cursor-pointer`}
          >
            <input {...getInputProps()} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <div className="relative mb-2">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                  {isDragActive ? (
                    <FaCloudUploadAlt className="w-6 h-6 text-teal-500" />
                  ) : (
                    <FaImage className="w-6 h-6 text-teal-500" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              
              <p className="text-sm font-medium text-gray-700">
                {isDragActive ? "Drop here" : "Add photos"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click or drag
              </p>
            </div>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/5 rounded-xl transition-colors duration-300" />
          </div>
        )}

        {/* Image Previews */}
        {images.map((file, index) => (
          <div key={index} className="relative group aspect-square">
            <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              {previewErrors[index] ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <FaImage className="w-8 h-8 text-gray-300" />
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 transform"
              title="Remove image"
            >
              <FaTrash size={14} />
            </button>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </div>
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-400 text-center">
        <p>Supported: JPEG, PNG, GIF, WEBP • Max 8 images</p>
      </div>
    </div>
  );
};

export default AnnonceImages;
