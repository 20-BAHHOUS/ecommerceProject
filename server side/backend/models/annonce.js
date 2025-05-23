import mongoose from "mongoose";

const annonceSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    title: { type: String },
    description: { type: String, required: true },
    price: {
      type: Number,
    },
    images: { type: [String] },
    category: {
      type: String,
      enum: [
        "electronic",
        "clothing",
        "toys & games",
        "sports & outdoors",
        "arts & crafts",
        "phones & accessories",
      ],
      required: true,
    },
    type: {
      type: String,
      enum: ["sale", "trade", "wanted", "rent"],
      required: true,
    },
    location: { type: String, required: true },
    conditon: {
      type: String,
      enum: ["new", "like new", "good condition", "acceptable", "not working"],
    },
  },
  { timeStamps: true }
);

const Annonce = mongoose.model("Annonce", annonceSchema);
export default Annonce;
