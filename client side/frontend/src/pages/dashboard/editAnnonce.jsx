
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import Input from "../../components/layouts/inputs/input";
import Select from "../../components/layouts/inputs/select";
import TextArea from "../../components/layouts/inputs/textArea";
import AnnonceImages from "./annonceImages";
import { FaArrowLeft, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { parseImages } from "../../utils/parseImages";

const EditAnnonce = () => {
  const { id: annonceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [annonce, setAnnonce] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      type: "",
      location: "",
      condition: "",
      images: [],
    },
  });

  const watchedImages = watch("images");

  const categoryOptions = [
    { value: "electronic", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "toys & games", label: "Toys & Games" },
    { value: "sports & outdoors", label: "Sports & Outdoors" },
    { value: "arts & crafts", label: "Arts & Crafts" },
    { value: "phones & accessories", label: "Phones & Accessories" },
  ];

  const typeOptions = [
    { value: "sale", label: "For Sale" },
    { value: "trade", label: "For Trade" },
    { value: "wanted", label: "Wanted" },
    { value: "rent", label: "For Rent" },
  ];

  const conditionOptions = [
    { value: "new", label: "New" },
    { value: "like new", label: "Like New" },
    { value: "good condition", label: "Good Condition" },
    { value: "acceptable", label: "Acceptable" },
    { value: "not working", label: "Not Working" },
  ];

  useEffect(() => {
    const fetchAnnonceToEdit = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          API_PATHS.ANNONCE.ANNONCE_BY_ID(annonceId)
        );
        const annonceData = response.data;
        if (annonceData) {
          setAnnonce(annonceData);
          setValue("title", annonceData.title || "");
          setValue("description", annonceData.description || "");
          setValue("price", annonceData.price || "");
          setValue("category", annonceData.category || "");
          setValue("type", annonceData.type || "");
          setValue("location", annonceData.location || "");
          setValue("condition", annonceData.condition || "");
        } else {
          setError("Announcement not found.");
        }
      } catch (err) {
        console.error("Error fetching announcement for edit:", err);
        setError("Failed to load announcement details for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonceToEdit();
  }, [annonceId, setValue]);

  const handleRemoveExistingImage = async (imageUrlToRemove) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.put(
          `${API_PATHS.ANNONCE.ANNONCE_BY_ID(annonceId)}/remove-image`,
          { imageUrl: imageUrlToRemove }
        );
        toast.success(response.data.message || "Image removed successfully.");
        const updatedAnnonceResponse = await axiosInstance.get(
          API_PATHS.ANNONCE.ANNONCE_BY_ID(annonceId)
        );
        setAnnonce(updatedAnnonceResponse.data);
      } catch (error) {
        console.error("Error removing image:", error);
        toast.error(error.response?.data?.message || "Failed to remove image.");
        setError("Failed to remove image.");
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("type", data.type);
      formData.append("location", data.location);
      formData.append("condition", data.condition);

      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await axiosInstance.put(
        API_PATHS.ANNONCE.ANNONCE_BY_ID(annonceId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Announcement updated successfully!");
      navigate(`/annonces/${annonceId}`);
    } catch (error) {
      console.error("Error updating announcement:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update announcement. Please try again.");
      }
      setError("Failed to update announcement.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <FaSpinner className="animate-spin text-4xl mb-4 text-indigo-500" />
        <p className="text-lg">Loading announcement details for editing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600 p-4 text-center">
        <FaExclamationTriangle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">
          Oops! Something went wrong.
        </p>
        <p className="mb-4">{error}</p>
        <Link to="/my-annonces" className="text-indigo-600 hover:underline">
          Go back to My Announcements
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Link to="/my-annonces" className="inline-flex items-center mb-4 text-indigo-600 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to My Announcements
      </Link>
      <h2 className="text-2xl font-semibold mb-4">Edit Announcement</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            label="Title"
            {...register("title", { required: "Title is required" })}
            error={errors.title?.message}
          />
        </div>
        <div>
          <TextArea
            label="Description"
            {...register("description", { required: "Description is required" })}
            error={errors.description?.message}
          />
        </div>
        <div>
          <Input
            label="Price"
            type="number"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
          />
        </div>
        <div>
          <Select
            label="Category"
            options={categoryOptions}
            {...register("category", { required: "Category is required" })}
            error={errors.category?.message}
            defaultOption="Select a category"
          />
        </div>
        <div>
          <Select
            label="Type"
            options={typeOptions}
            {...register("type", { required: "Type is required" })}
            error={errors.type?.message}
            defaultOption="Select a type"
          />
        </div>
        <div>
          <Input
            label="Location"
            {...register("location", { required: "Location is required" })}
            error={errors.location?.message}
          />
        </div>
        <div>
          <Select
            label="Condition"
            options={conditionOptions}
            {...register("condition")}
            error={errors.condition?.message}
            defaultOption="Select condition (optional)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">Images</label>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {annonce?.images?.map((imageUrl, index) => (
              <div key={`existing-${index}`} className="relative">
                <img
                  src={parseImages(imageUrl)}
                  alt={`existing-${index}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(imageUrl)}
                  className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white text-xs font-bold p-1 rounded-full focus:outline-none"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <AnnonceImages setValue={setValue} watch={watch} />
          {errors.images?.message && (
            <p className="text-red-500 text-sm italic">{errors.images.message}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:shadow-outline ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <FaSpinner className="animate-spin inline-block mr-2" />
          ) : (
            "Update Announcement"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditAnnonce;
