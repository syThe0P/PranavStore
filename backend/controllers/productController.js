import Product from "../models/ProductModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

//create product - admin
const createProduct = asyncHandler(async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.json(new ApiResponse(201, product, "Product created successfully"));
});

//get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
  .search()
  .filter()
  .pagination(resultPerPage);

  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
  })
});

//update product --admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(500, " Product not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.json(
    new ApiResponse(201, updatedProduct, "Product is updated succesfully")
  );
});

//delete product -admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(500, " Product not found");
  }

  await product.deleteOne();
  res.json(new ApiResponse(201, [], "Product deleted succesfully"));
});

//Get single product
const getProductDetails = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(401, "Product not found");
  }
  res.json(new ApiResponse(201, product, "Product Found"));
});

//Create product reviews
const createProductReview = asyncHandler(async(req, res)=>{
  const {rating, comment, productID} = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  }
  const product = await Product.findById(productID)
   const isReviewed = product.reviews.find((rev)=>rev.user.toString() === req.user._id.toString());

  if(isReviewed){
    product.reviews.forEach((rev)=>{
      if(rev.user.toString() === req.user._id.toString())
      (rev.rating = rating), (rev.comment = comment);
    })
  }
  else{
    product.reviews.push(review);
    product.numofReviews = product.reviews.length;
  }


  let avg = 0;
  product.reviews.forEach((rev) =>{
    avg += rev.rating;
  })

  product.ratings = avg / product.reviews.length;


  await product.save({validateBeforeSave: false})


  res.json(new ApiResponse(
    200,
    "Review Updated"
  ))
})


//Get all Reviews of a product
const getProductReviews = asyncHandler(async(req,res)=>{
  const product = await Product.findById(req.query.id);

  if(!product) throw new ApiError(404, "Product not found")


  res.json(new ApiResponse(
    200,
    product.reviews,
    "All Reviews"
  ))
})


//Delete reviews
const deleteReview = asyncHandler(async(req, res) =>{
  const product = await Product.findById(req.query.productId);

  if(!product) throw new ApiError(404, "Product not found")


  const review = product.reviews.filter(
    (rev)=> rev._id.toString() !== req.query.id.toString()
  )

  let avg = 0;
  review.forEach((rev) =>{
    avg += rev.rating;
  })

  const ratings = avg / review.length;
  const numofReviews = review.length;

  await product.findByIdAndUpdate(req.query.productID, {
    review,
    ratings,
    numofReviews,
  },{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    message: "Reviews deleted"
  })
})




export {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview
};
