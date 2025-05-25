import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    annonce: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Annonce',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
    },
    negotiablePrice: {
      type: Number,
      default: null,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;