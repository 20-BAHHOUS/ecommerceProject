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
);

const Report = mongoose.model("Report", reportSchema);
export default Report; 