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
	currentRank: IWSMessagePollRank | null;
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
			// console.log(`receive-[playerJoin] -> ${e.username}`);
			console.log(e);
			if (e.poll && e.pollID === currentPoll?.id) {
				const users = e.poll.playing_users.map((u) => u.username);
				setPlayers(users);
			} else {
				const tempPolls = polls?.map((p) => {
					if (p.id === e.poll.id) {
						return e.poll;
					}
					return p;
				});
				if (tempPolls) {
					setPolls(tempPolls);
				}
			}
		});
		// Sair do quiz
		WebSocketContext.onReceivePlayerLeft((e) => {
			console.log(e);
			if (e.poll && e.pollID === currentPoll?.id) {
				const users = e.poll.playing_users.map((u) => u.username);
				setPlayers(users);
			} else {
				const tempPolls = polls?.map((p) => {
					if (p.id === e.poll.id) {
						return e.poll;
					}
					return p;
				});
				if (tempPolls) {
					setPolls(tempPolls);
				}
			}
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
			console.log(
				`==> message-[receivePollRank] -> rank ${JSON.stringify(e)}`
			);

			if (currentPoll?.id) {
				// todo: excluir quiz
			}
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
