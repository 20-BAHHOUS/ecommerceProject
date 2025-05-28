import Order from "../models/order.js";
import Annonce from "../models/annonce.js";
import { createNotification } from "../controllers/notificationController.js";

const placeOrder = async (req, res) => {
  try {
    const { annonceId, negotiablePrice } = req.body;

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

    // Get the seller ID
    const sellerId = annonce.createdBy;

    // Check if the seller is the same as the buyer
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
      negotiablePrice: negotiablePrice || null,
    });

    const savedOrder = await newOrder.save();

    // Create notification for buyer
    let notificationMessage = `New order request received for your announcement: ${annonce.title}`;
    if (negotiablePrice) {
      notificationMessage += `. Buyer has suggested a negotiable price of ${negotiablePrice} DZD`;
    }

    // Create notification for seller
    await createNotification({
      recipient: sellerId,
      type: "ORDER_REQUEST",
      message: notificationMessage,
      relatedOrder: savedOrder._id,
      metadata: {
        annonceId: annonceId,
        annonceTitle: annonce.title,
        buyerId: buyerId,
        negotiablePrice: negotiablePrice || null,
      },
    });

    res.status(201).json({
      success: true,
      data: savedOrder,
      message: "Order request sent successfully.",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order" });
  }
};

const getByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ buyer: userId })
      .populate("annonce", "title images price description")
      .populate("seller", "fullName email phone");
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
      .populate("annonce", "title images price description")
      .populate("buyer", "fullName email phone");
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
    const userId = req.user._id;

    const order = await Order.findById(orderId).populate("annonce");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify the user is the seller
    if (order.seller.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    order.status = status;
    await order.save();

    // Create notification for buyer
    await createNotification({
      recipient: order.buyer,
      type: "ORDER_STATUS_CHANGE",
      message: `Your order for "${order.annonce.title}" has been ${status}`,
      relatedOrder: order._id,
      metadata: {
        annonceId: order.annonce._id,
        annonceTitle: order.annonce.title,
        newStatus: status,
      },
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
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

    // Check if the user is authorized to delete the order
    const isBuyer = order.buyer.toString() === userId.toString();
    const isSeller = order.seller.toString() === userId.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: "You are not authorized to delete this order." });
    }

    // Buyer can only cancel pending orders
    if (isBuyer && order.status !== 'pending') {
      return res.status(400).json({ message: "Only pending orders can be cancelled by buyers." });
    }

    // Seller can delete accepted or rejected orders
    if (isSeller && order.status !== 'accepted' && order.status !== 'rejected') {
      return res.status(400).json({ message: "Only accepted or rejected orders can be deleted by sellers." });
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully."
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
