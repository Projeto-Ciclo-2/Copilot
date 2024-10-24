import React, { useState } from "react";
import "./css/HomePage.css";
import VRIcon from "../icons/vr";
import MoreIcon from "../icons/moreIcon";
import Search from "../icons/search";
import CardQuiz, { card } from "../components/cardQuiz";
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
import Statistic from "../icons/statistic";
import Global from "../icons/global";

const userAPI = new UserAPI();

const Homepage = () => {
	const webSocketContext = useWebSocket();
	const userContext = React.useContext(UserContext);

	const { setTimeQuestion } = useCurrentQuestion();
	const { polls, setCurrentPoll, setPlayers } = usePolls();
	const { setNumberOfQuestions } = useCurrentQuestion();

	const [started, setStarted] = useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
	const profile = () => {
		navigate("/statistic")
	}
	const ranking = () => {
		navigate("/global")
	}
	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};
	return (
		<div id="home">
			<Loader alive={isLoading} />
			<div className="hamburguer">
				<button className="hamburger-lines" onClick={toggleMenu}>
					<span
						className={`line line1 ${menuOpen ? "rotate1" : ""}`}
					></span>
					<span
						className={`line line2 ${menuOpen ? "scaleY" : ""}`}
					></span>
					<span
						className={`line line3 ${menuOpen ? "rotate3" : ""}`}
					></span>
				</button>
				<div className={`dropdown ${menuOpen ? "open" : ""}`}>
					<Btn
						type="button"
						className="drop-btn"
						text={null}
						icon={Statistic}
						iconPosition="left"
						onClick={profile}
					/>
					<Btn
						type="button"
						className="drop-btn"
						text={null}
						icon={Global}
						iconPosition="left"
						onClick={ranking}
					/>
					<Btn
						type="button"
						className="drop-btn"
						id="logout"
						text={null}
						icon={Logout}
						iconPosition="left"
						onClick={logout}
					/>
				</div>
			</div>
			<section id="quiz">
				<h2>Quizzes Ativos</h2>
				<h2>Quizzes Ativos</h2>
				<div id="input-search-quiz">
					<input type="text" placeholder="Pesquisar quiz" />
					<Search />
				</div>
				<div id="cards">
					{polls ? (
						polls.map((poll, index) => (
							<CardQuiz key={index} poll={poll} index={index} onClick={() => openQuiz(poll)}/>
						))
					) : (
						<p>Nenhum quiz encontrado, crie um novo!</p>
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
		</div>
	);
};

export default Homepage;
