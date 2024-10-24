import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { IPoll } from "../interfaces/IQuiz";
import { useWebSocket } from "./WebSocketContext";
import { IWSMessagePollRank } from "../interfaces/IWSMessages";
import { useCurrentQuestion } from "./questionCurrentContext";

interface IPollsContextType {
	polls: IPoll[] | null;
	setPolls: (polls: IPoll[] | null) => void;
	currentPoll: IPoll | null;
	setCurrentPoll: (poll: IPoll) => void;
	players: string[] | null;
	setPlayers: (players: string[]) => void;
	currentRank: IWSMessagePollRank | null;
	setCurrentRank: (rank: IWSMessagePollRank | null) => void;
	showPageQuiz: boolean;
	setShowPageQuiz: (showPage: boolean) => void;
	timestampQuestions: number[] | null;
	setTimestampQuestions: (timestampQuestions: number[] | null) => void;
	quizEndTimestamp: number | null;
	setQuizEndTimestamp: (timestampQuestions: number | null) => void;
}

const PollsContext = createContext<IPollsContextType | undefined>(undefined);

export const PollsProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [polls, setPolls] = useState<IPoll[] | null>(null);
	const [currentPoll, setCurrentPoll] = useState<IPoll | null>(null);
	const [players, setPlayers] = useState<string[] | null>(null);
	const [currentRank, setCurrentRank] = useState<IWSMessagePollRank | null>(
		null
	);
	const [showPageQuiz, setShowPageQuiz] = useState(false);
	// Timestamp de cada questão
	const [timestampQuestions, setTimestampQuestions] = useState<
		number[] | null
	>(null);

	// Timestamp em que o quiz é encerrado
	const [quizEndTimestamp, setQuizEndTimestamp] = useState<number | null>(
		null
	);

	const WebSocketContext = useWebSocket();

	function updatePolls(data: IPoll | IPoll[]) {
		let arrayPolls = polls || [];

		// Se data = IPoll[]
		if (Array.isArray(data)) {
			data.forEach((poll) => {
				// Verifica se o poll.id já existe em arrayPolls
				const exists = arrayPolls?.some((p) => p.id === poll.id);
				if (!exists) {
					// Se não existe, adiciona ao arrayPolls
					arrayPolls.push(poll);
				}
			});
		}
		// Se data = IPoll
		if (!Array.isArray(data)) {
			const exists = arrayPolls.some((p) => p.id === data.id);
			if (!exists) {
				// Se o id não estiver presente, adiciona o IPoll ao arrayPolls
				arrayPolls.push(data);
			}
		}

		setPolls(arrayPolls);
	}

	useEffect(() => {
		WebSocketContext.onReceiveAllPolls((e) => {
			console.log("onReceiveAllPolls -> Quizzes armazenados!");
			updatePolls(e.polls);
		});
		WebSocketContext.onReceivePoll((e) => {
			console.log("onReceivePoll -> Novo quiz adicionado!");
			updatePolls(e.poll);
		});
		// Entrar no quiz
		WebSocketContext.onReceivePlayerJoin((e) => {
			console.log(`receive-[playerJoin] -> ${e.username}`);

			let playersArray = players || [];
			if (e.pollID === currentPoll?.id) {
				// Verificar se o play já está adicionado
				const exist = playersArray.some((p) => p === e.username);

				if (!exist) {
					console.log("novo player adicionado");

					playersArray.push(e.username);
				}
			}
			console.log(playersArray);
			if (currentPoll) {
				currentPoll.playing_users = playersArray;
			}
			setPlayers(playersArray);
		});
		// Sair do quiz
		WebSocketContext.onReceivePlayerLeft((e) => {
			console.log(
				`message-[playerLeft] -> usuário ${e.username} saiu do quiz!}`
			);

			let playersArray = players || [];
			if (e.pollID === currentPoll?.id) {
				// Remover o player se ele estiver na lista
				playersArray = playersArray.filter((p) => p !== e.username);
			}
			if (currentPoll) {
				currentPoll.playing_users = playersArray;
			}
			setPlayers(playersArray);
		});
		WebSocketContext.onReceiveGameInit((e) => {
			console.log("onReceiveGameInit -> Quiz inciado!");
			const timeout = Date.now();
			// percorrer polls e alterar 'started' e 'started_at
			const arrayPolss = polls?.map((poll) => {
				if (poll.id === e.pollID) {
					poll.started_at = timeout;
					poll.started = true;
				}
				return poll
			});
			if (arrayPolss) {
				console.log(arrayPolss);
				setPolls(arrayPolss)
			}
			if (currentPoll?.id === e.pollID) {
				// Calcular tempo de encerramento do quiz
				const numberOfQuestions = currentPoll.number_of_question
				const timeQuestion = ((currentPoll.duration_in_minutes * 60) * 1000) / numberOfQuestions;
				const totalTime = (timeQuestion + 10000) * currentPoll.number_of_question;
				const quiz_end_at = e.started_at + totalTime;
				setQuizEndTimestamp(quiz_end_at);
				console.log(`%c Quiz começou às ${new Date(e.started_at)} e encerra às ${new Date(quiz_end_at)}`, 'color: #f36715');
				const minutesD = (quiz_end_at - e.started_at) / 1000 / 60;
				console.log(`%c Minutos total = ${minutesD} }`, 'color: white; background: #424292');

				// Atualizar poll atual
				const pollAddStartedAt = currentPoll;
				pollAddStartedAt.started = true;
				pollAddStartedAt.started_at = e.started_at;
				setCurrentPoll(pollAddStartedAt);

				// Mostrar página de quiz
				setShowPageQuiz(true)
			}
		});
		WebSocketContext.onReceivePollRank((e) => {
			console.log(
				`==> message-[receivePollRank] -> rank ${JSON.stringify(e)}`
			);

			const newPolls = polls?.filter((p) => e.poll.id !== p.id) || [];
			setPolls(newPolls)
			console.log('polls atualizados');

			setCurrentRank(e);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [WebSocketContext]);

	return (
		<PollsContext.Provider
			value={{
				polls,
				currentPoll,
				setCurrentPoll,
				players,
				setPlayers,
				currentRank,
				setCurrentRank,
				showPageQuiz,
				setShowPageQuiz,
				setPolls,
				timestampQuestions,
				setTimestampQuestions,
				quizEndTimestamp,
				setQuizEndTimestamp
			}}
		>
			{children}
		</PollsContext.Provider>
	);
};

export const usePolls = (): IPollsContextType => {
	const context = useContext(PollsContext);
	if (!context) {
		throw new Error("Context is type undefined");
	}
	return context;
};
