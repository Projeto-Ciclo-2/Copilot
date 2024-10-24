import React, { useState } from "react";
import "./css/AuthPage.css";
import LoginForm from "../components/loginForm";
import SignupForm from "../components/singupForm";
import bkg from "../assets/svg/background.svg";
import { useNavigate } from "react-router-dom";
import Btn from "../components/button";
import ExitIcon from "../icons/exit";

const AuthPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const navigate = useNavigate()

	const handleTabSwitch = (tab: "login" | "signup") => {
		setActiveTab(tab);
	};
	const back = () => {
		navigate("/")
	}

	return (
		<div className="page" style={{ backgroundImage: `url(${bkg})` }}>
			<div id="header">
				<Btn
					type="button"
                    id="back-btn"
                    text={null}
					icon={ExitIcon}
					className="btn-exit"
					onClick={back}
				/>
			</div>
			<div className="auth-container">
				<div className="tab-container">
					<button
						onClick={() => handleTabSwitch("login")}
						className={`tab-button ${
							activeTab === "login"
								? "active-tab"
								: "inactive-tab"
						}`}
					>
						Login
					</button>
					<button
						onClick={() => handleTabSwitch("signup")}
						className={`tab-button ${
							activeTab === "signup"
								? "active-tab"
								: "inactive-tab"
						}`}
					>
						Cadastro
					</button>
				</div>
				<>
					{activeTab === "login" ? <LoginForm /> : <SignupForm />}
				</>
				
			</div>
		</div>
	);
};
export default AuthPage;
