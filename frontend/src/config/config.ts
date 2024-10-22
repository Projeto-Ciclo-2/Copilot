const HOSTNAME = "backend";

export const config = {
	API_URL: "http://" + HOSTNAME + ":5000/api",
	WS_URL: "ws://" + HOSTNAME + ":5000",
	DEBUG_MODE: true,
};
