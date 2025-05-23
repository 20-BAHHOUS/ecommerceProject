import joi from "joi";

const validateUserBody = async(body) => {
    const { error } = joi.object({
        fullName: joi.string().min(3).max(20).required(),
        email: joi.string().required(),
        password: joi.string().required(),
        phone: joi.string().optional(),
        location: joi.string().optional(),
        profileImageUrl: joi.string().optional(),
    }).validate(body);
    if (error) {
        throw new Error(error.details[0].message,400);
    }
  
}

export default validateUserBody;
  