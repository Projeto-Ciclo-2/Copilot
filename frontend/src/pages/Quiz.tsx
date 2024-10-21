import React, { useEffect, useState } from "react";
import Btn from "../components/button";
import LinearProgressComponent from "../components/linearProgress";
import Alternative from "../components/alternatives/alternatives";
import "./css/Quiz.css";
import ConfirmIcon from "../icons/confirm";
import { useCurrentQuestion } from "../context/questionCurrentContext";
import GroupIcon from "../icons/group";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import { usePolls } from "../context/PollsContext";

interface IQuizQuestion {
	id: number;
	statement: string;
	options: string[];
	answer: string;
	explanation: string;
}

interface IQuiz {
	id: string;
	title: string;
	theme: string;
	number_of_question: number;
	number_of_alternatives: number;
	duration_in_minutes: number;
	created_at?: string; //timestamp
	questions: IQuizQuestion[];
}

const Quiz = () => {
	// const [quiz, setQuiz] = useState<IQuiz | null>();

	const { currentPoll } = usePolls();
	console.log(currentPoll);


	// Acertos
	const [correctAnswers, setCorrectAnswers] = useState(0);

	// Alternativa correta
	const [correctAlternative, setCorrectAlternative] = useState<number | null>(
		null
	);

	// Usuário marcou alternativa errada
	const [wrongAlternative, setWrongAlternative] = useState<number | null>(
		null
	);

	const [percentageQuetions, setPercentageQuestions] = useState<string[]>([
		"25",
		"15",
		"31",
		"29",
	]);

	const {
		currentQuestion,
		setTimeQuestion,
		confirmed,
		setConfirmed,
		setNumberOfQuestions,
		markedAlternative,
		setMarkedAlternative,
		showAlternative,
		showPageRanking,
	} = useCurrentQuestion();

	const navigate = useNavigate();

	function exitQuiz() {
		navigate("/home");
	}

	// Escolher alternativa
	function responseQuestion(item: number) {
		setMarkedAlternative(item);

		// errou?
		if (item !== correctAlternative) {
			setWrongAlternative(item);
		}

		if (item === correctAlternative) {
			setWrongAlternative(null);
		}
	}

	// Confirmar alternativa
	function confirmedQuestion() {
		if (markedAlternative === correctAlternative) {
			const total = correctAnswers + 1;
			setCorrectAnswers(total);
		}
		setConfirmed(true);
	}

	// get quiz
	/* useEffect(() => {
		async function getQuiz() {
			try {
				const result = await fetch("http://localhost:3003/quiz");
				const data: IQuiz = await result.json();
				setQuiz(data);
				const alternativeCorrect = Number(data.questions[0].answer);
				setCorrectAlternative(alternativeCorrect);
				setNumberOfQuestions(data.number_of_question);
			} catch (error) {
				console.log("erro ao buscar quiz!");
			}
		}

		setTimeout(() => {
			getQuiz();
		}, 2000);
	}, []); */

	/* // Definir tempo para cada questão
	useEffect(() => {
		if (currentPoll) {
			const timeTotal = currentPoll.duration_in_minutes * 60;
			const seconds = timeTotal / currentPoll.number_of_question;
			const milliseconds = seconds * 1000;
			setTimeQuestion(milliseconds);
		}
	}, [currentPoll, setTimeQuestion]); */

	// Alterar questão
	useEffect(() => {
		if (currentPoll) {
			if (
				currentQuestion !== null &&
				currentQuestion < currentPoll.number_of_question
			) {
				setMarkedAlternative(null);
				setWrongAlternative(null);
				const altCorrect = Number(
					currentPoll.questions[currentQuestion].answer
				);

				setCorrectAlternative(altCorrect);
				setConfirmed(false);
			}
		}
	}, [
		currentQuestion,
		currentPoll,
		setMarkedAlternative,
		setCorrectAlternative,
		setConfirmed,
	]);

	useEffect(() => {
		if (showPageRanking) {
			navigate("/ranking");
		}
	}, [showPageRanking, navigate]);

	return (
		<section id="section-quiz">
			{currentPoll ? (
				<>
					<section id="header-quiz">
						<Btn
							type="button"
							text="Sair"
							className="button-exit-quiz"
							onClick={exitQuiz}
						/>
						<div>
							<p className="current-question">
								{(currentQuestion as number) + 1}/
								{currentPoll.number_of_question}
							</p>
							<p className="correct-questions">
								{correctAnswers}{" "}
								{correctAnswers === 1 ? "acerto" : "acertos"}
							</p>
						</div>
					</section>
					<section id="content-quiz">
						<LinearProgressComponent />

						{/* Title quiz */}
						<p className="title-quiz">{currentPoll.title}</p>

						{/* Question */}
						<p className="question-quiz">
							{(currentQuestion as number) + 1}
							{". "}
							{
								currentPoll.questions[currentQuestion as number]
									.statement
							}{" "}
						</p>

						<div className="alternatives-quiz">
							{/* Alternativas */}
							{showAlternative === "alternative"
								? confirmed
									? // Visualizar porcentagem
									  currentPoll.questions[
											currentQuestion as number
									  ].options.map((question, index) => (
											<div key={index}>
												{/* Questão marcada */}
												{index ===
													markedAlternative && (
													<Alternative
														type="chose"
														item={index}
														content={question}
														confirmed={false}
														icon={<GroupIcon />}
														render={showAlternative}
														percentage={
															percentageQuetions[
																index
															]
														}
													/>
												)}
												{/* Questão simples */}
												{index !==
													markedAlternative && (
													<Alternative
														type="disabled"
														item={index}
														content={question}
														confirmed={false}
														icon={<GroupIcon />}
														render={showAlternative}
														percentage={
															percentageQuetions[
																index
															]
														}
													/>
												)}
											</div>
									  ))
									: // Escolher alternativa
									  currentPoll.questions[
											currentQuestion as number
									  ].options.map((question, index) => (
											<Alternative
												key={index}
												type="standard"
												item={index}
												content={question}
												confirmed={confirmed}
												render={showAlternative}
												onClick={() =>
													responseQuestion(index)
												}
											/>
									  ))
								: currentPoll.questions[
										currentQuestion as number
								  ].options.map((question, index) => (
										<div key={index}>
											{/* Questão correta */}
											{index === correctAlternative && (
												<Alternative
													type="correct"
													item={index}
													content={question}
													confirmed={false}
													icon={<GroupIcon />}
													render="response"
													percentage={
														percentageQuetions[
															index
														]
													}
												/>
											)}
											{/* Questão errada */}
											{index === wrongAlternative && (
												<Alternative
													type="wrong"
													item={index}
													content={question}
													confirmed={false}
													icon={<GroupIcon />}
													render="response"
													percentage={
														percentageQuetions[
															index
														]
													}
												/>
											)}
											{/* Questão simples */}
											{index !== wrongAlternative &&
												index !==
													correctAlternative && (
													<Alternative
														type="disabled"
														item={index}
														content={question}
														confirmed={false}
														icon={<GroupIcon />}
														render="response"
														percentage={
															percentageQuetions[
																index
															]
														}
													/>
												)}
										</div>
								  ))}
						</div>
					</section>
					<div id="div-button">
						{!confirmed && (
							<Btn
								type="button"
								text="Confirmar"
								// icon={<ConfirmIcon />}
								className="button-confirm-alternative"
								disabled={
									markedAlternative !== null ? false : true
								}
								onClick={confirmedQuestion}
							/>
						)}
					</div>
				</>
			) : (
				"Aguarde..."
			)}
		</section>
	);
};

export default Quiz;
