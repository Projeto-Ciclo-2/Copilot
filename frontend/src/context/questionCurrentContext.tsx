import React, { ReactNode, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IQuestionCurrentContextType {
	timeQuestion: number | null;
	setTimeQuestion: (time: number | null) => void;
	markedAlternative: number | null;
	setMarkedAlternative: (number: number | null) => void;
	setNumberOfQuestions: (questions: number) => void;
	setConfirmed: (confirmed: boolean) => void;
	confirmed: boolean;
	showPageRanking: boolean;
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

	// CALCULAR PORCENTAGEM
	// Vote (state)
	// receber voto -> setVote()
	const [percentageQuetions, setPercentageQuestions] = useState<string[]>([
		"25",
		"15",
		"31",
		"29",
	]);

	function timeNextQuestion(time: number) {
		const timeout = setTimeout(() => {
			// adicionar pergunta
			if (currentQuestion < numberOfQuestions - 1) {
				setCurrentQuestion(currentQuestion + 1);
				setShowAlternative('alternative')
			}
			if ((currentQuestion as number) >= numberOfQuestions - 1) {
				setShowPageRanking(true);
			}
			clearTimeout(timeout);
		}, time);
	}

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
