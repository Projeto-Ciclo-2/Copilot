import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	ReactNode,
} from "react";
import { config } from "../config/config";

// Define WebSocket context types
interface WebSocketContextType {
	socket: WebSocket | null;
	sendMessage: (message: string) => void;
	latestMessage: string | null;
	isConnected: boolean;
	canConnect: boolean;
	setCanConnect: (can: boolean) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined
);

interface WebSocketProviderProps {
	children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
	children,
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [latestMessage, setLatestMessage] = useState<string | null>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const [canConnect, setCanConnect] = useState(false);

	useEffect(() => {
		if(!canConnect) return;
		console.log("can connect!");

		const socket = new WebSocket(config.WS_URL);
		socketRef.current = socket;

		socket.onopen = () => {
			setIsConnected(true);
			console.log("WebSocket connection established");
		};

		socket.onmessage = (event: MessageEvent) => {
			setLatestMessage(event.data);
			console.log(event.data);
		};

		socket.onclose = () => {
			setIsConnected(false);
			console.log("WebSocket connection closed");
		};

		socket.onerror = (error) => {
			setIsConnected(false);
			console.error("WebSocket error:", error);
		};

		// Clean up WebSocket on component unmount
		return () => {
			setIsConnected(false);
			socket.close();
		};
	}, [canConnect]);

	const sendMessage = (message: string) => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(message);
		} else {
			console.error("WebSocket is not open");
		}
	};

	return (
		<WebSocketContext.Provider
			value={{
				socket: socketRef.current,
				sendMessage,
				latestMessage,
				isConnected,
				canConnect,
				setCanConnect
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = (): WebSocketContextType => {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}
	return context;
};
