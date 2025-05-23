import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true
    },
    slug: { 
      type: String, 
      required: true,
      unique: true
    },
    description: { 
      type: String 
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
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Subcategory',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Create slug before saving
categorySchema.pre('save', function(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);
export default Category; 