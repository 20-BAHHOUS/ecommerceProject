// components/screens/EditAnnonce.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API_PATHS from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import AnnonceImages from "../../components/layouts/inputs/annonceImages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateAnnonceValidator } from "../../lib/validators/annonce.validator";
import { toast } from "react-toastify";
import MultiLevelNavbar from "../../components/layouts/inputs/navBarCategories";
import {
  FaArrowLeft,
  FaSpinner,
  FaCheck,
  FaSearch,
  FaTimes
} from "react-icons/fa";
import Header from "../../components/layouts/inputs/header";
import Footer from "../../components/layouts/inputs/footer";

const EditAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const searchRef = useRef(null);

  const {
    handleSubmit,
    register,
    formState: { errors},
    setValue,
    watch,
    reset,
    trigger
  } = useForm({
    resolver: zodResolver(CreateAnnonceValidator),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: "",
      images: [],
      category: "",
      subcategory: "",
      type: "",
      condition: "",
    },
  });

  // Watch for changes in the images field
  const images = watch("images");

  // Add a watch for the type field to conditionally render form elements
  const selectedType = watch("type");

  // Update form values when type changes
  useEffect(() => {
    if (selectedType === "wanted") {
      // For wanted type, set default values for fields that aren't required
      setValue("price", 0);
      setValue("category", "");
      setValue("subcategory", "");
      setValue("condition", "");
    }
  }, [selectedType, setValue]);

  useEffect(() => {
    setUploadedImages(images || []);
  }, [images]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.CATEGORIES.GET_ALL);
        if (response.data.success) {
          // Create a flattened list of all categories and subcategories
          const allCategories = [];
          response.data.data.forEach(category => {
            allCategories.push({
              id: category._id,
              name: category.name,
              isSubcategory: false,
              parentId: null
            });
            
            if (category.subcategories && category.subcategories.length > 0) {
              category.subcategories.forEach(subcategory => {
                allCategories.push({
                  id: subcategory._id,
                  name: `${category.name} > ${subcategory.name}`,
                  displayName: subcategory.name,
                  isSubcategory: true,
                  parentId: category._id,
                  parentName: category.name
                });
              });
            }
          });
          
          setCategories(allCategories);
          setFilteredCategories(allCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, categories]);

  // Fetch announcement details
  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.ANNONCE.ANNONCE_BY_ID(id));
        const annonce = response.data;
        
        // Set form values
        reset({
          title: annonce.title,
          description: annonce.description,
          price: annonce.price,
          category: annonce.category,
          subcategory: annonce.subcategory,
          type: annonce.type,
          condition: annonce.condition,
        });

        // Set images
        if (annonce.images && annonce.images.length > 0) {
          setValue('images', annonce.images);
        }

        // Find the category and subcategory in our flattened list
        const foundSubcategory = categories.find(cat => 
          cat.isSubcategory && cat.id === annonce.subcategory
        );
        
        if (foundSubcategory) {
          setSelectedCategory(foundSubcategory.id);
          setSelectedCategoryName(foundSubcategory.name);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcement:", error);
        toast.error("Failed to load announcement");
        navigate("/userannonces");
      }
    };

    if (categories.length > 0) {
      fetchAnnonce();
    }
  }, [id, reset, setValue, navigate, categories]);

  const handleCategorySelect = (category) => {
    // Only allow selecting subcategories
    if (!category.isSubcategory) {
      return;
    }
    
    setSelectedCategory(category.id);
    setSelectedCategoryName(category.name);
    
    // Set both category and subcategory fields
    setValue("category", category.parentId);
    setValue("subcategory", category.id);
    
    setShowDropdown(false);
    setSearchQuery("");
    
    // Trigger validation after setting values
    trigger(["category", "subcategory"]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const clearSelection = () => {
    setSelectedCategory(null);
    setSelectedCategoryName("");
    setValue("category", "");
    setValue("subcategory", "");
    trigger(["category", "subcategory"]);
  };

  const onSubmit = async (data) => {
    // For validation checks
    if (data.type !== "wanted") {
      // Validate category and subcategory for non-wanted types
      if (!data.category || !data.subcategory) {
        toast.error("Please select a subcategory for your listing");
        return;
      }
      
      // Validate price for non-wanted types
      if (!data.price) {
        toast.error("Please enter a price for your listing");
        return;
      }
      
      // Validate condition for non-wanted types
      if (!data.condition) {
        toast.error("Please select a condition for your listing");
        return;
      }
    } else {
      // For wanted type, ensure these fields have valid values for the backend
      data.price = 0;
      data.category = null;
      data.subcategory = null;
      data.condition = null;
    }
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append all form fields
      Object.keys(data).forEach((key) => {
        if (key !== "images") {
          // Skip null fields to avoid "null" strings being sent
          if (data[key] !== null) {
            formData.append(key, data[key]);
          }
        }
      });

      // Handle images
      if (data.images) {
        // Separate existing images (string URLs) from new uploads (File objects)
        const existingImages = [];
        const newImages = [];
        
        data.images.forEach((image) => {
          if (image instanceof File) {
            newImages.push(image);
          } else if (typeof image === 'string') {
            existingImages.push(image);
          }
        });
        
        // Add existing images as JSON string
        if (existingImages.length > 0) {
          formData.append("existingImages", JSON.stringify(existingImages));
        }
        
        // Add new images as files
        newImages.forEach(file => {
          formData.append("images", file);
        });
      }

      const response = await axiosInstance.put(
        API_PATHS.ANNONCE.ANNONCE_BY_ID(id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Listing updated successfully!");
        navigate("/userannonces");
      } else {
        toast.error(response.data.message || "Error updating listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error(error.response?.data?.message || "Failed to update listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <FaSpinner className="animate-spin text-5xl text-teal-600 mb-4" />
        <p className="text-xl text-gray-600">Loading announcement details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <MultiLevelNavbar />
      <div className="flex-grow container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link
                to="/userannonces"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2" />
                Back to My Listings
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 mt-1">Edit Listing</h1>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-5 space-y-4">
                {/* Photos Section */}
                <div>
                  <div className="mb-2">
                    <h3 className="text-base font-medium text-gray-900">Photos</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <AnnonceImages setValue={setValue} watch={watch} annonceId={id} />
                  </div>
                </div>

                {/* Type Select - Moved up before other fields */}
                <div>
                  <div className="mb-2">
                    <h3 className="text-base font-medium text-gray-900">Item Type</h3>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <div className="relative">
                      <select
                        className={`block w-full pl-3 pr-10 py-2 text-base border ${
                          errors?.type?.message ? 'border-red-300' : 'border-gray-300'
                        } focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none bg-white`}
                        {...register("type", { required: true })}
                      >
                        <option value="">Select type</option>
                        <option value="sale">For Sale</option>
                        <option value="trade">For Trade</option>
                        <option value="rent">For Rent</option>
                        <option value="wanted">Wanted</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {errors?.type?.message && (
                      <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
                    )}
                  </div>
                </div>

                {/* Title and Price */}
                <div>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Title Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        className={`block w-full px-3 py-2 border ${
                          errors?.title?.message ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="What are you selling?"
                        {...register("title", { required: true })}
                      />
                      {errors?.title?.message && (
                        <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
                      )}
                    </div>
                    
                    {/* Price Input - Only show if NOT Wanted type */}
                    {selectedType !== "wanted" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (DZD)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">DZD</span>
                          </div>
                          <input
                            type="number"
                            className={`block w-full pl-12 pr-3 py-2 border ${
                              errors?.price?.message ? 'border-red-300' : 'border-gray-300'
                            } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="0.00"
                            {...register("price", { required: selectedType !== "wanted", valueAsNumber: true })}
                          />
                        </div>
                        {errors?.price?.message && (
                          <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Category Section with Search - Only show if NOT Wanted type */}
                {selectedType !== "wanted" && (
                  <div>
                    <div className="mb-2">
                      <h3 className="text-base font-medium text-gray-900">Category</h3>
                    </div>
                    
                    <div className="relative" ref={searchRef}>
                      {/* Category search input */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSearch className="h-4 w-4 text-gray-400" />
                        </div>
                        
                        <input
                          type="text"
                          className={`block w-full pl-10 pr-10 py-2 border ${
                            errors?.category?.message || errors?.subcategory?.message ? 'border-red-300' : 'border-gray-300'
                          } rounded focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Search for a subcategory"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() => setShowDropdown(true)}
                        />
                        
                        {selectedCategoryName && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                              type="button"
                              onClick={clearSelection}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <FaTimes className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Selected category display */}
                      {selectedCategoryName && (
                        <div className="mt-2 flex">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-sm text-blue-800">
                            {selectedCategoryName}
                          </span>
                        </div>
                      )}
                      
                      {/* Simplified Dropdown for autocomplete */}
                      {showDropdown && filteredCategories.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow max-h-56 rounded overflow-auto border border-gray-200">
                          {filteredCategories.map((category) => (
                            <div
                              key={category.id}
                              className={`${
                                category.isSubcategory 
                                  ? 'cursor-pointer px-3 py-2 hover:bg-gray-100 pl-6 border-t border-gray-100' 
                                  : 'px-3 py-2 bg-gray-50 font-medium text-gray-700'
                              } ${selectedCategory === category.id ? 'bg-blue-50' : ''}`}
                              onClick={() => category.isSubcategory && handleCategorySelect(category)}
                            >
                              {category.isSubcategory ? (
                                <span className="flex items-center text-sm">
                                  <span className="text-gray-400 mr-1">›</span>
                                  {category.displayName}
                                  <span className="ml-1 text-xs text-gray-400">({category.parentName})</span>
                                </span>
                              ) : (
                                <span>{category.name}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {(errors?.category?.message || errors?.subcategory?.message) && (
                        <p className="mt-1 text-xs text-red-600">
                          Please select a subcategory
                        </p>
                      )}
                      
                      {/* Hidden inputs for validation */}
                      <input
                        type="hidden"
                        {...register("category", { required: selectedType !== "wanted" })}
                      />
                      <input
                        type="hidden"
                        {...register("subcategory", { required: selectedType !== "wanted" })}
                      />
                    </div>
                  </div>
                )}

                {/* Condition Select - Only show if NOT Wanted type */}
                {selectedType !== "wanted" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <div className="relative">
                      <select
                        className={`block w-full pl-3 pr-10 py-2 text-base border ${
                          errors?.condition?.message ? 'border-red-300' : 'border-gray-300'
                        } focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none bg-white`}
                        {...register("condition", { required: selectedType !== "wanted" })}
                      >
                        <option value="">Select condition</option>
                        <option value="new">New with tags</option>
                        <option value="like new">Like new</option>
                        <option value="good condition">Good condition</option>
                        <option value="acceptable">Acceptable</option>
                        <option value="not working">For parts/Not working</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {errors?.condition?.message && (
                      <p className="mt-1 text-xs text-red-600">{errors.condition.message}</p>
                    )}
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className={`block w-full px-3 py-2 border ${
                      errors?.description?.message ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Describe your item (condition, size, brand, etc.)"
                    rows={4}
                    {...register("description", { required: false })}
                  ></textarea>
                  {errors?.description?.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
              
              <div className="px-5 py-3 bg-gray-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/userannonces")}
                  className="px-5 py-2 mr-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || 
                    !watch("title") || 
                    (selectedType !== "wanted" && (!watch("category") || !watch("subcategory") || !watch("condition") || !watch("price")))
                  }
                  className={`flex items-center px-5 py-2 rounded-md text-white transition-all duration-200 ${
                    isSubmitting || 
                    !watch("title") || 
                    (selectedType !== "wanted" && (!watch("category") || !watch("subcategory") || !watch("condition") || !watch("price")))
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      {selectedType === "wanted" ? "Update Wanted Ad" : selectedType === "sale" ? "Update For Sale" : 
                       selectedType === "trade" ? "Update For Trade" : selectedType === "rent" ? "Update For Rent" : "Save Changes"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditAnnonce;
