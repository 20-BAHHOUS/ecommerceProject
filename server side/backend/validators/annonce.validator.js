// c:\Users\Dell P106f\Desktop\pfe commmerce\ecommerceProject\server side\backend\validators\annonce.validator.js
import joi from "joi";
import mongoose from 'mongoose'; // Optional: For ObjectId validation

// Optional: Helper for ObjectId validation
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        // Use helpers.error for custom error messages within Joi
        return helpers.error('any.invalid', { message: 'Invalid MongoDB ObjectId for createdBy' });
    }
    return value; // Return the value if it's valid
};

const validateAnnonceBody = async (body) => {
    // Define the schema for the fields you *want* to validate
    const schema = joi.object({
        // Validate createdBy if passed in dataToValidate
        createdBy: joi.string().custom(objectIdValidator, 'MongoDB ObjectId Validation').required(),
        title: joi.string().required().trim().min(3).max(100),
        description: joi.string().allow('').optional().trim().max(1000), // Allow empty, optional
        price: joi.number().required().min(0), // Price is required, ensure it's >= 0
        category: joi.string().required().valid( // Use valid() for enums
            "electronic", "clothing", "toys & games", "sports & outdoors",
            "arts & crafts", "phones & accessories"
        ),
        conditon: joi.string().required().valid( // Ensure spelling matches model, make required
            "new", "like new", "good condition", "acceptable", "not working"
        ),
        type: joi.string().required().valid("sale", "trade", "wanted", "rent"), // Use valid() for enums
        location: joi.string().required().trim().min(3).max(100),
        // NO 'images' field here - it will be ignored due to allowUnknown: true
    });

    try {
        // Validate the body against the schema using validateAsync
        // *** ADD allowUnknown: true and abortEarly: false ***
        await schema.validateAsync(body, {
            abortEarly: false,    // Report all errors, not just the first one
            allowUnknown: true    // *** Ignore fields not defined in the schema (like 'images') ***
        });
    } catch (error) {
        // If validation fails, Joi throws an error.
        // Enhance it with a status code and re-throw for the error handler.
        const messages = error.details.map(detail => detail.message).join('. ');
        const validationError = new Error(messages); // Create a standard Error object
        validationError.status = 400; // Add a status property for the error middleware
        console.error("Validation Error (Validator):", error.details); // Log the details
        throw validationError; // Throw the enhanced error
    }
};

export default validateAnnonceBody;
