import { useEffect,useState } from "react";
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer.jsx";
import Home from "./component/home/Home.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import webFont from "webfontloader";
import "./App.css";
import ProductDetails from "./component/Product/ProductDetails.jsx";
import Products from "./component/Product/Products.jsx";
import Search from "./component/Product/Search.jsx";
import LoginSignUp from "./component/User/LoginSignUp.jsx";
import { useDispatch, useSelector} from "react-redux";
import { loadUser} from "./features/Slices/UserSlice.jsx";
import UserOptions from "../src/component/layout/Header/UserOptions.jsx";
import { useAlert } from "react-alert"; 
import Profile from "../src/component/User/Profile.jsx";
import UpdateProfile from "../src/component/User/UpdateProfile.jsx";
import UpdatePassword from "../src/component/User/UpdatePassword.jsx";
import ForgotPassword from "../src/component/User/ForgotPassword.jsx";
import ResetPassword from "../src/component/User/ResetPassword.jsx";
import Cart from "./component/Cart/Cart.jsx";
import Shipping from "./component/Cart/Shipping.jsx";
import ConfirmOrder from "./component/Cart/ConfirmOrder.jsx";
import axios from "axios";
import OrderSuccess from "./component/Cart/OrderSuccess.jsx";
import MyOrders from "./component/Order/MyOrders.jsx";
import OrderDetails from "./component/Order/OrderDetails.jsx";
//payment
import PaymentKey from "./component/Cart/PaymentKey.jsx";

function App() {
  
  const { isAuthenticated, user, error} = useSelector( state=>state.user);
  const dispatch = useDispatch();
  const alert = useAlert();


  useEffect(()=>{

    //load the font 
    webFont.load({
      google: {
        families: ["Roboto","Drop Sans","Chilanka"],
      }
    }) 

    //load user using token 
    dispatch(loadUser());

  },[]);

  
  return (
    <>
    <Header/>
    { isAuthenticated && <UserOptions user={user} />}
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/product/:id" element={<ProductDetails/>}/>
      <Route path="/products" element={<Products/>} />
      <Route path="/search" element={<Search/>} />
      <Route path="/products/:keyword" element={<Products/>}/>
      <Route path="/login" element={<LoginSignUp/>} />
      <Route path="/account" element={ isAuthenticated ? <Profile/> : <Navigate to="/login" />} />
      <Route path="/me/update" element={ isAuthenticated ? <UpdateProfile/> : <Navigate to="/login"/> } />
      <Route path="/password/update" element={ isAuthenticated ? <UpdatePassword/>: <Navigate to="/login"/>} />
      <Route path="/password/forgot" element={<ForgotPassword/>}/>
      <Route path="/password/reset/:token" element={<ResetPassword/>} />


      <Route path="/cart" element={<Cart/>} />
      <Route path="/shipping" element={ isAuthenticated ? <Shipping/> : <Navigate to="/login"/> } />
      <Route path="/order/confirm" element={ isAuthenticated ? <ConfirmOrder/> : <Navigate to="/login"/>} />
      {/* payment route */}
      <Route path="/process/payment" element={ isAuthenticated ? <PaymentKey/> : <Navigate to="/login"/>} />
      <Route path="/success" element={<OrderSuccess/>}/>
      <Route path="/orders" element={ isAuthenticated ? <MyOrders/> : <Navigate to="/login"/>} />
      <Route path="/order/details/:id" element={ isAuthenticated ? <OrderDetails/> : <Navigate to="/login" />} /> 


      </Routes>
    <Footer/>
    </>
  )
}

export default App;
