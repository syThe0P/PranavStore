import React, { useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Product from "./Product.jsx";
import MetaData from "../layout/MetaData.jsx";
import { getProduct, clearErrors } from "../../actions/productAction.js";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
import {useAlert} from "react-alert"

const Home = () => {
    const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products, productsCount } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getProduct());

    if (error) {
      // Handle error appropriately
      return alert.error(error);
    }
  }, [dispatch, error,alert]);
  return (
    <>
      {loading ? (
        <Loader/>
      ) : (
        <>
          <MetaData title="ECCOMERCE" />
          <div className="banner">
            <p>Welcome to Ecoomerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>
          <div className="container" id="container">
            {products?.map((product) => (
              <Product product={product} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
