import React from "react";
import { config } from "../config/config";
import {
	IWSMessageGameInit,
	IWSMessageJoinQuiz,
	IWSMessageLeftQuiz,
	IWSMessageOwnerChange,
	IWSMessageOwnerGiveUp,
	IWSMessagePlayerJoin,
	IWSMessagePollRank,
	IWSMessagePolls,
	IWSMessagePostLeftQuiz,
	IWSMessagePostPoll,
	IWSMessagePostVote,
	IWSMessageSendGameInit,
	IWSMessageSendPoll,
	IWSMessageSendVote,
} from "../interfaces/IWSMessages";
import DebugConsole from "../log/DebugConsole";

/**
 * WebSocket context interface that defines the structure and behavior of the WebSocket provider.
 */
interface WebSocketContextType {
	/**
	 * The active WebSocket instance or null if not connected.
	 */
	socket: WebSocket | undefined;

	/**
	 * The latest message received from the WebSocket, stored as a string.
	 */
	latestMessage: string | null;

	/**
	 * Indicates whether the WebSocket is currently connected.
	 */
	isConnected: React.MutableRefObject<boolean>;

	/**
	 * Indicates whether a connection to the WebSocket server is allowed.
	 */
	canConnect: React.MutableRefObject<boolean>;

	/**
	 * Registers a callback to handle receiving all polls from the server.
	 * @param {(e: IWSMessagePolls) => any} cbFn - The callback function that handles the received poll data.
	 */
	onReceiveAllPolls: (cbFn: (e: IWSMessagePolls) => any) => void;

	/**
	 * Registers a callback to handle receiving a specific poll from the server.
	 * @param {(e: IWSMessageSendPoll) => any} cbFn - The callback function for handling the poll data.
	 */
	onReceivePoll: (cbFn: (e: IWSMessageSendPoll) => any) => void;

	/**
	 * Registers a callback to handle when a player joins a game
	 * @param {(e: IWSMessagePlayerJoin) => any} cbFn - The callback function for handling the poll data.
	 */
	onReceivePlayerJoin: (cbFn: (e: IWSMessagePlayerJoin) => any) => void;

	/**
	 * Registers a callback to handle a player quitting a quiz
	 * @param {(e: IWSMessageLeftQuiz) => any} cbFn - The callback function for handling the poll data.
	 */
	onReceivePlayerLeft: (cbFn: (e: IWSMessageLeftQuiz) => any) => void;

	/**
	 * Registers a callback to handle owner change events from the server.
	 * @param {(e: IWSMessageOwnerChange) => any} cbFn - The callback function for handling the owner change.
	 */
	onReceiveOwnerChange: (cbFn: (e: IWSMessageOwnerChange) => any) => void;

	/**
	 * Registers a callback to handle game initialization events from the server.
	 * @param {(e: IWSMessageSendGameInit) => any} cbFn - The callback function for handling game initialization data.
	 */
	onReceiveGameInit: (cbFn: (e: IWSMessageSendGameInit) => any) => void;

	/**
	 * Registers a callback to handle vote submission events from the server.
	 * @param {(e: IWSMessageSendVote) => any} cbFn - The callback function for handling vote submissions.
	 */
	onReceiveVote: (cbFn: (e: IWSMessageSendVote) => any) => void;

	/**
	 * Registers a callback to handle poll ranking events from the server.
	 * @param {(e: IWSMessagePollRank) => any} cbFn - The callback function for handling poll ranking data.
	 */
	onReceivePollRank: (cbFn: (e: IWSMessagePollRank) => any) => void;

	/**
	 * Sends a new poll to the server.
	 * @param {IWSMessagePostPoll} obj - The poll data to be sent.
	 */
	sendPoll: (obj: IWSMessagePostPoll) => void;

	/**
	 * @deprecated DO NOT USE THIS SEND EVENT. INSTEAD USE LEFT QUIZ FOR ALL USERS, OWNER INCLUDED.
	 * @description Sends a request to give up ownership of the quiz.
	 * @param {IWSMessageOwnerGiveUp} obj - The give-up request data.
	 */
	sendOwnerGiveUp: (obj: IWSMessageOwnerGiveUp) => void;

	/**
	 * Sends a request to join the quiz.
	 * @param {IWSMessageJoinQuiz} obj - The join request data.
	 */
	sendJoinQuiz: (obj: IWSMessageJoinQuiz) => void;

	/**
	 * Sends a request to leave the quiz.
	 * @param {IWSMessageLeftQuiz} obj - The leave request data.
	 */
	sendLeftQuiz: (obj: IWSMessagePostLeftQuiz) => void;

	/**
	 * Sends game initialization data to the server.
	 * @param {IWSMessageGameInit} obj - The game initialization data.
	 */
	sendGameInit: (obj: IWSMessageGameInit) => void;

	/**
	 * Sends a vote to the server.
	 * @param {IWSMessagePostVote} obj - The vote data to be sent.
	 */
	sendVote: (obj: IWSMessagePostVote) => void;
}

const WebSocketContext = React.createContext<WebSocketContextType | undefined>(
	undefined
);

interface WebSocketProviderProps {
	children: React.ReactNode;
}

type serverActions =
	| "allPolls"
	| "sendPoll"
	| "sendPlayerJoin"
	| "leftQuiz"
	| "ownerChange"
	| "sendGameInit"
	| "sendVote"
	| "pollRank";
