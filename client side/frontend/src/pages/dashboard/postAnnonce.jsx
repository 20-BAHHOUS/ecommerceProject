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

const PostAd = () => {
  const Navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
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

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['title', 'description', 'price'],
      2: ['category', 'subcategory'],
      3: ['type', 'condition'],
    }[currentStep];

    if (fieldsToValidate) {
      const isStepValid = await trigger(fieldsToValidate);
      if (isStepValid) {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === currentStep
                ? 'bg-teal-600 text-white'
                : step < currentStep
                ? 'bg-teal-200 text-teal-700'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step < currentStep ? (
              <FaCheck size={12} />
            ) : (
              <span className="text-sm">{step}</span>
            )}
          </div>
          {step < 4 && (
            <div
              className={`w-20 h-0.5 ${
                step < currentStep ? 'bg-teal-200' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
              <p className="text-gray-500">Let's start with the essential details</p>
            </div>
            <Input
              label="Title"
              placeholder="What are you selling?"
              error={errors?.title?.message}
              {...register("title", { required: true })}
            />
            <TextArea
              label="Description"
              placeholder="Describe your item (condition, size, brand, etc.)"
              error={errors?.description?.message}
              {...register("description", { required: false })}
            />
            <Input
              label="Price (DZD)"
              placeholder="Enter your price"
              type="number"
              error={errors?.price?.message}
              {...register("price", { required: true, valueAsNumber: true })}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Category Selection</h3>
              <p className="text-gray-500">Choose where your item belongs</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
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
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Item Details</h3>
              <p className="text-gray-500">Tell us more about your item</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
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
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Add Photos</h3>
              <p className="text-gray-500">Great photos help sell faster</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-200">
              <AnnonceImages setValue={setValue} watch={watch} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                to="/profile"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2" />
                Back to Profile
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 mt-2">Create New Listing</h1>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStepIndicator()}
              {renderStepContent()}
              
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                  >
                    Back
                  </button>
                )}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto flex items-center px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Continue
                    <FaChevronRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting || uploadedImages.length === 0}
                    className={`ml-auto flex items-center px-6 py-3 rounded-xl text-white transition-all duration-200 ${
                      !isValid || isSubmitting || uploadedImages.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700 transform hover:scale-[1.02]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <FaMoneyBillWave className="mr-2" />
                        Post Listing
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAd;
