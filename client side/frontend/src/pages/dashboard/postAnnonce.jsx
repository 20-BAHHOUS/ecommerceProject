import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const PostAd = () => {
  const Navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(CreateAnnonceValidator),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
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

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(cat => cat._id === selectedCategory);
      if (category && category.subcategories) {
        setSubcategories(category.subcategories);
        // Reset subcategory selection when category changes
        setValue("subcategory", "");
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categories, setValue]);

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setValue("category", categoryId);
  };

  async function onSubmit(data) {
    try {
      // Validate that both category and subcategory are selected
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
        toast.success("Posting announce successful!");
        Navigate("/home");
      } else {
        toast.error(response.data.message || "Error creating announcement");
      }
    } catch (error) {
      console.error("Error creating annonce:", error);
      const errorMessage = error.response?.data?.errors?.subcategory || 
                         error.response?.data?.message || 
                         "Error creating announcement";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-grey-100 rounded-lg flex flex-col ">
      <h2 className="text-2xl font-semibold mb-8">Add an article</h2>
      <form
        className="flex flex-col gap-2 h-full"
        action=""
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Title"
          placeholder=""
          error={errors?.title?.message}
          {...register("title", { required: true })}
        />
        <TextArea
          label="Description"
          placeholder="ex : worn a few times, fits well"
          error={errors?.description?.message}
          {...register("description", { required: false })}
        />
        <Input
          label="Price"
          placeholder="ex : 1000"
          error={errors?.price?.message}
          {...register("price", { required: true, valueAsNumber: true })}
        />
        <Select
          label="Category"
          defaultOption="Select annonce category"
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
        <Select
          label="Type"
          defaultOption="Select annonce type"
          options={[
            { value: "sale", label: "Sale" },
            { value: "trade", label: "Trade" },
            { value: "rent", label: "Rent" },
            { value: "wanted", label: "Wanted" },
          ]}
          error={errors?.type?.message}
          {...register("type", { required: true })}
        />
        <Select
          label="Condition"
          defaultOption="Select annonce condition"
          options={[
            { value: "new", label: "New" },
            { value: "like new", label: "Like new" },
            { value: "good condition", label: "Good condition" },
            { value: "acceptable", label: "Acceptable" },
            { value: "not working", label: "Not working" },
          ]}
          error={errors?.condition?.message}
          {...register("condition", { required: true })}
        />
        <AnnonceImages setValue={setValue} watch={watch} />
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full bg-green-600 text-white py-3 mt-4 rounded-lg
              ${
                !isValid || isSubmitting
                  ? "opacity-50"
                  : "cursor-pointer hover:bg-green-700 "
              }`}
        >
          Post Ad
        </button>
      </form>
    </div>
  );
};

export default PostAd;
