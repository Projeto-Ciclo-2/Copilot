import React, { useEffect, useState } from "react";
import Btn from "../components/button";
import LinearProgressComponent from "../components/linearProgress";
import Alternative from "../components/alternatives/alternatives";
import "./css/Quiz.css";
import ConfirmIcon from "../icons/confirm";
import { useCurrentQuestion } from "../context/questionCurrentContext";
import GroupIcon from "../icons/group";
import { useNavigate } from "react-router-dom";

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
	const [quiz, setQuiz] = useState<IQuiz | null>();

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
	useEffect(() => {
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
	}, []);

	// Definir tempo para cada questão
	useEffect(() => {
		if (quiz) {
			const timeTotal = quiz.duration_in_minutes * 60;
			const seconds = timeTotal / quiz.number_of_question;
			const milliseconds = seconds * 1000;
			setTimeQuestion(milliseconds);
		}
	}, [quiz, setTimeQuestion]);

	// Alterar questão
	useEffect(() => {
		if (quiz) {
			if (
				currentQuestion !== null &&
				currentQuestion < quiz.number_of_question
			) {
				setMarkedAlternative(null);
				setWrongAlternative(null);
				const altCorrect = Number(
					quiz.questions[currentQuestion].answer
				);

				setCorrectAlternative(altCorrect);
				setConfirmed(false);
			}
		}
	}, [
		currentQuestion,
		quiz,
		setMarkedAlternative,
		setCorrectAlternative,
		setConfirmed,
	]);

	return (
		<section id="section-quiz">
			{quiz ? (
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
								{quiz.number_of_question}
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
						<p className="title-quiz">{quiz.title}</p>

						{/* Question */}
						<p className="question-quiz">
							{(currentQuestion as number) + 1}
							{". "}
							{
								quiz.questions[currentQuestion as number]
									.statement
							}{" "}
						</p>

						{/* Alternatives */}
						<div className="alternatives-quiz">
							{confirmed
								? // Visualizar porcentagem
								  quiz.questions[
										currentQuestion as number
								  ].options.map((question, index) => (
										<>
											{/* Questão correta */}
											{index === correctAlternative && (
												<Alternative
													key={index}
													type="correct"
													item={index}
													content={question}
													confirmed={confirmed}
													icon={<GroupIcon />}
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
													key={index}
													type="wrong"
													item={index}
													content={question}
													confirmed={confirmed}
													icon={<GroupIcon />}
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
														key={index}
														type="disabled"
														item={index}
														content={question}
														confirmed={confirmed}
														icon={<GroupIcon />}
														percentage={
															percentageQuetions[
																index
															]
														}
													/>
												)}
										</>
								  ))
								: // Escolher alternativa
								  quiz.questions[
										currentQuestion as number
								  ].options.map((question, index) => (
										<Alternative
											key={index}
											type="standard"
											item={index}
											content={question}
											confirmed={confirmed}
											onClick={() =>
												responseQuestion(index)
											}
										/>
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
