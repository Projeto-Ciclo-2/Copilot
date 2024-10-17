import React from "react";
import "./createQuiz.css";
import LookingAtComputer from "../../assets/svg/lookingAtComputer";
import InputIcon from "../../components/inputIcon";
import TextIcon from "../../assets/icons/text";
import Theme from "../../assets/icons/theme";
import InterrogationIcon from "../../assets/icons/interrogation";
import Hashtag from "../../assets/icons/hashtag";
import Clock from "../../assets/icons/clock";

type nullNumber = undefined | number;

const CreateQuiz = () => {
	const [title, setTitle] = React.useState("");
	const [theme, setTheme] = React.useState("");
	const [xQuestions, setXQuestions] = React.useState<nullNumber>();
	const [xAlternatives, setXAlternatives] = React.useState<nullNumber>();
	const [time, setTime] = React.useState("");

	return (
		<div id="createBody">
			<header id="createHeader"></header>
			<main id="createMain">
				<section id="createMain-section">
					<LookingAtComputer />
					<div>
						<h3>Criar um quiz</h3>
						<p>
							Aqui você irá criar um Live-quiz que estará público
							para todos os usuários da nossa plataforma.
						</p>
					</div>
				</section>
				<form id="createMain-form">
					<InputIcon
						children={<TextIcon />}
						label="Título"
						type="text"
						placeholder="Ex: Quiz muito difícil sobre hieróglifos"
						value={title}
						setValue={setTitle}
					/>
					<InputIcon
						children={<Theme />}
						label="Tema"
						type="text"
						placeholder="Ex: Hieróglifos"
						value={theme}
						setValue={setTheme}
					/>
					<InputIcon
						children={<InterrogationIcon />}
						label="Quantidade de perguntas"
						selectInput={true}
						type="number"
						selectOptions={[
							1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
						]}
						placeholder="Selecione um valor"
						value={xQuestions}
						setValue={setXQuestions}
					/>
					<InputIcon
						children={<Hashtag />}
						label="Quantidade de alternativas por pergunta"
						selectInput={true}
						type="number"
						selectOptions={[2, 3, 4, 5, 6]}
						placeholder="Selecione um valor"
						value={xAlternatives}
						setValue={setXAlternatives}
					/>
					<InputIcon
						children={<Clock />}
						label="Tempo total de duração do Quiz (Min)"
						selectInput={true}
						type="text"
						selectOptions={[
							"1 minuto",
							"2 minutos",
							"3 minutos",
							"4 minutos",
							"5 minutos",
							"6 minutos",
							"7 minutos",
						]}
						placeholder="Selecione um valor"
						value={time}
						setValue={setTime}
					/>
				</form>
				<div id="createMain-btns">
					<button>Cancelar</button>
					<button>Avançar</button>
				</div>
			</main>
		</div>
	);
};

export default CreateQuiz;
