import "./App.css";
import { useEffect } from "react";
import Header from "./components/layout/Header/Header.jsx";
import Footer from "./components/layout/Footer/Footer.jsx";
import Home from "./components/Home/Home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Routes and Route
import WebFont from "webfontloader";
import ProductDetails from "./components/Product/ProductDetails.jsx";
import Products from "./components/Product/Products.jsx"
import Search from "./components/Product/Search.jsx"
import LoginSignup from "./components/User/LoginSignup.jsx";
function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
