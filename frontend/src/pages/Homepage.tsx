import React, { useState } from "react";
import "./css/HomePage.css";
import VRIcon from "../icons/vr";
import MoreIcon from "../icons/moreIcon";
import Search from "../icons/search";
import CardQuiz from "../components/cardQuiz";
import SpeedDialElement from "../components/speedDial";
import Logout from "../icons/logout";
import { useLocation, useNavigate } from "react-router-dom";
import Btn from "../components/button";
import { UserContext } from "../context/UserContext";
import { UserAPI } from "../api/users";
import { IUser } from "../interfaces/IUser";
import { useWebSocket } from "../context/WebSocketContext";
import { usePolls } from "../context/PollsContext";
import { IPoll } from "../interfaces/IQuiz";
import { useCurrentQuestion } from "../context/questionCurrentContext";
import Loader from "../components/load/Loader";

const userAPI = new UserAPI();

const Homepage = () => {
	const webSocketContext = useWebSocket();
	const userContext = React.useContext(UserContext);

	const { setTimeQuestion } = useCurrentQuestion();
	const { polls, setCurrentPoll, setPlayers } = usePolls();
	const { setNumberOfQuestions } = useCurrentQuestion();

	const [started, setStarted] = useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	// Navegar pra página de Lobby ao clicar
	function openQuiz(poll: IPoll) {
		setCurrentPoll(poll);
		setPlayers(poll.playing_users);
		// Definir tempo para cada questão
		const timeTotal = poll.duration_in_minutes * 60;
		const seconds = timeTotal / poll.number_of_question;
		const milliseconds = seconds * 1000;
		setTimeQuestion(milliseconds);
		console.log(`TEMPO POR PARTIDA: ${milliseconds}`);
		setNumberOfQuestions(poll.number_of_question);
		navigate("/lobby");
	}

	function validate() {
		async function validateSession() {
			if (!userContext) return;
			if (userContext.user) return;

			setIsLoading(true);

			const res = await userAPI.getMyUser();
			if (!res || res.error || !res.data) {
				console.log("Sessão não válida");
				return navigate("/");
			}
			const user = res.data as IUser;

			userContext.setUser(user);
		}

		validateSession().then(() => {
			if (!webSocketContext.isConnected.current) {
				if (!isLoading) {
					setIsLoading(true);
				}
			} else {
				if (isLoading) {
					setIsLoading(false);
				}
			}
		});
	}

	React.useEffect(
		validate,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			userContext,
			navigate,
			location,
			webSocketContext,
			webSocketContext.isConnected.current,
		]
	);

	if(!isLoading) {
		validate();
	}

	if (!userContext) return <h1>Eita!</h1>;

	const logout = async () => {
		await userAPI.logout();
		navigate("/");
	};
	const startNow = () => {
		setStarted(true);
	};

	return (
		<div id="home">
			<Loader alive={isLoading} />
			<div id="burguer-container">
				<label id="burguer">
					<input type="checkbox" />
					<div id="burger-checkmark">
						<span></span>
						<span></span>
						<span></span>
					</div>
					<div id="dropdown-menu">
						<Btn
							type="button"
							id="logout"
							text="Sair"
							icon={Logout}
							iconPosition="left"
							onClick={logout}
						/>
					</div>
				</label>
			</div>
			{!started ? (
				<>
					<section id="wellcome">
						<div id="content-text">
							<h1>Desafie seus amigos</h1>
							<h3>
								Prepare-se para{" "}
								<span>testar seus conhecimentos</span> e{" "}
								<span>superar seus limites</span>
							</h3>
							<Btn
								type="button"
								className="quiz-btn"
								href="#quiz"
								text="Começar agora"
								onClick={startNow}
							/>
						</div>
						<div id="icon-vr">
							<VRIcon />
						</div>
					</section>
				</>
			) : (
				<>
					<section id="quiz">
						<div id="input-search-quiz">
							<input type="text" placeholder="Pesquisar quiz" />
							<Search />
						</div>
						<div id="cards">
							{polls ? (
								polls.map((poll, index) => (
									<CardQuiz
										key={index}
										poll={poll}
										index={index}
										onClick={() => openQuiz(poll)}
									/>
								))
							) : (
								<p>Sem quiz criado</p>
							)}
						</div>
						<Btn
							type="button"
							id="btn-add-quiz"
							icon={MoreIcon}
							text="Adicionar Quiz"
							iconPosition="right"
							onClick={() => navigate("/create")}
						/>
					</section>
				</>
			)}
			<div id="plus-btn">
				<SpeedDialElement />
			</div>
		</div>
	);
};

export default Homepage;
