import { IWSMessagePolls, IWSMessageSendPoll } from "../interfaces/IWSMessages";

export class WebSocketHandler {
	private serverTypes = ["allPolls", "sendPoll"];
	public handle(
		message: string
	): null | IWSMessagePolls | IWSMessageSendPoll {
		const data = JSON.parse(message);
		if (typeof data !== "object") {
			console.error("ws data invalid");
			return null;
		}
		const type = data.type;
		if (!this.serverTypes.includes(type)) {
			console.error("ws type invalid!");
			return null;
		}
		if (data.type === "allPolls") return data as IWSMessagePolls;
		if (data.type === "sendPoll") return data as IWSMessageSendPoll;
		return null;
	}
}

export class WebSocketEmitter {
	private clientTypes = ["postPoll"];
	public emit(message: string) {}
}
