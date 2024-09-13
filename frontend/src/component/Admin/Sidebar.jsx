//icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import logo from "/images/logo.png";
import "./Sidebar.css";
//main
import { SimpleTreeView} from "@mui/x-tree-view/SimpleTreeView";
import {TreeItem} from "@mui/x-tree-view/TreeItem";
import { Link} from "react-router-dom";

export default function Sidebar(){

    return(
        <div className="sidebar">

            <Link to="/">
            <div className="logo">
                <img src={logo}/>
            </div> 
            </Link>

            <Link to="/admin/dashboard">
            <div className="dashboardSidebar">
                <DashboardIcon/>
                <div>Dashboard</div>
            </div>
            </Link>

            <SimpleTreeView>
                <TreeItem itemId="products" label="Products"> 
                    <Link to="/admin/products">
                        <div className="all">
                            <LocalMallIcon/>
                            <TreeItem itemId="all" label="All" />
                        </div>
                    </Link>  
                    <Link to="/admin/create/product">
                        <div className="create">
                            <AddIcon/>
                            <TreeItem itemId="create" label="Create" />
                        </div>
                    </Link>
                </TreeItem>
            </SimpleTreeView>
            
            <Link to="/admin/orders">
            <div className="orders">
                <ListAltIcon/>
                <div>Orders</div>
            </div>
            </Link>
            
            <Link to="/admin/users">
            <div className="users">
                <PeopleIcon/>
                <div>Users</div>
            </div>
            </Link>
            
            <Link to="/admin/reviews"> 
            <div className="reviewsD">
                <RateReviewIcon/>
                <div>Reviews</div>
            </div>
            </Link>
           
        </div>
    )
}