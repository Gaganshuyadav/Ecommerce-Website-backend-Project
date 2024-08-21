import { createRoot } from 'react-dom/client'
import React from "react";
import App from './App.jsx'
//
import { BrowserRouter } from 'react-router-dom'
//
import {  Provider } from "react-redux";
import store from "./store.jsx";
//
import { transitions, positions, Provider as AlertProvider} from "react-alert";
import AlertTemplate from "react-alert-template-basic";
const  options={
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  transition: transitions.SCALE,
}

createRoot(document.getElementById('root')).render(
      <BrowserRouter> 
          <Provider store={ store}>  
              <AlertProvider template={ AlertTemplate} {...options}>
                <App/>
              </AlertProvider>
          </Provider>  
      </BrowserRouter>
)
