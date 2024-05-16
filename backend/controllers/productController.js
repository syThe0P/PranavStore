import Product from "../models/ProductModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//create product - admin
const createProduct = asyncHandler(async(req, res) =>{
    const product = await Product.create(req.body);
    res.json(new ApiResponse(
        201,
        product,
        "Product created successfully"
    ));
})

//get all products
const getAllProducts = asyncHandler(async(req, res) =>{
    const products = await Product.find({});
    res.json(new ApiResponse(
        201,
        products,
        "All products displayed"
    ));

})

//update product --admin
const updateProduct = asyncHandler(async(req, res) =>{
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new ApiError(500, " Product not found")
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators:true,
        useFindAndModify: false
    })

    
    res.json(new ApiResponse(
        201,
        updatedProduct,
        "Product is updated succesfully"
    ));
})

//delete product -admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new ApiError(500, " Product not found")
    }


    await product.deleteOne();
    res.json(new ApiResponse(
        201,
        [],
        "Product deleted succesfully"
    ));

})

export {createProduct,getAllProducts,updateProduct,deleteProduct};