import { IPoll } from "../interfaces/IQuiz";
import { QuizGenerator } from "../quiz-generator";
import { ErrorWhileGeneratingQuiz } from "../utils/Exception";

const quizGenerator = new QuizGenerator();
let redisController: any;

let ws: any;

ws.on("postQuiz", async (e: any) => {
	const { title, qntd_question, qntd_alternatives, theme } = e.body;
	// validar
	const prompt = quizGenerator.generatePrompt(
		title,
		theme,
		qntd_question,
		qntd_alternatives
	);
	const gptQuestions = await quizGenerator.create(prompt);
	if (gptQuestions instanceof ErrorWhileGeneratingQuiz) {
		return;
	}
	const gptQuestionsWithID = gptQuestions.map((question, index) => {
		return {
			id: index,
			statement: question.statement,
			options: question.options,
			answer: question.answer,
			explanation: question.explanation,
		};
	});
	const quizID = generateUUID();
	const quiz: IPoll = {
		id: quizID, //gerar id do quiz
		title: title,
		theme: theme,
		number_of_alternatives: qntd_alternatives,
		number_of_question: qntd_question,
		questions: gptQuestionsWithID,
		duration_in_minutes: 10,
	};

	redisController.set(quizID, quiz);
	redisController.get(quizID);
});

ws.on("triggerStart");

function generateUUID() {
	return "Function not implemented.";
}
