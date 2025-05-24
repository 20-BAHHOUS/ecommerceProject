import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import AnnonceImages from "../../components/layouts/inputs/annonceImages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateAnnonceValidator } from "../../lib/validators/annonce.validator";
import Input from "../../components/layouts/inputs/input";
import TextArea from "../../components/layouts/inputs/TextArea";
import Select from "../../components/layouts/inputs/select";
import { toast } from "react-toastify";
import {
  FaTag,
  FaImage,
  FaList,
  FaBoxOpen,
  FaMoneyBillWave,
  FaArrowLeft,
  FaSpinner,
  FaCheck,
  FaChevronRight
} from "react-icons/fa";
import Navbar from "../../components/layouts/inputs/header";
import Footer from "../../components/layouts/inputs/footer";

const PostAd = () => {
  const Navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(CreateAnnonceValidator),
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
    mode: "onChange"
  });

  // Watch for changes in the images field
  const images = watch("images");

  useEffect(() => {
    setUploadedImages(images || []);
  }, [images]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.CATEGORIES.GET_ALL);
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(cat => cat._id === selectedCategory);
      if (category && category.subcategories) {
        setSubcategories(category.subcategories);
        setValue("subcategory", "");
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categories, setValue]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setValue("category", categoryId);
  };

  async function onSubmit(data) {
    // Validate images first
    if (!data.images || data.images.length === 0) {
      toast.error("Please add at least one image to your listing");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!data.category || !data.subcategory) {
        toast.error("Please select both a category and subcategory");
        return;
      }

      const formData = new FormData();
      data.images.forEach((image) => {
        formData.append("images", image);
      });
      
      Object.keys(data).forEach((key) => {
        if (key !== "images") {
          formData.append(key, data[key]);
        }
      });

      const response = await axiosInstance.post(
        API_PATHS.ANNONCE.ADD_GET_ANNONCE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.data.success) {
        toast.success("Your listing has been posted successfully!");
        Navigate("/home");
      } else {
        toast.error(response.data.message || "Error creating listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      const errorMessage = error.response?.data?.errors?.subcategory || 
                         error.response?.data?.message || 
                         "Error creating listing";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                to="/home"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2" />
                Back to Marketplace
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900 mt-2">Create New Listing</h1>
              <p className="text-sm text-gray-500">Add details about what you're selling</p>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6 space-y-6">
                {/* Photos Section */}
                <div className="border-b pb-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Add Photos</h3>
                    <p className="text-sm text-gray-500">Add up to 10 photos - first one will be the cover</p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-5 border border-dashed border-gray-300">
                    <AnnonceImages setValue={setValue} watch={watch} />
                    <div className="mt-3 text-xs text-gray-500">
                      <p>• Clear photos from multiple angles get more attention</p>
                      <p>• Make sure lighting is good and items are clearly visible</p>
                    </div>
                  </div>
                </div>

                {/* Title and Price */}
                <div className="border-b pb-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Input
                      label="Title"
                      placeholder="What are you selling?"
                      error={errors?.title?.message}
                      {...register("title", { required: true })}
                    />
                    <Input
                      label="Price (DZD)"
                      placeholder="Enter your price"
                      type="number"
                      error={errors?.price?.message}
                      {...register("price", { required: true, valueAsNumber: true })}
                    />
                  </div>
                </div>
                
                {/* Category Section */}
                <div className="border-b pb-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Category</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Category"
                      defaultOption="Select category"
                      options={categories.map(cat => ({
                        value: cat._id,
                        label: cat.name
                      }))}
                      error={errors?.category?.message}
                      {...register("category", { 
                        required: true,
                        onChange: handleCategoryChange
                      })}
                    />
                    <Select
                      label="Subcategory"
                      defaultOption="Select subcategory"
                      options={subcategories.map(sub => ({
                        value: sub._id,
                        label: sub.name
                      }))}
                      error={errors?.subcategory?.message}
                      disabled={!selectedCategory}
                      {...register("subcategory", { required: true })}
                    />
                  </div>
                </div>

                {/* Condition and Type */}
                <div className="border-b pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Condition"
                      defaultOption="Select item condition"
                      options={[
                        { value: "new", label: "New with tags" },
                        { value: "like new", label: "Like new" },
                        { value: "good condition", label: "Good condition" },
                        { value: "acceptable", label: "Acceptable" },
                        { value: "not working", label: "For parts/Not working" },
                      ]}
                      error={errors?.condition?.message}
                      {...register("condition", { required: true })}
                    />
                    <Select
                      label="Type"
                      defaultOption="Select listing type"
                      options={[
                        { value: "sale", label: "For Sale" },
                        { value: "trade", label: "For Trade" },
                        { value: "rent", label: "For Rent" },
                        { value: "wanted", label: "Wanted" },
                      ]}
                      error={errors?.type?.message}
                      {...register("type", { required: true })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <TextArea
                    label="Description"
                    placeholder="Describe your item (condition, size, brand, etc.)"
                    error={errors?.description?.message}
                    rows={5}
                    {...register("description", { required: false })}
                  />
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting || uploadedImages.length === 0}
                  className={`flex items-center px-6 py-2.5 rounded-md text-white transition-all duration-200 ${
                    !isValid || isSubmitting || uploadedImages.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Posting...
                    </>
                  ) : (
                    <>
                      Post Listing
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Tips Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips for a Great Listing</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">1</div>
                <p className="text-sm text-gray-600">Use clear, high-quality photos from multiple angles</p>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">2</div>
                <p className="text-sm text-gray-600">Be specific about condition, dimensions, and features</p>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">3</div>
                <p className="text-sm text-gray-600">Set a fair price to attract more potential buyers</p>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">4</div>
                <p className="text-sm text-gray-600">Respond quickly to inquiries to increase chances of selling</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostAd;
