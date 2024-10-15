import React, { useEffect, useState } from "react";
import "./css/HomePage.css";
import EpArrowDown from "../icons/downArrow";
import VRIcon from "../icons/vr";
import MoreIcon from "../icons/moreIcon";
import Search from "../icons/search";
import CardQuiz, { card } from "../components/cardQuiz";
import SpeedDialElement from "../components/speedDial";

const Homepage = () => {
	const [cards, setCards] = useState<card[] | null>(null);

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

	return (
		<>
			<div id="profile">
				<div id="profile-btn">
					<div id="user-div">
						<div id="avatar"></div>
						<p>Name</p>
					</div>
					<div id="arrow">
						<EpArrowDown />
					</div>
				</div>
			</div>
			<section id="wellcome">
				<div id="content-text">
					<h1>Desafie seus amigos</h1>
					<h3>
						Prepare-se para <span>testar seus conhecimentos</span> e{" "}
						<span>superar seus limites</span>
					</h3>
					<button className="quiz-btn"><a href="#quiz">Começar agora</a></button>
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
				<button id="btn-add-quiz">
					Adicionar Quiz <MoreIcon />
				</button>
			</section>
			<div id="plus-btn">
				<SpeedDialElement />
			</div>
		</>
	);
};

export default Homepage;
