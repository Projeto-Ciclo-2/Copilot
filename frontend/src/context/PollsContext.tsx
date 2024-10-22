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

interface IPollsContextType {
	polls: IPoll[] | null;
	currentPoll: IPoll | null;
	setCurrentPoll: (poll: IPoll) => void;
	players: string[] | null;
	setPlayers: (players: string[]) => void;
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
			polls?.forEach((poll) => {
				if (poll.id === currentPoll?.id) {
					poll.started_at = timeout;
					poll.started = true;
				}
			});
		});
		WebSocketContext.onReceivePollRank((e) => {
			setCurrentRank(e);
		});
		WebSocketContext.onReceiveGameInit((e) => {
			if (currentPoll?.id === e.pollID) {
				const pollObj = currentPoll;
				pollObj.started = true;
				pollObj.started_at = e.started_at;
				setCurrentPoll(pollObj);
			} else {
				if (polls) {
					const pollsArray = polls?.map((p) => {
						if (p.id === e.pollID) {
							const tempPoll = p;
							tempPoll.started_at = e.started_at;
							tempPoll.started = true;
							return tempPoll;
						}

						return p;
					});
					setPolls(pollsArray);
				}
			}
		});
	}, [WebSocketContext]);

	return (
		<PollsContext.Provider
			value={{ polls, currentPoll, setCurrentPoll, players, setPlayers }}
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
