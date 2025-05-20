// components/screens/EditAnnonce.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_PATHS from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import Header from "../../components/layouts/inputs/header";
import { toast } from "react-toastify";
import {
  FaTimesCircle,
  FaSpinner,
  FaPlusCircle,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { parseImages } from "../../utils/parseImages"; // Import the utility to convert paths to URLs

const EditAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    condition: "",
    type: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [originalImagePaths, setOriginalImagePaths] = useState([]);

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.ANNONCE.ANNONCE_BY_ID(id)
        );
        const fetchedAnnonce = response.data;

        setFormData({
          title: fetchedAnnonce.title || "",
          description: fetchedAnnonce.description || "",
          price: fetchedAnnonce.price || "",
          category: fetchedAnnonce.category || "",
          location: fetchedAnnonce.location || "",
          condition: fetchedAnnonce.condition || "",
          type: fetchedAnnonce.type || "",
        });

        setOriginalImagePaths(fetchedAnnonce.images);
        setExistingImages(fetchedAnnonce.images.map((img) => parseImages(img)));
      } catch (err) {
        console.error("Error fetching annonce for editing:", err);
        setError("Failed to load annonce for editing.");
        toast.error("Failed to load annonce.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonce();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 8) {
      toast.warn(
        `You can upload a maximum of 8 images. You have ${
          existingImages.length + newImages.length
        } images already.`
      );
      setNewImages((prev) => [
        ...prev,
        ...files.slice(0, 8 - (existingImages.length + newImages.length)),
      ]);
    } else {
      setNewImages((prev) => [...prev, ...files]);
    }
    e.target.value = "";
  };

  const handleRemoveExistingImage = (imageToRemoveUrl) => {
    const filename = imageToRemoveUrl.split("/").pop();
    const originalPath = originalImagePaths.find((path) =>
      path.includes(filename)
    );

    if (originalPath) {
      setRemovedImages((prev) => [...prev, originalPath]);
    }

    setExistingImages((prev) => prev.filter((img) => img !== imageToRemoveUrl));
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = new FormData();

    for (const key in formData) {
      dataToSend.append(key, formData[key]);
    }

    newImages.forEach((file) => {
      dataToSend.append("images", file);
    });

    const keptImagePaths = originalImagePaths.filter(
      (path) => !removedImages.includes(path)
    );
    dataToSend.append("existingImages", JSON.stringify(keptImagePaths));

    if (removedImages.length > 0) {
      dataToSend.append("removedImages", JSON.stringify(removedImages));
    }

    try {
      const response = await axiosInstance.put(
        API_PATHS.ANNONCE.ANNONCE_BY_ID(id),
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success("Announcement updated successfully!");
        navigate(`/userannonces`);
      } else {
        toast.error("Something went wrong while updating the announcement.");
        console.log("Response:", response.data);
      }
      await axiosInstance.put(API_PATHS.ANNONCE.ANNONCE_BY_ID(id), dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Announcement updated successfully!");
      navigate(`/userannonces`);
    } catch (err) {
      console.error("Error updating annonce:", err);
      if (err.response) {
        if (err.response.data && err.response.data.errors) {
          const errors = err.response.data.errors;
          Object.keys(errors).forEach((key) => {
            toast.error(`${key}: ${errors[key]}`);
          });
        } else if (err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error(
            `Error ${err.response.status}: Failed to update announcement.`
          );
        }
      } else if (err.request) {
        toast.error("Network error: Could not connect to the server.");
      } else {
        toast.error("Failed to update announcement. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <FaSpinner className="animate-spin text-7xl text-gray-700 mb-4" />
        <p className="text-xl font-medium text-gray-600">
          Loading your announcement details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 p-4">
        <div className="text-center p-10 bg-white border border-red-200 text-red-800 rounded-lg shadow-md max-w-md w-full">
          <FaTimesCircle className="text-6xl mx-auto mb-5 text-red-500" />
          <h2 className="font-semibold text-3xl mb-3 text-red-700">
            Error Loading Data
          </h2>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate("/userannonces")}
            className="px-8 py-3 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center flex items-center justify-center">
          <FaEdit className="mr-3 text-teal-600" />
          Edit Your Listing
        </h1>
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800"
                  placeholder="e.g., Gaming PC, Antique Vase"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Price (DZD)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800"
                  placeholder="e.g., 150.00"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Category
                </label>
                <select
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800"
                  placeholder="e.g., Vehicles, Sports Equipment"
                  required
                >
                  <option value="">Select Ctegory</option>
                  <option value="electronic">Electronic</option>
                  <option value="clothing">Clothing</option>
                  <option value="toys & games">Toys & Games</option>
                  <option value="sports & outdoors">Sports & Outdoors</option>
                  <option value="arts & crafts">Arts & Crafts</option>
                  <option value="phones & accessories">
                    Phones & Accessories
                  </option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800"
                  placeholder="e.g., Algiers, Setif"
                  required
                />
              </div>

              {/* Condition */}
              <div>
                <label
                  htmlFor="condition"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Condition
                </label>
                <div className="relative">
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none bg-white pr-8 text-gray-800"
                    required
                  >
                    <option value="">Select Condition</option>
                    <option value="new">New</option>
                    <option value="like new">Like New</option>
                    <option value="good condition">Good Condition</option>
                    <option value="acceptable">Acceptable</option>
                    <option value="not working">Not Working</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Type
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none bg-white pr-8 text-gray-800"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="sale">Sale</option>
                    <option value="trade">Trade</option>
                    <option value="wanted">Wanted</option>
                    <option value="rent">Rent</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800"
                placeholder="Describe your item in detail, including its features, condition, and any relevant history."
                required
              ></textarea>
            </div>

            {/* Image Upload Section */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaPlusCircle className="mr-2 text-teal-600" />
                Images ({existingImages.length + newImages.length}/8)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Display Existing Images */}
                {existingImages.map((image, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <img
                      src={image}
                      alt={`Existing Annonce Image ${index + 1}`}
                      className="w-full h-28 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(image)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      title="Remove Image"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                {/* Display Newly Added Images */}
                {newImages.map((image, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New Annonce Image ${index + 1}`}
                      className="w-full h-28 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      title="Remove New Image"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                {/* Add New Image Input */}
                {existingImages.length + newImages.length < 8 && (
                  <label
                    htmlFor="new-post-image"
                    className="w-full h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-teal-600 transition-all duration-200"
                  >
                    <FaPlusCircle className="text-3xl" />
                    <span className="text-sm font-medium">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      id="new-post-image"
                      className="hidden"
                      multiple
                      onChange={handleNewImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-teal-600 text-white font-medium rounded-md shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
                disabled={loading}
              >
                {" "}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAnnonce;
