import React from 'react'
import { CgMouse } from "react-icons/cg";
import './Home.css'
import Product from "./Product.jsx"

const product = {
    name: "Blue Tshirt",
    images:[{url:"https://thumbs.dreamstime.com/b/blue-t-shirt-18820766.jpg"}],
    price: "3000",
    _id: "abhishek"
};

const Home = () => {
  return (
    <>
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