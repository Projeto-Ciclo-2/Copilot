import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { usePolls } from "./PollsContext";
import { useWebSocket } from "./WebSocketContext";
import { UserContext } from "./UserContext";

interface IQuestionCurrentContextType {
	timeQuestion: number | null;
	setTimeQuestion: (time: number | null) => void;
	markedAlternative: number | null;
	setMarkedAlternative: (number: number | null) => void;
	setNumberOfQuestions: (questions: number) => void;
	setConfirmed: (confirmed: boolean) => void;
	confirmed: boolean;
	showPageRanking: boolean;
	initialRender: boolean;
	currentQuestion: number | null;
	numberOfQuestions: number;
	setCurrentQuestion: (question_number: number) => void;
	timeNextQuestion: (time: number) => void;
	showAlternative: "alternative" | "response";
	setShowAlternative: (type: "alternative" | "response") => void;

}

const QuestionCurrentContext = createContext<
	IQuestionCurrentContextType | undefined
>(undefined);

export const QuestionCurrentProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [currentQuestion, setCurrentQuestion] = useState<number>(0); // 0 = primeira questão
	//
	const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);
	const [markedAlternative, setMarkedAlternative] = useState<number | null>(
		null
	);
	const [timeQuestion, setTimeQuestion] = useState<number | null>(null);
	const [confirmed, setConfirmed] = useState(false);
	const [showAlternative, setShowAlternative] = useState<
		"alternative" | "response"
	>("alternative");
	const [showPageRanking, setShowPageRanking] = useState(false);

	const [votes, setVotes] = useState<string[] | null>(null);

	const [initialRender, setinitialRender] = useState(true);





	// CALCULAR PORCENTAGEM
	// Vote (state)
	// receber voto -> setVote()
	const [percentageQuetions, setPercentageQuestions] = useState<string[]>([
		"0",
		"0",
		"0",
		"0",
	]);

	const { polls, setPolls, timestampQuestions } = usePolls();

	function timeNextQuestion(time: number) {
		const timeout = setTimeout(() => {
			// adicionar pergunta
			if (currentQuestion < numberOfQuestions - 1) {
				const time = new Date(Date.now())
				console.info(`%c ==> Pergunta ${currentQuestion + 1} terminiou: ${time}`, 'color: #93c449');
				if (timestampQuestions && currentQuestion) {
					console.info(`%c -> Pergunta ${currentQuestion + 2} termina: ${new Date(timestampQuestions[currentQuestion + 1])}`, 'color: #d8773b');
				}
				setCurrentQuestion(currentQuestion + 1);
				setShowAlternative("alternative");
				if (initialRender) {
					setinitialRender(false)
				}
			}
			if ((currentQuestion as number) >= numberOfQuestions - 1) {
				setShowPageRanking(true);

				// excluir poll
				console.log("Quiz finalizado com sucesso!");
				if (polls && currentPoll) {
					const arrayPolls = polls.filter(
						(p) => currentPoll.id !== p.id
					);
					setPolls(arrayPolls);
				}
			}
			clearTimeout(timeout);
		}, time);
	}

	const { currentPoll } = usePolls();
	const WebSocketContext = useWebSocket();
	const userContext = useContext(UserContext);

	useEffect(() => {
		WebSocketContext.onReceiveVote((e) => {
			// Verifica se é o poll atual
			if (currentPoll?.id === e.pollID) {
				console.log(
					`message-[receiveVote] => usuário ${userContext?.user?.name} votou ${e.userChoice}`
				);
				const votesArray = votes || [];
				votesArray.push(e.userChoice);
				setVotes(votesArray);
			}
		});
	}, [WebSocketContext]);

	return (
		<QuestionCurrentContext.Provider
			value={{
				currentQuestion,
				setCurrentQuestion,
				numberOfQuestions,
				setNumberOfQuestions,
				markedAlternative,
				setMarkedAlternative,
				timeQuestion,
				setTimeQuestion,
				confirmed,
				setConfirmed,
				timeNextQuestion,
				showAlternative,
				setShowAlternative,
				showPageRanking,
				initialRender
			}}
		>
			{children}
		</QuestionCurrentContext.Provider>
	);
};

export const useCurrentQuestion = (): IQuestionCurrentContextType => {
	const context = useContext(QuestionCurrentContext);
	if (!context) {
		throw new Error("Context is type undefined");
	}
	return context;
};
