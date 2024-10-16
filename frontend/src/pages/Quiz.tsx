import React from "react";
import Btn from "../components/button";
import LinearProgressComponent from "../components/linearProgress";

const Quiz = () => {
	const [vote, setVote] = ()

	// USER
	// mandar um message -> voto do usuário

	// WS
	// message -> usuário acabou de votar
	/*
		id: string;
		user_id: string;
		poll_id: string;
		poll_question_id: string;
		user_choice: string;
	*/

	// calcular a porcentagem por pegunta


	function exitQuiz() {
		console.log("Usuário saiu do quiz com sucesso!");
	}



	// questoes
	const current_question = 1;
	const total_questions = 10;

	// acertos
	const correct_questions: number = 0;

	return (
		<section id="section-quiz">
			<section id="header-quiz">
				<Btn
					type="button"
					text="Sair"
					className="button-exit-quiz"
					onClick={exitQuiz}
				/>
				<div>
					<p>
						{current_question}/{total_questions}
					</p>
					<p>
						{correct_questions}{" "}
						{correct_questions === 1 ? "acerto" : "acertos"}
					</p>
				</div>
			</section>
			<section>
				<LinearProgressComponent />
			</section>
		</section>
	);
};

export default Quiz;
