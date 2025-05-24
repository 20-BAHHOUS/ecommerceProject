// components/screens/EditAnnonce.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API_PATHS from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
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
} from "react-icons/fa";
import Header from "../../components/layouts/inputs/header";

const EditAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
    reset
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
  });

  // Fetch categories on component mount
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

        // Set selected category for subcategories
        setSelectedCategory(annonce.category);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcement:", error);
        toast.error("Failed to load announcement");
        navigate("/userannonces");
      }
    };

    fetchAnnonce();
  }, [id, reset, setValue, navigate]);

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(cat => cat._id === selectedCategory);
      if (category && category.subcategories) {
        setSubcategories(category.subcategories);
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categories]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setValue("category", categoryId);
    setValue("subcategory", ""); // Reset subcategory when category changes
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append all form fields
      Object.keys(data).forEach((key) => {
        if (key !== "images") {
          formData.append(key, data[key]);
        }
      });

      // Handle images
      if (data.images) {
        data.images.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image);
          } else {
            formData.append("existingImages", image);
          }
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
        toast.success("Announcement updated successfully!");
        navigate("/userannonces");
      } else {
        toast.error(response.data.message || "Error updating announcement");
      }
    } catch (error) {
      console.error("Error updating announcement:", error);
      toast.error(error.response?.data?.message || "Failed to update announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <FaSpinner className="animate-spin text-5xl text-teal-600 mb-4" />
        <p className="text-xl text-gray-600">Loading announcement details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50">
      <Header />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                to="/userannonces"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2" />
                Back to My Announcements
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 mt-2">Edit Announcement</h1>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Section */}
              <div className="space-y-4">
                <div className="flex items-center text-lg text-gray-800 font-semibold mb-4">
                  <FaTag className="mr-2 text-teal-600" />
                  Basic Information
                </div>
                <Input
                  label="Title"
                  placeholder="What are you selling?"
                  error={errors?.title?.message}
                  {...register("title")}
                />
                <TextArea
                  label="Description"
                  placeholder="Describe your item (condition, size, brand, etc.)"
                  error={errors?.description?.message}
                  {...register("description")}
                />
                <Input
                  label="Price (DZD)"
                  placeholder="Enter your price"
                  type="number"
                  error={errors?.price?.message}
                  {...register("price")}
                />
              </div>

              {/* Category Section */}
              <div className="space-y-4">
                <div className="flex items-center text-lg text-gray-800 font-semibold mb-4">
                  <FaList className="mr-2 text-teal-600" />
                  Category Details
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    defaultOption="Select category"
                    options={categories.map(cat => ({
                      value: cat._id,
                      label: cat.name
                    }))}
                    error={errors?.category?.message}
                    {...register("category", { 
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
                    {...register("subcategory")}
                  />
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                <div className="flex items-center text-lg text-gray-800 font-semibold mb-4">
                  <FaBoxOpen className="mr-2 text-teal-600" />
                  Item Details
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {...register("type")}
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
                    {...register("condition")}
                  />
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <div className="flex items-center text-lg text-gray-800 font-semibold mb-4">
                  <FaImage className="mr-2 text-teal-600" />
                  Images
                </div>
                <AnnonceImages setValue={setValue} watch={watch} />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/userannonces")}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-2 bg-teal-600 text-white font-medium rounded-xl shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAnnonce;
