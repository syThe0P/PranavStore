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
  if(!updateProduct){
    throw new ApiError(404, "product did not updated")
  }

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
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, productID } = req.body;

  // Validate input
  if (!rating || !productID) {
    throw new ApiError(400, "Rating and product ID are required");
  }

  // Construct review object
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  // Find the product by ID
  const product = await Product.findById(productID);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if the product is already reviewed by the user
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  // Update review if it exists, otherwise add a new review
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length; // Corrected typo here
  }
  // Log the reviews and numOfReviews for debugging
  console.log('Reviews:', product.reviews);
  console.log('Number of Reviews:', product.numOfReviews);

  // Calculate the average rating
  const avgRating =
    product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
    product.reviews.length;



  product.ratings = avgRating;

  // Save the product
  await product.save({ validateBeforeSave: false });

  // Send response
  res.json(new ApiResponse(200, product, "Review added/updated successfully"));
});



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
const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.query;

  // Find the product by ID
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Filter out the review to be deleted
  const updatedReviews = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId.toString()
  );

  // Calculate the new average rating
  let avg = 0;
  updatedReviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = updatedReviews.length > 0 ? avg / updatedReviews.length : 0;

  // Update the number of reviews
  const numOfReviews = updatedReviews.length;

  // Update the product with the new reviews, ratings, and number of reviews
  await Product.findByIdAndUpdate(
    productId,
    {
      reviews: updatedReviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  // Send response
  res.status(200).json({
    message: "Review deleted successfully",
  });
});





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
