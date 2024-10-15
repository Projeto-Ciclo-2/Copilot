import React, { useState } from "react";
import "./css/AuthPage.css";
import LoginForm from "../components/loginForm";
import SignupForm from "../components/singupForm";
import CustomModal from "../components/modal/modal";

const AuthPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
	const [modalInfo, setModalInfo] = useState({
		alive: false,
		title: "",
		message: "",
	});

	const handleTabSwitch = (tab: "login" | "signup") => {
		setActiveTab(tab);
	};

	return (
		<div className="page">
			<CustomModal
				alive={modalInfo.alive}
				message={modalInfo.message}
				onClick={() =>
					setModalInfo({ alive: false, title: "", message: "" })
				}
				title={modalInfo.title}
			></CustomModal>
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
				<div className="form-container">
					{activeTab === "login" ? (
						<LoginForm />
					) : (
						<SignupForm
							signUpCallbackFn={() => {
								handleTabSwitch("login");
								setModalInfo({
									alive: true,
									title: "Cadastro concluído",
									message:
										"Bem vindo a nossa plataforma, faça login para continuar.",
								});
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
export default AuthPage;
