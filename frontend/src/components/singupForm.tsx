import React, { useState} from "react";
import Input from "./input";
import Btn from "./button";
import usernameValid from "../validations/username";
import Notification from "./notification/notification";

const SignupForm: React.FC = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordChecker, setPasswordChecker] = useState<string>("");
	const [notification, setNotification] = useState<string | null>(null);

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!usernameValid(e.target.value)) {
            e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s]/g, '');
        }
        setUsername(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};
	const handlePasswordCheckerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordChecker(e.target.value);
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (username === "" || password === "" || passwordChecker === "") {
			setNotification("Os campos não podem estar vazios!");
			setTimeout(() => {
				handleNotificationCLose()
			}, 2000);
		} else if (password !== passwordChecker){
			setNotification("Os campos de senha precisam ser iguais!");
			setTimeout(() => {
				handleNotificationCLose()
			}, 2000);
		}else {
			const valid = usernameValid(username);
			if (valid) {
				setNotification("Usuário cadastrado com sucesso!");
				setTimeout(() => {
					handleNotificationCLose()
				}, 2000);



				setUsername("")
				setPassword("")
				setPasswordChecker("")
			} else {
				setNotification("Insira um endereço de email valido!");
				setTimeout(() => {
					handleNotificationCLose()
				}, 2000);
			}
		}
	};
	const handleNotificationCLose = () => {
		setNotification(null);
	};
	return (
		<form onSubmit={handleSubmit}>
			<h2>Cadastro</h2>
			<div className="auth-div">
				<label>Nome de usuário:</label>
				<Input type="text" value={username} onChange={handleUsernameChange} />
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
			<Btn type="submit" className="auth-btn" text="Cadastrar" />
			{notification && (
				<Notification
					message={notification}
					onClose={handleNotificationCLose}
				/>
			)}
		</form>
	);
};

export default SignupForm;
