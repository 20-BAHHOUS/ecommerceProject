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
    condition: {
      type: String,
      enum: {
        values: ["new", "like new", "good condition", "acceptable", "not working"],
        message: "'{VALUE}' is not a valid condition"
      },
      validate: {
        validator: function(v) {
          // Allow empty strings (they will be set to undefined)
          return v === '' || ["new", "like new", "good condition", "acceptable", "not working"].includes(v);
        },
        message: props => `${props.value} is not a valid condition`
      }
    },
  },
  { timestamps: true }
);

const Annonce = mongoose.model("Annonce", annonceSchema);
export default Annonce;
