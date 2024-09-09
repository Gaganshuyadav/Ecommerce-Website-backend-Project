import { Fragment, useState} from "react";
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PinDropIcon from '@mui/icons-material/PinDrop';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PublicIcon from '@mui/icons-material/Public';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { Country, City,State } from "country-state-city";
import "./Shipping.css";
import { useSelector, useDispatch} from "react-redux";
import { saveShippingInfo} from "../../features/Slices/CartSlice";
import { useAlert} from "react-alert";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import { useNavigate} from "react-router-dom";

export default function Shipping(){

    const { shippingInfo} = useSelector(state=>state.cart);
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const [ address, setAddress] = useState(shippingInfo.address);
    const [ city, setCity] = useState(shippingInfo.city);
    const [ pinCode, setPinCode] = useState(shippingInfo.pinCode);
    const [ phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [ country, setCountry] = useState(shippingInfo.country);
    const [ state, setState] = useState(shippingInfo.state);

    const shippingSubmit =(e)=>{
        e.preventDefault();
        if(phoneNo.length > 10 || phoneNo.length < 10){
            alert.error("Phone Number Should be 10 digits Long");
            return;
        }
        else{
            dispatch(saveShippingInfo( { address, city, pinCode, phoneNo, country, state}));
            navigate("/order/confirm");
        }

    }
    
    return(
        <Fragment>
            <MetaData title="Shipping Details" />
            
            <CheckoutSteps activeStep={0} />

            <div className="shippingContainer">
                <div className="shippingBox">
                    <h2 className="shippingHeading">Shipping Details</h2>
                    
                    <form className="shippingForm" onSubmit={shippingSubmit}>
                        <div>
                            <HomeIcon/>
                            <input type="text" placeholder="Address" value={address} onChange={ ( e)=>setAddress(e.target.value)} required/>
                        </div>
                        <div>
                            <LocationCityIcon/>
                            <input type="text" placeholder="City" value={city} onChange={ ( e)=>setCity(e.target.value)} required/>
                        </div>
                        <div>
                            <PinDropIcon/>
                            <input type="number" placeholder="Pin Code" value={pinCode} onChange={ ( e)=>setPinCode(e.target.value)} required/>
                        </div>
                        <div>
                            <LocalPhoneIcon/>
                            <input type="number" placeholder="Phone Number" value={phoneNo} size="10" onChange={ ( e)=>setPhoneNo(e.target.value)} required/>
                        </div>
                        <div>
                            <PublicIcon/>
                            <select value={country} onChange={(e)=>{ setCountry(e.target.value)} } required>
                                <option value="">Country</option>
                                { 
                                    Country.getAllCountries().map( (item)=>{
                                        return <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        { country && <div>
                            <TransferWithinAStationIcon/>
                            <select value={state} onChange={ (e)=>{setState(e.target.value)}} required>
                                <option value="">State</option>
                                {
                                    State.getStatesOfCountry(country).map((item)=>{
                                        return <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                    })
                                }
                            </select>
                            
                        </div>
                        }
                        <button className="shippingBtn" disabled={ state && phoneNo ? false : true}>Continue</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}