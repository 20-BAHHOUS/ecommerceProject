import Order from "../models/order.js";
import Annonce from "../models/annonce.js";

const placeOrder = async (req, res) => {
  try {
    const { annonceId } = req.body;
    const buyerId = req.user._id;

    const annonce = await Annonce.findById(annonceId).populate("createdBy");
    if (!annonce) {
      return res.status(404).json({ message: "Annonce not found." });
    } 

    const sellerId = annonce.createdBy._id;

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
    res
      .status(500)
      .json({ message: "Could not place order.", error: error.message });
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
    const sellerId = req.user._id; // Get the ID of the logged-in user

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

export { placeOrder, getSellerOrders, updateOrderStatus };
