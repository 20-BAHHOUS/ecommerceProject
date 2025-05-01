// client side/frontend/src/pages/dashboard/postAnnonce.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form"; // Import FormProvider
import { CreateAnnonceValidator } from "../../lib/validators/annonce.validator"; // Ensure this validator exists and is correct
import Input from "../../components/layouts/inputs/input";
import TextArea from "../../components/layouts/inputs/TextArea";
import Select from "../../components/layouts/inputs/Select";
import MultipleImageSelector from "../../components/layouts/inputs/multiplyImages"; // *** IMPORT THE IMAGE SELECTOR ***

// --- Example Zod Schema (ensure you have this in annonce.validator.js/ts) ---
// import { z } from 'zod';
// export const CreateAnnonceValidator = z.object({
//   title: z.string().min(3, { message: "Title must be at least 3 characters" }),
//   description: z.string().optional(),
//   price: z.number({ invalid_type_error: "Price must be a number" }).positive({ message: "Price must be positive" }),
//   // Validate File objects for images, max 10
//   images: z.array(z.instanceof(File)).max(10, "Maximum 10 images").optional(),
//   category: z.string().min(1, { message: "Category is required" }),
//   type: z.string().min(1, { message: "Type is required" }),
//   location: z.string().min(1, { message: "Location is required" }),
//   conditon: z.string().min(1, { message: "Condition is required" }), // Ensure spelling matches
// });
// --- End Example Zod Schema ---


const PostAd = () => {
    const Navigate = useNavigate();
    // Use useForm hook at the top level and wrap with FormProvider
    const methods = useForm({
        resolver: zodResolver(CreateAnnonceValidator), // Use your Zod schema
        defaultValues: {
            title: "",
            description: "",
            price: 0, // Default price
            images: [], // Initialize images as an empty array for react-hook-form state
            category: "",
            type: "",
            location: "",
            conditon: "", // Ensure spelling matches model/validator
        },
        mode: 'onChange', // Optional: Validate on change
    });

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting, isValid }, // Get isSubmitting and isValid
        reset, // Get reset method
        // control, // Get control if needed by child components like MultipleImageSelector
    } = methods;

    async function onSubmit(data) {
        // *** Create FormData object - THIS IS KEY FOR FILE UPLOADS ***
        const formData = new FormData();

        // Append non-file fields
        formData.append("title", data.title);
        formData.append("description", data.description || ""); // Send empty string if undefined
        formData.append("price", data.price.toString()); // Send price as string
        formData.append("category", data.category);
        formData.append("type", data.type);
        formData.append("location", data.location);
        formData.append("conditon", data.conditon); // Ensure spelling matches backend

        // *** Append files ***
        // Key MUST match the one used in `upload.array('images', 10)` on the backend
        if (data.images && data.images.length > 0) {
            data.images.forEach((file) => {
                // Ensure it's a File object before appending
                if (file instanceof File) {
                    formData.append("images", file, file.name); // Append each file with the key 'images'
                }
            });
        }

        // Optional: Log FormData contents (files won't show full details)
        // console.log("Submitting FormData keys:", [...formData.keys()]);
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        try {
            // *** Send FormData using axiosInstance ***
            const res = await axiosInstance.post(
                API_PATHS.ANNONCE.ADD_GET_ANNONCE, // Endpoint: /annonce
                formData // Send the FormData object
                // Axios automatically sets 'Content-Type': 'multipart/form-data' for FormData
            );

            // Check for successful status codes (201 Created is ideal)
            if (res?.status === 201 || res?.status === 200) {
                console.log("Annonce created successfully", res.data);
                reset(); // Reset the form fields after successful submission
                Navigate("/home"); // Navigate after success
            } else {
                console.warn("Annonce creation returned status:", res?.status, res?.data);
                alert(`Annonce created but received status ${res?.status}. Check console.`); // Inform user
            }
        } catch (error) {
            // Log the detailed error from the server if available
            console.error("Error creating annonce:", error.response?.data || error.message || error);
            // Display a user-friendly error message
            alert(`Error: ${error.response?.data?.message || 'Failed to create annonce. Please check the details and try again.'}`);
        }
    }

    return (
        // *** Wrap the entire form with FormProvider ***
        <FormProvider {...methods}>
            <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg flex flex-col "> {/* Use gray-100 */}
                <h2 className="text-2xl font-semibold mb-8">Add an article</h2>
                <form
                    className="flex flex-col gap-4 h-full" // Use gap-4 for better spacing
                    // Remove action/method, handle submission via onSubmit
                    onSubmit={handleSubmit(onSubmit)}
                    // encType="multipart/form-data" // Not strictly needed when using JS FormData + Axios
                >
                    <Input
                        label="Title"
                        placeholder="e.g., Slightly used smartphone"
                        error={errors?.title?.message}
                        {...register("title")} // Zod handles required validation
                    />
                    <TextArea
                        label="Description"
                        placeholder="ex : worn a few times, fits well"
                        error={errors?.description?.message}
                        {...register("description")}
                    />
                    <Input
                        label="Price (DZD)"
                        type="number" // Use number type for better input control
                        placeholder="ex : 1000"
                        step="any" // Allow decimals if needed
                        error={errors?.price?.message}
                        // Register with valueAsNumber for react-hook-form state, but send as string in FormData
                        {...register("price", { valueAsNumber: true })}
                    />
                    <Input
                        label="Location"
                        placeholder="ex : Oran, Algeria"
                        error={errors?.location?.message}
                        {...register("location")}
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
                        {...register("type")}
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
                        {...register("category")}
                    />
                    <Select
                        label="Condition" // Use consistent label spelling
                        defaultOption="Select annonce condition"
                        options={[
                            { value: "new", label: "New" },
                            { value: "like new", label: "Like new" },
                            { value: "good condition", label: "Good condition" },
                            { value: "acceptable", label: "Acceptable" },
                            { value: "not working", label: "Not working" },
                        ]}
                        error={errors?.conditon?.message} // Ensure Zod schema uses 'conditon' if this is the name
                        {...register("conditon")} // Ensure Zod schema uses 'conditon' if this is the name
                    />

                    {/* *** Add the MultipleImageSelector component *** */}
                    <MultipleImageSelector
                        label="Upload Photos (Max 10)"
                        name="images" // This name MUST match the useForm state key and FormData key
                        maxImages={10} // Match backend limit if desired
                    />
                    {/* Display image-specific errors from Zod */}
                    {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}


                    <button
                        type="submit"
                        // Disable button when submitting OR if form is invalid
                        disabled={isSubmitting || !isValid}
                        className={`w-full bg-green-600 text-white font-semibold py-3 mt-4 rounded-lg transition duration-200 ease-in-out
                            ${isSubmitting || !isValid
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-green-700 cursor-pointer"
                            }`}
                    >
                        {isSubmitting ? "Posting..." : "Post Ad"}
                    </button>
                </form>
            </div>
        </FormProvider> // Close FormProvider
    );
};

export default PostAd;
