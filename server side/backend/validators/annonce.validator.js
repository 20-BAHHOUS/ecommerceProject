import joi from "joi";

const validateAnnonceBody = async(body) => {
    const { error } = joi.object({
        createdBy: joi.string().optional(),
        title: joi.string().required(),
        description: joi.string(),
        price: joi.number().required(),
        category: joi.string().required(),
        conditon: joi.string().required(),
        type: joi.string().required(),
        location: joi.string().required(),
        images : joi.array(),
    }).validate(body);
    if (error) {
        throw new Error(error.details[0].message,400);
    }
};

export default validateAnnonceBody;