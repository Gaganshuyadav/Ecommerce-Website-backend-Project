import { useEffect} from "react";
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer.jsx";
import Home from "./component/home/Home.jsx";
import { Routes, Route } from "react-router-dom";
import webFont from "webfontloader";
import "./App.css";
import ProductDetails from "./component/Product/ProductDetails.jsx";
import Products from "./component/Product/Products.jsx";
import Search from "./component/Product/Search.jsx";
import LoginSignUp from "./component/User/LoginSignUp.jsx";

function App() {
  
  useEffect(()=>{
    webFont.load({
      google: {
        families: ["Roboto","Drop Sans","Chilanka"],
      }
    })
  },[]);

  return (
    <>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/product/:id" element={<ProductDetails/>}/>
      <Route path="/products" element={<Products/>} />
      <Route path="/search" element={<Search/>} />
      <Route path="/products/:keyword" element={<Products/>}/>
      <Route path="/login" element={<LoginSignUp/>} />
    </Routes>
    <Footer/>
    </>
  )
}

export default App;
