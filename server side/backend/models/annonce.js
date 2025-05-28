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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true
    },
    type: {
      type: String,
      enum: ["sale", "trade", "wanted", "rent"],
      required: true,
    },
    condition: {
      type: String,
      enum: {
        values: ["new", "like new", "good condition", "acceptable", "not working"],
        message: "'{VALUE}' is not a valid condition"
      },
      validate: {
        validator: function(v) {
         
          return v === '' || ["new", "like new", "good condition", "acceptable", "not working"].includes(v);
        },
        message: props => `${props.value} is not a valid condition`
      }
    },
   
  },
  { timestamps: true }
);

annonceSchema.index({ category: 1, subcategory: 1 });
annonceSchema.index({ createdAt: -1 });

const Annonce = mongoose.model("Annonce", annonceSchema);
export default Annonce;
