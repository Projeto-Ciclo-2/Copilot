import React, {
	ReactNode,
	createContext,
	useContext,
	useState,
} from "react";

interface IQuestionCurrentContextType {
	timeQuestion: number | null;
	setTimeQuestion: (time: number | null) => void;
	markedAlternative: number | null;
	setMarkedAlternative: (number: number | null) => void;
	setNumberOfQuestions: (questions: number) => void;
	setConfirmed: (confirmed: boolean) => void;
	confirmed: boolean;
	currentQuestion: number | null;
	numberOfQuestions: number;
	setCurrentQuestion: (question_number: number) => void;
	addQuestion: (option?: "reset") => void;
}

const QuestionCurrentContext = createContext<IQuestionCurrentContextType | undefined>(undefined);

export const QuestionCurrentProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [currentQuestion, setCurrentQuestion] = useState<number>(0); // 0 = primeira questão
	const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);
	const [markedAlternative, setMarkedAlternative] = useState<number | null>(null)
	const [timeQuestion, setTimeQuestion] = useState<number | null>(null);
	const [confirmed, setConfirmed] = useState(false);

	function addQuestion(option?: "reset") {
		setCurrentQuestion(currentQuestion + 1);
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
				addQuestion,
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
