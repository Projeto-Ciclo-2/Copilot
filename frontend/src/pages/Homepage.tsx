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
import Statistic from "../icons/statistic";
import Global from "../icons/global";

const userAPI = new UserAPI();

const Homepage = () => {
	const webSocketContext = useWebSocket();
	const userContext = React.useContext(UserContext);

	const [cards, setCards] = React.useState<card[] | null>(null);
	const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
				console.log(
					"ws not connected in home page. setting canConnect"
				);

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
		<>
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
		</>
	);
};

export default Homepage;
