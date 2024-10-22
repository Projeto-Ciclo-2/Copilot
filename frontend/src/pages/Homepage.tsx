import React, { useState } from "react";
import "./css/HomePage.css";
import VRIcon from "../icons/vr";
import MoreIcon from "../icons/moreIcon";
import Search from "../icons/search";
import CardQuiz, { card } from "../components/cardQuiz";
import SpeedDialElement from "../components/speedDial";
import Logout from "../icons/logout";
import { useLocation, useNavigate } from "react-router-dom";
import Btn from "../components/button";
import { UserContext } from "../context/UserContext";
import { UserAPI } from "../api/users";
import { IUser } from "../interfaces/IUser";
import { useWebSocket } from "../context/WebSocketContext";

const userAPI = new UserAPI();

const Homepage = () => {
	const webSocketContext = useWebSocket();
	const userContext = React.useContext(UserContext);

	const [cards, setCards] = React.useState<card[] | null>(null);

	const navigate = useNavigate();
	const location = useLocation();

	React.useEffect(() => {
		async function fetchCards() {
			try {
				const response = await fetch("http://localhost:3003/cards");
				if (!response.ok) {
					throw new Error("Erro ao buscar os dados");
				}
				const data = await response.json();

				setCards(data);
			} catch (error) {
				console.error("Erro:", error);
			}
		}
		async function validateSession() {
			if (!userContext) return;
			if (userContext.user) return;

			const res = await userAPI.getMyUser();
			if (!res || res.error || !res.data) {
				console.log("Sessão não válida");
				return navigate("/");
			}
			const user = res.data as IUser;

			userContext.setUser(user);
		}

		validateSession().then(() => {
			if (!webSocketContext.isConnected) {
				console.log("ws not connected in home page. setting canConnect");

				webSocketContext.setCanConnect(false);
				webSocketContext.setCanConnect(true);
			}
		});
		// fetchCards();
	}, [userContext, navigate, location, webSocketContext]);

	webSocketContext.onReceivePoll((e) => {
		console.log(e);
	})

	if (!userContext) return <h1>Eita!</h1>;

	const logout = async () => {
		await userAPI.logout();
		navigate("/");
	};
	return (
		<>
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
			<section id="quiz">
				<h2>Quizzes Ativos</h2>
				<div id="input-search-quiz">
					<input type="text" placeholder="Pesquisar quiz" />
					<Search />
				</div>
				<div id="cards">
					{cards ? (
						cards.map((card, index) => (
							<CardQuiz key={index} card={card} index={index} />
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
			<div id="plus-btn">
				<SpeedDialElement />
			</div>
		</>
	);
};

export default Homepage;
