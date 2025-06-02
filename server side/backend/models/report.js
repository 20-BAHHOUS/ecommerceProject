import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    announcement: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Annonce',
      required: true 
    },
    reportedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    reason: { 
      type: String, 
      required: true,
      enum: ["inappropriate", "spam", "fraud", "offensive", "other"]
    },
    details: { 
      type: String
    }
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only report an announcement once
reportSchema.index({ announcement: 1, reportedBy: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);
export default Report; 