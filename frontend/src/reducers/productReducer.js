import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS,
  } from "../constants/productConstants";
  
  const initialState = {
    products: [], // Note: use 'products' instead of 'product' to match your payload
    loading: false,
    error: null,
    productsCount: 0, // Initialize productsCount
  };
  
  export const productReducer = (state = initialState, action) => {
    switch (action.type) {
      case ALL_PRODUCT_REQUEST:
        return {
          ...state,
          loading: true,
          products: [],
        };
      case ALL_PRODUCT_SUCCESS:
        return {
          ...state,
          loading: false,
          products: action.payload.products,
          productsCount: action.payload.productsCount,
        };
      case ALL_PRODUCT_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  