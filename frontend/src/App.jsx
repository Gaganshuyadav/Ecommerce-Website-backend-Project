import { useEffect} from "react";
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer.jsx";
import Home from "./component/home/Home.jsx";
import { Routes, Route } from "react-router-dom";
import webFont from "webfontloader";


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
    </Routes>
    <Footer/>
    </>
  )
}

export default App;
