import React from "react";
import './css/HomePage.css'
import EpArrowDown from "../icons/downArrow";
import Btn from "../components/button";
import VRIcon from "../icons/vr";
const Homepage = () => {
    return(
        <div id="page">
        <div id="header">
            <div id="profile-btn">
                <div id="user-div">
                <div id="avatar"></div>
                <p>Name</p>
                </div>
                <div id="arrow">
                    <EpArrowDown/>
                </div>
            </div>
        </div>
        <div className="content">
            <h1>Desafie seus amigos</h1>
            <h3>Prepare-se para <span>testar seus conhecimentos</span> e <span>superar seus limites</span></h3>
            <Btn type="button" className="quiz-btn" text="Começar agora" />
            <div id="icon-vr">
            <VRIcon/>
            </div>
            <div id="plus-btn">
            <Btn type="button" className="quiz-btn" text="+" />
            </div>
        </div>
        </div>
    )
}

export default Homepage;