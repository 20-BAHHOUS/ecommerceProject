import joi from "joi";

const validateUserBody = async(body) => {
    const { error } = joi.object({
        fullName: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        phone: joi.string().required(),
        profileImageUrl: joi.string(),
    }).validate(body);
    if (error) {
        throw new Error(error.details[0].message,400);
    }
  
}

export default validateUserBody;
  