import React, { useContext, useState } from "react";
import "./css/Lobby.css";
import Btn from "../components/button";
import { useNavigate } from "react-router-dom";
import { usePolls } from "../context/PollsContext";
import { useWebSocket } from "../context/WebSocketContext";
import UserProvider, { UserContext } from "../context/UserContext";
import {
	IWSMessageGameInit,
	IWSMessageLeftQuiz,
} from "../interfaces/IWSMessages";

const Lobby = () => {
	const { currentPoll } = usePolls();
	const WebSocketContext = useWebSocket();
	const userContext = React.useContext(UserContext);

	const navigate = useNavigate();

	function exitPage() {
		navigate("/home");

		// Sair do quiz
		/* const message: IWSMessageLeftQuiz = {
			type: "leftQuiz",
			userID: userContext?.user?.id as string,
			pollID: currentPoll?.id as string,
		};
		WebSocketContext.sendLeftQuiz(message); */
	}

	const owner = userContext?.user?.id === currentPoll?.owner;
	/* console.log(owner);
	console.log(`user id = ${userContext?.user?.id}`);
	console.log(`owner id = ${currentPoll?.owner}`); */

	function initQuiz() {
		/* if (userContext?.user?.id === currentPoll?.owner) {
			console.log("message gameInit");
			const message: IWSMessageGameInit = {
				type: "gameInit",
				userID: userContext?.user?.id as string,
				pollID: currentPoll?.id as string,
			};
			WebSocketContext.sendGameInit(message);
		} */
		navigate("/quiz");
	}

	if (currentPoll) {
		// Começou
		if (currentPoll.started) {
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
					<h2>{currentPoll?.title}</h2>
					<p>{currentPoll?.theme}</p>
					<p>{currentPoll?.number_of_question} perguntas</p>
				</div>
				<div id="div-message-show">
					<p>Se prepare que o show vai começar!</p>
				</div>
				<div id="div-players-present">
					<p>Chame seus amigos agora!</p>
					<div>
						<h4>Jogadores presentes</h4>
						{/* {players.map((username, index) => (
							<p key={index}>{username}</p>
						))} */}
					</div>
				</div>
			</div>
			{/* {owner && (
			)} */}
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
