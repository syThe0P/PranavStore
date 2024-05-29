import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import rootReducer from './rootReducer'; // Assuming you have reducers defined in a separate file

const store = configureStore({
  reducer: rootReducer, // Pass your root reducer
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Add thunk middleware
  preloadedState: {}, // Your initial state
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

export default store;
