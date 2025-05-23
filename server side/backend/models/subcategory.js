import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    slug: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    icon: { 
      type: String 
    },
    image: { 
      type: String 
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    path: {
      type: String,
      required: true,
      default: '/'
    }
  },
  { timestamps: true }
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