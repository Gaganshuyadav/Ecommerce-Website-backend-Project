import "./Dashboard.css";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { Typography } from "@mui/material";
import { Link} from "react-router-dom";
import { Doughnut, Line} from "react-chartjs-2";
import { useAlert} from "react-alert";
import { useEffect} from "react";
import { useSelector, useDispatch} from "react-redux";
import { CategoryScale, Chart, LinearScale, LineElement, PointElement, ArcElement, Tooltip, Legend, plugins } from "chart.js";
import { getAdminProduct} from "../../features/Slices/ProductSlice";
import { getAllOrders } from "../../features/Slices/OrderSlice";
import { getAllUsers} from "../../features/Slices/UserSlice";

Chart.register( LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend );
 
export default function Dashboard(){

    const dispatch = useDispatch();
    const alert = useAlert();
    const { error, loading, products } = useSelector( state=>state.products);
    const { orders } = useSelector( state=>state.order);
    const { users } = useSelector( state=>state.user);

    let outOfStock=0;
    products && products.forEach(( product)=>{
        if(product.Stock===0){
            outOfStock += 1;
        }
    });

    let totalAmount=0; 
    orders && orders.forEach(( order)=>{
        totalAmount += order.totalPrice; 
    })

    const lineState ={
        labels: [ "Initial Amount","Amount Earned" ],
        datasets:[
            {
            label:'total amount',
            backgroundColor:["red"],
            hoverBackgroundColor:["blue"],
            data: [ 0, totalAmount],
            borderColor:"rgb(75,192,192)",
            hover:"rgb(75,112,192)",
            fill:true,
            },
        ],
    };

    const doughnutState = {
        labels:[ "Out of Stock", "InStock"],
        datasets: [{
            label: "My First Dataset",
            data: [ outOfStock, products ? products.length-outOfStock : 0],
            backgroundColor: [
                "red",
                "blue",
            ],
        },
    ],
    }

    useEffect(()=>{
        dispatch( getAdminProduct());
        dispatch( getAllOrders());
        dispatch( getAllUsers());

        if(error){
            alert.error(error);
        }
    },[error]);

    return(
        <div class="dashboard">
            <MetaData title="dashboard - Admin Panel"/>
            <div className="leftSide">
                <Sidebar />
            </div>
            <div className="rightSide">
                <div  className="dashboardSummery">
                    <Typography>Dashboards</Typography>
                    <div className="dsBox1">
                        <p>Total Amount</p>
                        <p>&#8377;{ totalAmount}</p>
                    </div>
                    <div className="dsBox2">
                        <div className="b1">
                          <Link to="/admin/products">
                            <p>Products</p>
                            <p>{ products && products.length}</p>
                          </Link>
                        </div>
                        <div className="b2">
                          <Link to="/admin/orders">
                            <p>Orders</p>
                            <p>{ orders && orders.length}</p>
                          </Link>
                        </div>
                        <div className="b3">
                          <Link to="/admin/users">
                            <p>Users</p>
                            <p>{ users && users.length}</p>
                          </Link>
                        </div>
                    </div>
                </div>
                <div className="lineChart">
                    <Line
                        data={lineState}
                    />
                </div>
                <div className="doughnut">
                    <Doughnut
                        data={doughnutState}
                    />
                </div>
            </div>
        </div>
    )
}




