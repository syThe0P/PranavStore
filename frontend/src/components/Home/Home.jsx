import React, { useEffect } from 'react'
import { CgMouse } from "react-icons/cg";
import './Home.css'
import Product from "./Product.jsx"
import MetaData from '../layout/MetaData.jsx';
import {getProduct, clearErrors} from "../../actions/productAction.js"
import {useSelector, useDispatch} from "react-redux"



const product = {
    name: "Blue Tshirt",
    images:[{url:"https://thumbs.dreamstime.com/b/blue-t-shirt-18820766.jpg"}],
    price: "3000",
    _id: "abhishek"
};

const Home = () => {
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(getProduct());

        if (error) {
            // Handle error appropriately
            console.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error]);
  return (
    <>
    <MetaData title="ECCOMERCE"/>
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
    <div className="container" id='container'>
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
    </div>
    </>
  )
}

export default Home