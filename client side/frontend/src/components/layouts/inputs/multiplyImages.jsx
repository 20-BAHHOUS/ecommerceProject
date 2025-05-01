import React, { useRef, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid';

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

const Button = ({ children, ...props }) => {
    return <button {...props}>{children}</button>;
};

const MultipleImageSelector = ({ label = 'Upload Photos', name = 'images', maxImages = 5 }) => {
    const { setValue, watch } = useFormContext();
    const [previewURLs, setPreviewURLs] = useState([]);
    const fileInputRef = useRef(null);
    const watchedImages = watch(name);
    const hasImages = watchedImages && watchedImages.length > 0;

    useEffect(() => {
        if (watchedImages && Array.isArray(watchedImages)) {
            const newPreviews = watchedImages
                .filter(file => file instanceof File)
                .map(file => URL.createObjectURL(file));
            // Combine new previews with existing ones, ensuring no duplicates based on URL
            setPreviewURLs(prevURLs => {
                const existingURLs = new Set(prevURLs);
                const uniqueNewPreviews = newPreviews.filter(url => !existingURLs.has(url));
                const allUniqueURLs = [...prevURLs, ...uniqueNewPreviews];
                //revoke лишние
                return allUniqueURLs;
            });

             return () => {
                newPreviews.forEach(url => URL.revokeObjectURL(url));
            };
        } else if (!watchedImages) {
             previewURLs.forEach(url => URL.revokeObjectURL(url));
            setPreviewURLs([]);
        }
    }, [watchedImages]);



    const handleImageChange = (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            const currentFiles = watchedImages ? watchedImages.filter(img => !(img instanceof File)) : [];
            const allowedFiles = files.slice(0, Math.max(0, maxImages - currentFiles.length));
            const uniqueFilesToAdd = allowedFiles.filter(newFile =>
                !currentFiles.some(existingFile => existingFile.name === newFile.name)
            );
            const newImages = [...currentFiles, ...uniqueFilesToAdd];
            setValue(name, newImages);
            event.target.value = ''; 
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        const updatedFiles = [...(watchedImages || [])];
        const newPreviewURLs = [...previewURLs];
        const urlToRemove = newPreviewURLs[indexToRemove];


        updatedFiles.splice(indexToRemove, 1);
        setValue(name, updatedFiles);

        if (urlToRemove) {
            URL.revokeObjectURL(urlToRemove);
        }

        newPreviewURLs.splice(indexToRemove, 1);
        setPreviewURLs(newPreviewURLs);

    };

    const initialButtonClasses = cn(
        'relative',
        'border',
        'border-gray-300',
        'rounded-md',
        'p-4',
        'w-full',
        'flex',
        'justify-center',
        'items-center',
        'text-teal-500',
        'cursor-pointer',
        'transition-colors',
        'duration-200',
        'hover:border-teal-500',
        'hover:bg-teal-50',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-teal-500',
        'focus:ring-offset-2',
        'font-semibold',
    );

    const addButtonClasses = cn(
        'relative',
        'border',
        'border-gray-300',
        'rounded-md',
        'p-3',
        'w-32',
        'h-32',
        'flex',
        'justify-center',
        'items-center',
        'text-gray-500',
        'cursor-pointer',
        'transition-colors',
        'duration-200',
        'hover:border-indigo-500',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-indigo-500',
        'focus:ring-offset-2',
        'transform',
        'transition-transform',
        'duration-300',
        'hover:scale-105',
        'ml-4',
    );

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            {!hasImages ? (
                <div className="relative">
                    <Button
                        type="button"
                        className={initialButtonClasses}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <PlusIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                        <span>Upload photos</span>
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
            ) : (
                <div className="flex items-start space-x-4">
                    <div className="flex overflow-x-auto space-x-2">
                        {previewURLs.map((previewUrl, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'group relative',
                                    'w-32 h-32',
                                    'rounded-md',
                                    'shadow-sm',
                                    'overflow-hidden',
                                    'transition-transform',
                                    'duration-200',
                                    'hover:scale-105',
                                )}
                            >
                                <img
                                    src={previewUrl}
                                    alt={`preview-${index}`}
                                    className="object-cover w-full h-full"
                                />
                                <Button
                                    type="button"
                                    className={cn(
                                        'absolute top-1 right-1',
                                        'bg-gray-100 bg-opacity-75',
                                        'rounded-full p-1',
                                        'text-gray-500',
                                        'hover:text-gray-700',
                                        'focus:outline-none',
                                        'focus:ring-2',
                                        'focus:ring--500',
                                        'focus:ring-offset-2',
                                        'transition-opacity',
                                        'duration-200',
                                        'opacity-0',
                                        'group-hover:opacity-100',
                                        'transform',
                                        'transition-transform',
                                        'duration-200',
                                        'hover:scale-110',
                                    )}
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <XMarkIcon className="w-4 h-4" aria-hidden="true" />
                                </Button>
                            </div>
                        ))}
                        {previewURLs.length < maxImages && (
                            <Button
                                type="button"
                                className={addButtonClasses}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <PlusIcon className="w-8 h-8" aria-hidden="true" />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultipleImageSelector;
