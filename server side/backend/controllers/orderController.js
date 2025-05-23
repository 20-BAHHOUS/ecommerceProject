import Order from "../models/order.js";
import Annonce from "../models/annonce.js";

const placeOrder = async (req, res) => {
  try {
    const { annonceId } = req.body;

    if (!annonceId) {
      return res.status(400).json({ message: "Announcement ID is required." });
    }

    const buyerId = req.user._id;

    // Find the annonce to confirm it exists
    const annonce = await Annonce.findById(annonceId);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce not found." });
    }

    // Check if createdBy field exists
    if (!annonce.createdBy) {
      return res.status(400).json({
        message:
          "Announcement has no seller information. This is likely because it was created before seller tracking was implemented.",
        errorCode: "MISSING_SELLER",
      });
    }

    // Use the createdBy field directly without population
    const sellerId = annonce.createdBy;

    // Prevent ordering your own announcement
    if (sellerId.toString() === buyerId.toString()) {
      return res.status(400).json({
        message: "You cannot place an order on your own announcement.",
        errorCode: "SELF_ORDER",
      });
    }

    // Check if an order already exists for this annonce and buyer
    const existingOrder = await Order.findOne({
      annonce: annonceId,
      buyer: buyerId,
    });

    if (existingOrder) {
      return res.status(400).json({
        message: "You have already placed an order for this announcement.",
        errorCode: "DUPLICATE_ORDER",
      });
    }

    const newOrder = new Order({
      annonce: annonceId,
      buyer: buyerId,
      seller: sellerId,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      data: savedOrder,
      message: "Order request sent successfully.",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Could not place order.", error: error.message });
  }
};

const getByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ buyer: userId })
      .populate("annonce", "title images")
      .populate("seller", "fullName email");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error getting user orders:", error);
    res.status(500).json({
      message: "Could not retrieve order requests.",
      error: error.message,
    });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ seller: sellerId })
      .populate("annonce", "title images")
      .populate("buyer", "fullName email");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error getting seller orders:", error);
    res.status(500).json({
      message: "Could not retrieve order requests.",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const sellerId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order request not found." });
    }

    if (order.seller.toString() !== sellerId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this order." });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: `Order ${status} successfully.`,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Could not update order status.",
      error: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    // Find the order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Check if the user is the buyer of the order
    if (order.buyer.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this order." });
    }

    // Check if the order is in 'pending' status
    if (order.status !== 'pending') {
      return res.status(400).json({ message: "Only pending orders can be cancelled." });
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully."
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      message: "Could not delete order.",
      error: error.message
    });
  }
};

export { placeOrder, getSellerOrders, updateOrderStatus, getByUser, deleteOrder };
