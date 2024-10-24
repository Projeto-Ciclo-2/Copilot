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
import Github from "../icons/github";
import NoRepeat from "../icons/noRepeat";


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
							<span> em segundos!</span>
						</h3>
						<h3>
							Prepare-se para
							<span> testar seus conhecimentos</span> e
							<span> superar seus limites!</span>
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
					<div className="function-content" id="f1">
						<h3>
							Nossa IA gera perguntas com base em qualquer tema ou
							tópico que você escolher
						</h3>
                        <AiIcon/>
					</div>
					<div className="function-content" id="f2">
						<h3>
							Edite, personalize e ajuste os quizzes conforme suas
							preferências.
						</h3>
                        <EditAi/>
					</div>
					<div className="function-content" id="f3">
						<h3>
							No Enigmus todas as perguntas são únicas, você não verá a mesma pergunta duas vezes!
						</h3>
                        <NoRepeat/>
					</div>
                    </div>
				</section>
				<section id="team">
					<h1>Nossa Equipe</h1>
					<div id="cards">
						<div className="card">
							<div className="img" id="img1"></div>
							<span> Carlos Eduardo</span>
						</div>
						<div className="card">
							<div className="img" id="img2"></div>
							<span> Lígia Maria</span>
						</div>
						<div className="card">
							<div className="img" id="img3"></div>
							<span>Murilo Russo</span>
						</div>
						<div className="card">
							<div className="img" id="img4"></div>
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
