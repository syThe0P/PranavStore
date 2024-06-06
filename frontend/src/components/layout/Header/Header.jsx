import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'; // or your custom icons


const options = {
  burgerColorHover: "#eb4034",
  logo, // Provide your actual logo URL or element here
  logoWidth: "20vmax",
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "#eb4034",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.3vmax",
  link1Color: "rgba(35, 35, 35,0.8)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#eb4034",
  link1Margin: "1vmax",
  profileIconColor: "rgba(35, 35, 35,0.8)",
  searchIconColor: "rgba(35, 35, 35,0.8)",
  cartIconColor: "rgba(35, 35, 35,0.8)",
  profileIconColorHover: "#eb4034",
  searchIconColorHover: "#eb4034",
  cartIconColorHover: "#eb4034",

  // Adding the required properties for the icons
  searchIcon: true,
  SearchIconElement: FaSearch, // React component for the search icon
  cartIcon: true,
  CartIconElement: FaShoppingCart, // React component for the cart icon
  profileIcon: true,
  ProfileIconElement: FaUser, // React component for the profile icon

  // Additional properties for icons
  searchIconMargin: "1vmax",
  cartIconMargin: "1vmax",
  profileIconMargin: "1vmax",
  searchIconUrl: "/search",
  cartIconUrl: "/cart",
  profileIconUrl: "/account",
  searchIconSize: "2vmax",
  cartIconSize: "2vmax",
  profileIconSize: "2.5vmax",
  searchIconTransition: 0.5,
  cartIconTransition: 0.5,
  profileIconTransition: 0.5,
  searchIconAnimationTime: 2,
  cartIconAnimationTime: 2.5,
  profileIconAnimationTime: 3
};


const Header = () => {
  return <ReactNavbar {...options} />;
};

export default Header;