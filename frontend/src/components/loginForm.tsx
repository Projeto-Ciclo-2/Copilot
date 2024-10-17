import React, { useState } from "react";
import Input from "./input";
import Btn from "./button";
import Notification from "./notification/notification";
import usernameValid from "../validations/username";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../api/users";
import { defaultMessages } from "./notification/defaultMessages";

const LoginForm: React.FC = () => {
	const [fetching, setFetching] = useState(false);
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [notification, setNotification] = useState<string | null>(null);
	const notificationTime = 5000;

	const navigate = useNavigate();
	const userAPI = new UserAPI();

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!usernameValid(e.target.value)) {
			e.target.value = e.target.value.replace(
				/[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s]/g,
				""
			);
		}
		setUsername(e.target.value);
	};
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};
	const handleNotificationCLose = () => {
		setNotification(null);
	};
	const navigateHome = () => {
		navigate("/home");
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (username === "" || password === "") {
			setNotification("Os campos não podem estar vazios!");
			return setTimeout(handleNotificationCLose, notificationTime);
		}
		const valid = usernameValid(username);
		if (!valid) {
			setNotification("Nome de usuário e/ou senha incorretos!");
			return setTimeout(handleNotificationCLose, notificationTime);
		}
		setFetching(true);
		const res = await userAPI.logIn(username, password);
		setFetching(false);
		if (!res) {
			setNotification(defaultMessages.SERVER_ERROR);
			return setTimeout(handleNotificationCLose, notificationTime);
		}

		if (res.statusCode && res.statusCode === 200) {
			return navigateHome();
		}
		setTimeout(handleNotificationCLose, notificationTime);
		if (res.message) {
			return setNotification(res.message);
		}
		setNotification(defaultMessages.SERVER_ERROR);
	};
	return (
		<>
		<div className="form-container">
					<h2>Enigmus</h2>
		<form onSubmit={handleSubmit}>
 
			<div className="auth-div">
				<label>Usuário:</label>
				<Input
					type="text"
					value={username}
					onChange={handleUsernameChange}
				/>
			</div>
			<div className="auth-div">
				<label>Senha:</label>
				<Input
					type="password"
					value={password}
					onChange={handlePasswordChange}
				/>
			</div>
			<Btn
				type="submit"
				className="auth-btn"
				text="Entrar"
				disabled={!username || !password || fetching}
			/>
		</form>
		</div>
		<div id="notification">

			{notification && (
				<Notification
					message={notification}
					onClose={handleNotificationCLose}
				/>
			)}
		</div>
		</>
	);
};

export default LoginForm;
