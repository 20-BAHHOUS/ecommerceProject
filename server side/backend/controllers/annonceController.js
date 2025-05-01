// c:\Users\Dell P106f\Desktop\pfe commmerce\ecommerceProject\server side\backend\controllers\annonceController.js
import Annonce from "../models/annonce.js";
import validateAnnonceBody from "../validators/annonce.validator.js";
// No need for fs or path for buffer storage

// --- UPDATE addAnnonce function ---
const addAnnonce = async (req, res, next) => {
    try {
        const { body, files } = req; // files now contain buffers in memory
        const userId = req.user.id;

        // *** Map files to the new structure { data: Buffer, contentType: String } ***
        const imageBuffers = files ? files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        })) : [];

        // Basic check for total image size (optional but recommended)
        const totalImageSize = imageBuffers.reduce((sum, img) => sum + img.data.length, 0);
        // Example limit: 10MB total for images per annonce (adjust!)
        // Remember MongoDB's hard 16MB limit per *document*
        if (totalImageSize > 10 * 1024 * 1024) {
             const err = new Error("Total image size exceeds the limit (e.g., 10MB).");
             err.status = 400;
             throw err;
        }


        const priceAsNumber = body.price ? Number(body.price) : undefined;
        if (body.price && isNaN(priceAsNumber)) {
            const err = new Error("Price must be a valid number.");
            err.status = 400;
            throw err;
        }

        const dataToValidate = {
            ...body,
            price: priceAsNumber,
            createdBy: userId,
           
        };

        await validateAnnonceBody(dataToValidate);

        const newAnnonce = new Annonce({
            ...body,
            price: priceAsNumber,
            createdBy: userId,
            images: imageBuffers, 
            conditon: body.conditon,
        });

        const savedAnnonce = await newAnnonce.save();
      
        const responseData = savedAnnonce.toObject();
 
        responseData.imageCount = imageBuffers.length; // Indicate how many images were saved

        return res.status(201).json({ data: responseData });

    } catch (error) {
      

        // Log the error and pass to central handler
        console.error("Error in addAnnonce:", error.message);
        next(error);
    }
};


const getAnnonceImageByIndex = async (req, res, next) => {
    try {
        const { id, index } = req.params;
        const imageIndex = parseInt(index, 10);

        if (isNaN(imageIndex) || imageIndex < 0) {
            return res.status(400).json({ message: "Invalid image index." });
        }

        // Find annonce, but only select the specific image element to save memory/bandwidth
        const annonce = await Annonce.findById(id).select({ images: { $slice: [imageIndex, 1] } });

        if (!annonce || !annonce.images || annonce.images.length === 0) {
            // Annonce or specific image not found
            return res.status(404).json({ message: "Image not found." });
        }

        const image = annonce.images[0];

        // Set the content type header
        res.contentType(image.contentType);
        // Send the image buffer data
        res.send(image.data);

    } catch (error) {
        console.error("Error serving image:", error.message);
        next(error);
    }
};



const getAllAnnonces = async (req, res, next) => {
    try {
    
        const annonces = await Annonce.find().select('-images').sort({ createdAt: -1 });
        res.json(annonces);
    } catch (error) {
        next(error);
    }
};

const getAnnonceById = async (req, res, next) => {
    try {
       
        const annonce = await Annonce.findById(req.params.id).select('-images');
        if (!annonce) {
            const err = new Error("Annonce not found");
            err.status = 404;
            throw err;
        }
        // Add image count or IDs if helpful
        const fullAnnonce = await Annonce.findById(req.params.id).select('images'); 
        const responseData = annonce.toObject();
        responseData.imageCount = fullAnnonce.images ? fullAnnonce.images.length : 0;

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};


const deleteAnnonceById = async (req, res, next) => {
    try {
        const annonce = await Annonce.findById(req.params.id);
        if (!annonce) {
            const err = new Error("Annonce not found");
            err.status = 404;
            throw err;
        }
        // *** No need to delete files from filesystem ***
        await Annonce.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Annonce deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Update remains the same for now (doesn't handle image updates)
const updateAnnonceById = async (req, res, next) => {
    try {
        const annonce = await Annonce.findById(req.params.id);
        if (!annonce) {
            const err = new Error("Annonce not found");
            err.status = 404;
            throw err;
        }
        const updatedAnnonce = await Annonce.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-images'); // Exclude images from response
        res.status(200).json(updatedAnnonce);
    } catch (error) {
        next(error);
    }
};

// --- EXPORT ALL THE FUNCTIONS (including the new one) ---
export {
    addAnnonce,
    getAllAnnonces,
    getAnnonceById,
    deleteAnnonceById,
    updateAnnonceById,
    getAnnonceImageByIndex 
};
