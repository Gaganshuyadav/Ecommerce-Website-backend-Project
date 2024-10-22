import Appstore from "/images/Appstore.png";
import playstore from "/images/playstore.png";
import "./Footer.css";
import Grid from "@mui/material/Unstable_Grid2";

export default function Footer(){

    return(
        <Grid conatiner className="footer">
            <Grid className="leftFooter">
                <h5>DOWNLOAD OUR APP</h5>
                <h3>Download App for Android and IOS mobile phone</h3>
                <img src={Appstore} alt="Appstore"/>
                <img src={playstore} alt="playstore"/>
            </Grid>
            <Grid className="midFooter">
                <h1>Ecommerce.</h1>
                <p>High Quality is our first priority</p>
                <p>Copyrights 2021 &copy;Gaganshu Yadav</p>
            </Grid>
            <Grid className="rightFooter">
                <h2>Follow Us</h2>
                <a href="https://instagram.com">Instagram</a>
                <a href="https://youtube.com">Youtube</a>
                <a href="https://facebook.com">Facebook</a>
            </Grid>
        </Grid>
    )
}