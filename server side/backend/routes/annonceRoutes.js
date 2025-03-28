import express from "express";
import {addAnnonce,getAllAnnonces,getannonceById,deleteAnnonceById,searchAnnonces, updateAnnonceById, getAnnoncesByType, getAnnoncesByCategory, getAnnoncesByLocation} from "../controllers/annonceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addannonce",protect,addAnnonce);
router.get("/getallannonces",protect,getAllAnnonces);
router.get("/getannonce/:id",protect,getannonceById);
router.put("/updateannonce/:id",protect,updateAnnonceById);
router.delete("/deleteannonce/:id",protect,deleteAnnonceById);
router.get("/searchannonce/:query",protect,searchAnnonces);
router.get("/getannoncebycategory/:category",protect,getAnnoncesByCategory);
router.get("/getannoncebylocation/:location",protect,getAnnoncesByLocation);
router.get("/getannoncebytype/:type",protect,getAnnoncesByType);

export default router;