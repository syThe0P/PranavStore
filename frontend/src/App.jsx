import "./App.css";
import { useEffect } from "react";
import Header from "./components/layout/Header/Header.jsx";
import Footer from "./components/layout/Footer/Footer.jsx";
import Home from "./components/Home/Home.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, []);

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
