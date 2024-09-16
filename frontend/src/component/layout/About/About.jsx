import { Typography } from "@mui/material";
import "./About.css";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function About(){

    return (
        <div className="about">
            <div className="aboutBox">
                <div className="aboutBox1">
                    <Typography>About Us</Typography>
                </div>
                <div className="aboutBox2">
                    <div  className="ab2Profile">
                        <div>
                            <div><img src="/images/metroid-pacific-rim-robot-zi.jpg" /></div>
                           <Typography>Gaganshu yadav</Typography>
                           <div><a href="https://github.com/Gaganshuyadav"><Typography>Visit Github</Typography></a></div>
                           <Typography>I am Gaganshu yadav. This is my first Project by Using MERN Technologies and i am learning multiple Technologies for making this Project. I am very passionate about Technology. and Improve every day.</Typography>
                        </div>
                    </div>
                    <div className="ab2Media">
                        <Typography>Our Brands</Typography>
                        <div><a href="https://github.com/Gaganshuyadav"><GitHubIcon/></a></div>
                    </div>
                </div>
            </div>
        </div>
    )
} 