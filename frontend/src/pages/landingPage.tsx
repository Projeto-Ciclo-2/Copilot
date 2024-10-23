import react from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Btn from "../components/button";
import VRIcon from "../icons/vr";
import "./css/landingPage.css";
import Banner from "../components/banner";
import { useState } from "react";
import AiIcon from "../icons/Ai";
import EditAi from "../icons/editAI";
import Quote from "../icons/quote";
import Brain from "../icons/brain";
import Wait from "../icons/wait";
import Game from "../icons/game";
import Ranking2 from "../icons/rankingDark";
import Person from "../icons/person";
import Github from "../icons/github";


const LandingPage = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const navigate = useNavigate();

	const closeMenu = () => {
		setMenuOpen(false);
	};

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<div id="landing">
			<nav>
				<div className="navbar">
					<div className="nav-container">
						<button
							className="hamburger-lines"
							onClick={toggleMenu}
						>
							<span
								className={`line line1 ${
									menuOpen ? "rotate1" : ""
								}`}
							></span>
							<span
								className={`line line2 ${
									menuOpen ? "scaleY" : ""
								}`}
							></span>
							<span
								className={`line line3 ${
									menuOpen ? "rotate3" : ""
								}`}
							></span>
						</button>
						<div className="logo">
							<Banner />
							<h1>Enigmus</h1>
						</div>
						<div className={`menu-items ${menuOpen ? "open" : ""}`}>
							<div id="menu">
							<li>
								<Link to="/auth" onClick={closeMenu}>
									Começar Agora
								</Link>
							</li>
							<li>
								<a href="#functions" onClick={closeMenu}>
									O que fazemos?
								</a>
							</li>
							<li>
								<a href="#how" onClick={closeMenu}>
									Como funciona?
								</a>
							</li>
							<li>
								<a href="#team" onClick={closeMenu}>
									Nossa Equipe
								</a>
							</li>
							</div>
							<div id="repositorio">
							<Btn type="button" text="Visite nosso Repositório" id="github-btn" icon={Github} href="https://github.com/Projeto-Ciclo-2/Copilot"/>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<div id="content">
				<section id="welcome">
					<div id="content-text">
						<h1>Desafie seus amigos!</h1>
						<h3>
							Crie <span>Quizzes incríveis</span> com a ajuda de
							uma
							<span> inteligência artificial!</span> e economize
							tempo criando quizzes personalizados
							<span>em segundos!</span>
						</h3>
						<h3>
							Prepare-se para
							<span>testar seus conhecimentos</span> e
							<span>superar seus limites!</span>
						</h3>
						<Btn
							type="button"
							className="auth-btn"
							text="Começar agora"
							onClick={() => navigate("/auth")}
						/>
					</div>
					<div id="icon-vr">
						<VRIcon />
					</div>
				</section>
				<section id="functions">
					<h1>O que fazemos melhor</h1>
                    <div id="fc">
					<div id="function-content1">
						<h3>
							Nossa IA gera perguntas com base em qualquer tema ou
							tópico que você escolher
						</h3>
                        <AiIcon/>
					</div>
					<div id="function-content2">
						<h3>
							Edite, personalize e ajuste os quizzes conforme suas
							preferências.
						</h3>
                        <EditAi/>
					</div>
                    </div>
				</section>
				<section id="how">
					<h1>Como Funciona?</h1>
                    <div id="guide">
					<ul>
						<li>
                        <Quote/>Passo 1: "Escolha o título e o tema do seu quiz". 
						</li>
						<li>
							<Brain/> Passo 2: "Personalize o seu quiz, escolhendo o
							número de perguntas, numero de alternativas e tempo
							de duração do quiz."
						</li>
						<li>
                            <Wait/> Passo 3: "Aguarde enquanto a IA cria seu quiz."</li>
						<li>
							<Game/> Passo 4: "Aguarde novos jogadores ou inicie a
							partida."
						</li>
						<li><Ranking2/> Passo 5: "Cheque a sua pontuação final."</li>
					</ul>
                    </div>
				</section>
				<section id="team">
					<h1>Nossa Equipe</h1>
					<div id="cards">
						<div className="card">
							<div className="card-border-top"></div>
							<div className="img"><Person/></div>
							<span> Carlos Eduardo</span>
						</div>
						<div className="card">
							<div className="card-border-top"></div>
							<div className="img"><Person/></div>
							<span> Lígia Maria</span>
						</div>
						<div className="card">
							<div className="card-border-top"></div>
							<div className="img"><Person/></div>
							<span>Murilo Russo</span>
						</div>
						<div className="card">
							<div className="card-border-top"></div>
							<div className="img"><Person/></div>
							<span> Pedro Sávio</span>
						</div>
					</div>
					<div id="team-content">
						<h3>
							Somos uma equipe de aspirantes a desenvolvedor web.
							Membros da turma 5 do programa Alpha EdTech
						</h3>
					</div>
				</section>
				<footer>
					<h4>Projeto do Desafio de Ciclo 2 - grupo 6, turma Hamilton - 2024</h4>
				</footer>
			</div>
		</div>
	);
};
export default LandingPage;
