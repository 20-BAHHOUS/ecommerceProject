import React from "react";
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
      type: "",
      location: "",
      condition: "",
    },
  });
  async function onSubmit(data) {
    try {
      const formaData = new FormData();

      data.images.forEach((image) => {
        formaData.append("images", image);
      });
      Object.keys(data).forEach((key) => {
        if (key != "image") {
          formaData.append(key, data[key]);
        }
      });

      const response = await axiosInstance.post(
        API_PATHS.ANNONCE.ADD_GET_ANNONCE,
        formaData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success("posting announce successful!");
        Navigate("/home");
      } else {
        console.error("Error creating annonce", response.data.message);
      }
    } catch (error) {
      console.error("Error creating annonce:", error.response?.data?.message || error.message);
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
        <Input
          label="Location"
          placeholder="ex : Oran, Algeria"
          error={errors?.location?.message}
          {...register("location", { required: true })}
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
          label="Category"
          defaultOption="Select annonce category"
          options={[
            { value: "electronic", label: "Electronic" },
            { value: "clothing", label: "Clothing" },
            { value: "toys & games", label: "Toys & Games" },
            { value: "sports & outdoors", label: "Sports & Outdoors" },
            { value: "arts & crafts", label: "Arts & Crafts" },
            { value: "phones & accessories", label: "Phones & Accessories" },
          ]}
          error={errors?.category?.message}
          {...register("category", { required: true })}
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
