import React, { useContext, useState } from "react";
import "./css/Lobby.css";
import Btn from "../components/button";
import { useNavigate } from "react-router-dom";
import { usePolls } from "../context/PollsContext";
import { useWebSocket } from "../context/WebSocketContext";
import UserProvider, { UserContext } from "../context/UserContext";
import { IWSMessageGameInit } from "../interfaces/IWSMessages";

const Lobby = () => {
	const [usernames, setUsernames] = useState<string[]>([
		"johnDoe123",
		"coolGamer99",
		"techWiz45",
		"sarahSmith",
		"javaNerd",
	]);

	const PollsContext = usePolls();
	const WebSocketContext = useWebSocket();
	const userContext = React.useContext(UserContext);

	const navigate = useNavigate();

	function exitPage() {
		navigate("/home");
	}

	function initQuiz() {
		console.log('Message gameInit');
		const message: IWSMessageGameInit = {
			type: "gameInit",
			userID: userContext?.user?.id as string,
			pollID: PollsContext.currentPoll?.id as string,
		};
		WebSocketContext.sendGameInit(message);
	}

	if (PollsContext.currentPoll) {
		// Começou
		if (PollsContext.currentPoll.started) {
			setTimeout(() => {
				navigate("/quiz");
			}, 100);

			return <></>;
		}
	}

	return (
		<section id="lobby-section">
			<Btn
				type="button"
				text="sair"
				className="btn-exit-quiz"
				onClick={exitPage}
			/>
			<div id="lobby-content">
				<div id="quiz-content">
					<h2>Quiz sobre hierógrifos</h2>
					<p>Hierógrifos</p>
					<p>5 perguntas</p>
				</div>
				<div id="div-message-show">
					<p>Se prepare que o show vai começar!</p>
				</div>
				<div id="div-players-present">
					<p>Chame seus amigos agora!</p>
					<div>
						<h4>Jogadores presentes</h4>
						{usernames.map((username, index) => (
							<p key={index}>{username}</p>
						))}
					</div>
				</div>
			</div>
			<Btn
				type="button"
				text="iniciar"
				className="btn-init-quiz"
				onClick={initQuiz}
			/>
		</section>
	);
};

export default Lobby;
