import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//Create New Order
const newOrder = asyncHandler(async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.json(new ApiResponse(200, order, "Order created Successfully"));
});

//get Single order --Admin
const getSingleOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    throw new ApiError(401, "Order not found");
  }

  res.json(new ApiResponse(200, order, `Your order of id ${req.params.id}`));
});


//Get logged in user Orders   //Getting error here
const getOrders = asyncHandler(async(req,res)=>{
    const orders = await Order.find({user: req.user.id});
    if(!orders) throw new ApiError(401, "You have no orders yet")

    res.json(new ApiResponse(
        200,
        orders,
        "Here are your orders"
    ))
})

//GET all orders --Admin
const getAllOrders = asyncHandler(async(req,res)=>{
    const orders = await Order.find();
    if(!orders) throw new ApiError(401, "You have no orders yet")
    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    })

    res.json(new ApiResponse(
        200,
        orders,
        totalAmount,
        "Here are your orders"
    ))
})


//Update Order Status
const updateOrder = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.orderStatus === "Delivered") {
        throw new ApiError(400, "This order has already been delivered");
    }

    order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity); // Assuming 'Product' is the correct property name
    });

    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.json(new ApiResponse(
        200,
        "Order status updated"
    ));
});


//Function to update stock
async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;
    await product.save({validateBeforeSave: false})
}


//Delete Order
const deleteOrder = asyncHandler(async(req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    res.json(new ApiResponse(
        200,
        "Order deleted"
    ));
});


export { newOrder, getSingleOrder,getOrders,getAllOrders, updateOrder,deleteOrder};
