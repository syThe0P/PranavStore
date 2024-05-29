// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import { productReducer } from './reducers/productReducer.js'

const rootReducer = combineReducers({
  product: productReducer,
  // Add other reducers here
});

export default rootReducer;