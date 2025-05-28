import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },  
    isActive: {
      type: Boolean,
      default: true
    },

  },
);

// Create compound index for unique subcategories within a category
subcategorySchema.index({ parentCategory: 1, slug: 1 }, { unique: true });

// Create slug before saving
subcategorySchema.pre('save', function(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

const Subcategory = mongoose.model("Subcategory", subcategorySchema);
export default Subcategory; 