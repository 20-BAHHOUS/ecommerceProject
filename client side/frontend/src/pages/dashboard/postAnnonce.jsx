import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import MultipleImageSelector from "../../components/layouts/inputs/MultipleImageSelector";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateAnnonceValidator } from "../../lib/validators/annonce.validator";
import Input from "../../components/layouts/inputs/input";
import TextArea from "../../components/layouts/inputs/TextArea";
import Select from "../../components/layouts/inputs/Select";

const PostAd = () => {
  const Navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
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
      conditon: "",
    },
  });
  async function onSubmit(data) {
    try {
      await axiosInstance
        .post(API_PATHS.ANNONCE.ADD_GET_ANNONCE, data)
        .then((res) => {
          if (res?.status === 200) {
            console.log("Annonce created successfully", res.data);
          }
        });
    } catch {
      console.error("Error creating annonce");
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
        {/* <div className="mb-4">
          <label className="text-gray-600 mb-2">Add up to 5 photos.</label>
          <div className="border-dashed border-2 border-gray-400 p-4 rounded-lg flex flex-row relative cursor-pointer justify-center items-center transition hover:border-blue-500">
            <MultipleImageSelector
              images={images}
              setImages={setImages}
              maxImages={5}
            />
          </div>
        </div> */}
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
          error={errors?.conditon?.message}
          {...register("conditon", { required: true })}
        />
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
