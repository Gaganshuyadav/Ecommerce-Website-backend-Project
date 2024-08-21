import ProfileImg from "/images/Profile.png"
import ReactStars from "react-rating-stars-component";
import "./ReviewCard.css";

export default function ReviewCard( {review }){

    const options ={
        edit:false,
        color: "rgba(20,20,20,0.1)",
        size: window.innerWidth < 600 ? 19 : 26,
        activeColor:"tomato",
        value: review.rating ,
        isHalf: true,

    };

    return(
        <div className="reviewCard">
            <img src={ ProfileImg}/>
            <h3>{review.name}</h3>
            <ReactStars {...options} />
            <p>{review.comment}</p>
        </div>
    )
}