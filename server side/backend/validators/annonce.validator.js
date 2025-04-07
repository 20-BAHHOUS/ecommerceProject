import joi from "joi";

const validateAnnonceBody = async(body) => {
    const { error } = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        category: joi.string().required(),
        conditon: joi.string().required(),
        annonceType: joi.string().required(),
        images : joi.array(),
        userId: joi.string().required(),
    }).validate(body);
    if (error) {
        throw new Error(error.details[0].message,400);
    }
};

export default validateAnnonceBody;