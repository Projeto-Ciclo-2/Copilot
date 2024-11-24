import React, { useEffect, useMemo, useState } from "react";
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
import { Box, Modal } from "@mui/material";

const userAPI = new UserAPI();

const Homepage = () => {
	const webSocketContext = useWebSocket();
	const userContext = React.useContext(UserContext);

	const { setTimeQuestion } = useCurrentQuestion();
	const { polls, setCurrentPoll, setPlayers } = usePolls();

	const [started, setStarted] = useState(true);
	const [isLoading, setIsLoading] = React.useState(false);

	const [searchTerm, setSearchTerm] = useState<string>(""); // Estado da busca

	const [open, setOpen] = React.useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	const { currentPoll, setShowPageQuiz, setCurrentRank } = usePolls();
	const { setNumberOfQuestions, setCurrentQuestion } = useCurrentQuestion();

	const filteredPolls = useMemo(() => {
		if (!polls) return [];

		// Se o termo de busca estiver vazio, retorna todos os quizzes
		if (!searchTerm) return polls;

		// Filtra os quizzes com base no termo de busca
		return polls.filter((poll) =>
			poll.title.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [polls, searchTerm]); // Atualiza a lista filtrada sempre que polls ou searchTerm mudar

	setShowPageQuiz(false);

	// Navegar pra página de Lobby ao clicar
	function openQuiz(poll: IPoll) {
		if (poll.started) {
			setOpen(true);
		}

		if (!poll.started) {
			setCurrentPoll(poll);
			const users = poll.playing_users.map((u) => u.username);
			if (
				userContext &&
				userContext.user &&
				userContext.user.name &&
				!users.includes(userContext.user.name)
			) {
				users.push(userContext.user.name);
			}
			setPlayers(users);
			setCurrentRank(null);
			setCurrentQuestion(0);

			// Definir tempo para cada questão
			const timeTotal = poll.duration_in_minutes * 60;
			const seconds = timeTotal / poll.number_of_question;
			const milliseconds = seconds * 1000;
			setTimeQuestion(milliseconds); // Tempo de cada questão = (Milisegundos de cada questão) - (Tempo extra de cada questão)
			console.log(
				`%c tempo por questão = ${milliseconds}}`,
				"color: #f05a73"
			);

			// Numero de questões
			setNumberOfQuestions(poll.number_of_question);

			// Navegar para página de lobby
			navigate("/lobby");
		}
	}

	function validate() {
		async function validateSession() {
			if (!userContext) return;
			if (userContext.user) return;

			// setIsLoading(true);

			const res = await userAPI.getMyUser();
			if (!res || res.error || !res.data) {
				console.log("Sessão não válida");
				return navigate("/");
			}
			const user = res.data as IUser;

			userContext.setUser(user);
		}

		validateSession().then(() => {
			// setIsLoading(true);
			if (webSocketContext.isConnected.current) {
				// setIsLoading(false);
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
			polls,
		]
	);

	if (!isLoading) {
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

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const owner = userContext?.user?.name === "admin";

	return (
		<div id="home">
			<Loader alive={isLoading} />
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="parent-modal-title"
				aria-describedby="parent-modal-description"
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						background: "var(--bkg_1)",
						padding: "1rem",
						borderRadius: "5px",
					}}
				>
					<h2 id="parent-modal-title">Ops...</h2>
					<p
						id="parent-modal-description"
						style={{ paddingTop: "2rem" }}
					>
						O quiz já começou e você chegou atrasado :/
					</p>
				</Box>
			</Modal>
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
							<input
								type="text"
								placeholder="Pesquisar quiz"
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<Search />
						</div>
						<div id="cards">
							{polls ? (
								filteredPolls.map((poll, index) => (
									<CardQuiz
										key={index}
										poll={poll}
										index={index}
										onClick={() => openQuiz(poll)}
									/>
								))
							) : (
								<p>Sem quiz</p>
							)}
						</div>
						{/* {owner && ( */}
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
