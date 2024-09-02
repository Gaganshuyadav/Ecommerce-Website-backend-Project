import { useEffect,useS } from "react";
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

function App() {
  
  const { isAuthenticated, user, error} = useSelector( state=>state.user);
  const dispatch = useDispatch();
  const alert = useAlert();

  useEffect(()=>{
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
    </Routes>
    <Footer/>
    </>
  )
}

export default App;