const validActions: serverActions[] = [
	"allPolls",
	"sendPoll",
	"sendPlayerJoin",
	"leftQuiz",
	"ownerChange",
	"sendGameInit",
	"sendVote",
	"pollRank",
];
const fnMapping: Record<serverActions, (e: any) => void> = {
	allPolls: (e: IWSMessagePolls) => {},
	sendPoll: (e: IWSMessageSendPoll) => {},
	sendPlayerJoin: (e: IWSMessagePlayerJoin) => {},
	leftQuiz: (e: IWSMessageLeftQuiz) => {},
	ownerChange: (e: IWSMessageOwnerChange) => {},
	sendGameInit: (e: IWSMessageSendGameInit) => {},
	sendVote: (e: IWSMessageSendVote) => {},
	pollRank: (e: IWSMessagePollRank) => {},
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
	children,
}) => {
	const isConnected = React.useRef(false);
	const canConnect = React.useRef(false);
	const tryingToConnect = React.useRef(false);
	const [latestMessage, setLatestMessage] = React.useState<string | null>(
		null
	);
	const socketRef = React.useRef<undefined | WebSocket>(undefined);
	const socket = React.useMemo<undefined | WebSocket>(() => {
		const allowed = canConnect.current || !isConnected.current;
		console.log(
			"allowed " +
				allowed +
				" | tryingToConnect " +
				tryingToConnect.current
		);

		if (!allowed || tryingToConnect.current) {
			DebugConsole("-ws blocked-");
			return socketRef.current;
		}
		DebugConsole("!ws allowed to connect. Trying to connect!");

		tryingToConnect.current = true;
		const tempWS = new WebSocket(config.WS_URL);
		socketRef.current = tempWS;
		return tempWS;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [canConnect.current, isConnected.current, tryingToConnect.current]);

	React.useEffect(() => {
		if (!socket) return;

		socket.onopen = () => {
			tryingToConnect.current = false;
			isConnected.current = true;
			DebugConsole("WebSocket connection established");
		};

		socket.onmessage = (event: MessageEvent) => {
			setLatestMessage(event.data);
			DebugConsole("ws receive a message");
			if (event.data) {
				const data = JSON.parse(event.data);
				const type = data.type;
				const valid = data && type;
				const typeValid =
					typeof data === "object" && typeof type === "string";
				if (valid && typeValid) {
					let isValidAction = false;
					for (const action of validActions) {
						if (action === type) isValidAction = true;
					}
					if (isValidAction) {
						DebugConsole(
							"ws calling callback function '" + type + "'."
						);

						return fnMapping[type as serverActions](data);
					}
					return console.error(
						"ws received a not valid type: '" + type + "'."
					);
				}
				DebugConsole("ws received a not valid data.", data);
			}
			DebugConsole(event.data);
		};

		socket.onclose = () => {
			tryingToConnect.current = false;
			isConnected.current = false;
			DebugConsole("WebSocket connection closed");
		};

		socket.onerror = (error) => {
			tryingToConnect.current = false;
			isConnected.current = false;
			console.error("WebSocket error:", error);
		};

		return () => {
			DebugConsole("ws effect dismounting context.");
			tryingToConnect.current = false;
			isConnected.current = false;
			socket.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const sendMessage = (message: string) => {
		if (socket?.readyState === WebSocket.OPEN) {
			DebugConsole("ws sending message to backend");
			socket.send(message);
		} else {
			console.error("WebSocket is not open");
		}
	};

	const setCallback = <T,>(
		action: serverActions,
		cbFn: (e: T) => void
	): any => {
		fnMapping[action] = cbFn;
	};

	return (
		<WebSocketContext.Provider
			value={{
				socket: socket,
				latestMessage,
				isConnected,
				canConnect,

				onReceiveAllPolls: (cbFn) =>
					setCallback<IWSMessagePolls>("allPolls", cbFn),
				onReceivePoll: (cbFn) =>
					setCallback<IWSMessageSendPoll>("sendPoll", cbFn),
				onReceivePlayerJoin: (cbFn) =>
					setCallback<IWSMessagePlayerJoin>("sendPlayerJoin", cbFn),
				onReceivePlayerLeft: (cbFn) =>
					setCallback<IWSMessageLeftQuiz>("leftQuiz", cbFn),
				onReceiveOwnerChange: (cbFn) =>
					setCallback<IWSMessageOwnerChange>("ownerChange", cbFn),
				onReceiveGameInit: (cbFn) =>
					setCallback<IWSMessageSendGameInit>("sendGameInit", cbFn),
				onReceiveVote: (cbFn) =>
					setCallback<IWSMessageSendVote>("sendVote", cbFn),
				onReceivePollRank: (cbFn) =>
					setCallback<IWSMessagePollRank>("pollRank", cbFn),

				sendPoll: (obj: IWSMessagePostPoll) => {
					sendMessage(JSON.stringify(obj));
				},
				sendOwnerGiveUp: (obj: IWSMessageOwnerGiveUp) => {
					sendMessage(JSON.stringify(obj));
				},
				sendJoinQuiz: (obj: IWSMessageJoinQuiz) => {
					sendMessage(JSON.stringify(obj));
				},
				sendLeftQuiz: (obj: IWSMessagePostLeftQuiz) => {
					sendMessage(JSON.stringify(obj));
				},
				sendGameInit: (obj: IWSMessageGameInit) => {
					sendMessage(JSON.stringify(obj));
				},
				sendVote: (obj: IWSMessagePostVote) => {
					sendMessage(JSON.stringify(obj));
				},
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = (): WebSocketContextType => {
	const context = React.useContext(WebSocketContext);
	if (!context) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}
	return context;
};
