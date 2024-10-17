import React, { useState } from "react";
import Input from "./input";
import Btn from "./button";
import usernameValid from "../validations/username";
import Notification from "./notification/notification";
import { UserAPI } from "../api/users";
import { defaultMessages } from "./notification/defaultMessages";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
	const [fetching, setFetching] = useState(false);
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordChecker, setPasswordChecker] = useState<string>("");
	const [notification, setNotification] = useState<string | null>(null);

	const userAPI = new UserAPI();
	const notificationTime = 5000;

	const navigate = useNavigate();
	const navigateHome = () => {
		navigate("/home");
	};
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
	const handlePasswordCheckerChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setPasswordChecker(e.target.value);
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (username === "" || password === "" || passwordChecker === "") {
			setNotification("Os campos não podem estar vazios!");
			return setTimeout(handleNotificationCLose, notificationTime);
		}
		if (password !== passwordChecker) {
			setNotification("Os campos de senha precisam ser iguais!");
			return setTimeout(handleNotificationCLose, notificationTime);
		}
		const valid = usernameValid(username);
		if (!valid) {
			setNotification("Insira um nome de usuário válido!");
			return setTimeout(handleNotificationCLose, notificationTime);
		}

		setFetching(true);
		const result = await userAPI.singIn(username, password);
		setFetching(false);
		if (result && result.statusCode && result.statusCode === 201) {
			setFetching(true);
			setNotification("Usuário cadastrado com sucesso!");
			setTimeout(handleNotificationCLose, notificationTime);

			const res = await userAPI.logIn(username, password);
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
			return;
		}
		setTimeout(handleNotificationCLose, notificationTime);
		if (result.message) {
			return setNotification(result.message);
		}
		setNotification(defaultMessages.SERVER_ERROR);
	};
	const handleNotificationCLose = () => {
		setNotification(null);
	};
	return (
		<>
		<div className="form-container">
					<h2>Enigmus</h2>
		<form onSubmit={handleSubmit}>
			<div className="auth-div">
				<label>Nome de usuário:</label>
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
			<div className="auth-div">
				<label>Confirmar senha:</label>
				<Input
					type="password"
					value={passwordChecker}
					onChange={handlePasswordCheckerChange}
				/>
			</div>

			<Btn
				type="submit"
				className="auth-btn"
				text="Cadastrar"
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

export default SignupForm;
