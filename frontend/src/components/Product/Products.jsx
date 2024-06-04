import React, { useEffect } from "react";
import ProductCard from "../Home/ProductCard.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import { getProduct, clearErrors } from "../../actions/productAction.js";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import "./Products.css"

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
