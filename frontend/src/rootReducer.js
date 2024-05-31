// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import { productDetailsReducer, productReducer } from './reducers/productReducer.js'

const rootReducer = combineReducers({
  product: productReducer,
  productDetails:productDetailsReducer,
  // Add other reducers here
});

export default rootReducer;