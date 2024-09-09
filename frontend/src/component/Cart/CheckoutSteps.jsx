import { Fragment, useState} from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import "./CheckoutSteps.css";
  
export default function CheckoutSteps( {activeStep}){

    const steps = [ 
        { label: "Shipping Details", icon: <LocalShippingIcon/>}, 
        { label: "Confirm Order", icon: <LibraryAddCheckIcon/>}, 
        { label: "Payment", icon: <AccountBalanceIcon/>}
    ]; 

    
    return(
        <Fragment>
            <Box sx={{ width: "90vw", margin:"1vmax auto" ,}} >
            <Stepper activeStep={ activeStep} alternativeLabel>
                {
                steps.map(( item, idx)=>{
                    return (
                    <Step key={idx} active={activeStep === idx ? true : false} completed={activeStep >= idx ? true : false}>
                      <StepLabel icon={item.icon} style={{color: idx<=activeStep ? "tomato" : "black" }}>{item.label}</StepLabel>
                    </Step>   
                    )
                })
            }  
           
            </Stepper> 
            </Box>
        </Fragment>
    )
}