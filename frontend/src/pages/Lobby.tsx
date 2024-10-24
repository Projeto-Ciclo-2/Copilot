import React, { useEffect } from "react";
import "./css/Lobby.css";
import Btn from "../components/button";
import { useNavigate } from "react-router-dom";
import { usePolls } from "../context/PollsContext";
import { useWebSocket } from "../context/WebSocketContext";
import{ UserContext } from "../context/UserContext";
import {
	IWSMessageGameInit,
	IWSMessageJoinQuiz,
	IWSMessagePostLeftQuiz,
} from "../interfaces/IWSMessages";

const Lobby = () => {
	const { currentPoll, players, showPageQuiz } = usePolls();
	const WebSocketContext = useWebSocket();
	const userContext = React.useContext(UserContext);

	const navigate = useNavigate();

	if (currentPoll?.started || currentPoll?.started_at) {
		console.log('%c Opa, quiz já inciado. Retornando para /home', 'color: #ffffff; background: #b60202;');
		navigate('/home')
	}

	useEffect(() => {
		if (showPageQuiz) {
			const time = new Date(Date.now())
			console.log(`Usuário ${userContext?.user?.name} entrou no quiz às ${time}`);

			navigate('/quiz')
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showPageQuiz])


	function exitPage() {
		// Sair do quiz
		console.log(
			`send-[joinQuiz] -> usuário ${userContext?.user?.name} SAIU do quiz!`
		);
		const message: IWSMessagePostLeftQuiz = {
			type: "leftQuiz",
			userID: userContext?.user?.id as string,
			pollID: currentPoll?.id as string,
		};
		WebSocketContext.sendLeftQuiz(message);
		navigate("/home");
	}

	const owner = userContext?.user?.name === 'admin';
	/* console.log(`=> owner: ${owner}`);
	console.log(`=> userid: ${userContext?.user?.id}`);
	console.log(`=> ownerId: ${currentPoll?.owner}`);
	console.log(`=> pollId: ${currentPoll?.id}`); */

	function initQuiz() {
		if (userContext?.user?.id === currentPoll?.owner) {
			console.log("message gameInit");
			const message: IWSMessageGameInit = {
				type: "gameInit",
				userID: userContext?.user?.id as string,
				pollID: currentPoll?.id as string,
			};
			WebSocketContext.sendGameInit(message);
		}
	}

	if (showPageQuiz) {
		// Começou
		console.log('Começando quiz...', 'color: #6982bb');
		navigate("/quiz");
	}

	console.log(
		`message-[joinQuiz] -> usuário ${userContext?.user?.name} entrou no quiz!`
	);
	const message: IWSMessageJoinQuiz = {
		type: "joinQuiz",
		pollID: currentPoll?.id as string,
		userID: userContext?.user?.id as string,
	};
	WebSocketContext.sendJoinQuiz(message);

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
						{players?.map((username, index) => (
							<p key={index}>{username}</p>
						))}
					</div>
				</div>
			</div>
			{owner && (
				<Btn
					type="button"
					text="iniciar"
					className="btn-init-quiz"
					onClick={initQuiz}
				/>
			)}
		</section>
	);
};

export default Lobby;
