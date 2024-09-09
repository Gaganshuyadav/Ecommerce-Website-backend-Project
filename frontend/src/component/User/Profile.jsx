import { Fragment, useEffect} from "react";
import { useSelector} from "react-redux";
import { Link} from "react-router-dom";
import "./Profile.css";
import Loader from "../layout/Loader/Loader";

export default function Profile(){

    const { user, loading } = useSelector( state=>state.user);
    
    return(
        <Fragment>
          {
            loading ?
            <Loader/> :
          <div className="profileContainer">
            <div>
                <h1>My Profile</h1>
                <img src={user.avatar.url} alt={user.name}/>
                <Link to="/me/update">Edit Profile</Link>
            </div>
            <div>
                <div>
                  <h4>Full Name</h4>
                  <p>{user.name}</p>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>{user.email}</p>
                </div>
                <div>
                  <h4>Joined On</h4>
                  <p>{`${user.createdAt.split(" ")[1]}-${user.createdAt.split(" ")[2]}-${user.createdAt.split(" ")[3]}`}</p>
                </div>
                <div>
                  <Link to="/orders">My Orders</Link>
                  <Link to="/password/update">Change Password</Link>
                </div>
            </div>
          </div>
         }
        </Fragment>
    )
}