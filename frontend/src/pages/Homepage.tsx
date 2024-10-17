import React, { useEffect, useState } from "react";
import "./css/HomePage.css";
import VRIcon from "../icons/vr";
import MoreIcon from "../icons/moreIcon";
import Search from "../icons/search";
import CardQuiz, { card } from "../components/cardQuiz";
import SpeedDialElement from "../components/speedDial";
import Exit from "../icons/exit";
import { useNavigate } from "react-router-dom";
import Btn from "../components/button";

const Homepage = () => {
	const [cards, setCards] = useState<card[] | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
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

		fetchCards();
	}, []);

	const logout = () => {
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
						<Btn type="button" id="logout" text="Sair" icon={Exit} iconPosition="left" onClick={logout}/>
					</div>
				</label>
			</div>
			<section id="wellcome">
				<div id="content-text">
					<h1>Desafie seus amigos</h1>
					<h3>
						Prepare-se para <span>testar seus conhecimentos</span> e{" "}
						<span>superar seus limites</span>
					</h3>
					<Btn type="button" className="quiz-btn" href="#quiz" text="Começar agora" />
				</div>
				<div id="icon-vr">
					<VRIcon />
				</div>
			</section>
			<section id="quiz">
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
						<p>Sem quiz criado</p>
					)}
				</div>
				<Btn type="button" id="btn-add-quiz" icon={MoreIcon} text="Adicionar Quiz" iconPosition="right"/>
			</section>
			<div id="plus-btn">
				<SpeedDialElement />
			</div>
		</>
	);
};

export default Homepage;
