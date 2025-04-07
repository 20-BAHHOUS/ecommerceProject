import mongoose from "mongoose";

const annonceSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      validate: {
        validator: function (value) {
          // Make price required if 'productType' is 'trade' or 'rent'
          return (
            this.ProductType === "trade" ||
            this.ProductType === "rent" ||
            value !== undefined
          );
        },
        message:
          "Price is required for 'trade' or 'rent' products and must be greater than 0.",
      },
    },
    image: { type: [String] },
    category: {
      type: String,
      enum: ["electronic", "Clothing", "", "Toys & Games", "Sports & Outdoors","Arts & Crafts","Phones & Accessories"],
      required: true,
    },
    AnnonceType: {
      type: String,
      enum: ["sale", "trade", "free","wanted","rent"],
      required: true,
    },
    location: { type: String, required: true },
    conditon: { type: [String], enum: ["new", "like new","good condition","Acceptable","not working"], required: true },
  },
  { timeStamps: true }
);

const Annonce = mongoose.model("annonce", annonceSchema);
export default Annonce;
