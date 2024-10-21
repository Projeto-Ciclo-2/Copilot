// connecting
const socket = new WebSocket("ws://localhost:5000");
socket.onopen = (e) => {
	console.log("Connection opened", e);
};
socket.onmessage = (e) => {
	console.log("Message received", e.data);
};
socket.onclose = (e) => {
	console.log("Connection closed", e);
};
socket.onerror = (e) => {
	console.log("Error occurred", e);
};

// configs
const userID = "f0bae11f-64b2-470c-9534-2660a3737652";
//const userID = "847e9612-9827-4c15-a66b-e8f5d21a919f";
//const userID = "feecdbfe-38b0-47f6-992f-58e5818aee5e";

// post poll
const postPollMessage = {
	type: "postPoll",
	body: {
		title: "Color quiz",
		theme: "colors",
		number_of_question: 2,
		number_of_alternatives: 3,
		duration_in_minutes: 2,
		owner: userID,
	},
};
socket.send(JSON.stringify(postPollMessage));



const pollID = "cab1ceb9-6fef-42ae-a0f1-f28a3ed5a02f";



// join quiz
const joinQuizMessage = {
	type: "joinQuiz",
	userID: userID,
	pollID: pollID,
};
socket.send(JSON.stringify(joinQuizMessage));


// game init
const gameInitMessage = {
	type: "gameInit",
	pollID: pollID,
	userID: userID
};
socket.send(JSON.stringify(gameInitMessage));


// test vote
socket.send(JSON.stringify({
	type: "postVote",
	body: {
		userID: userID,
		pollID: pollID,
		pollQuestionID: 0,
		userChoice: "1",
	},
}));
socket.send(JSON.stringify({
	type: "postVote",
	body: {
		userID: userID,
		pollID: pollID,
		pollQuestionID: 1,
		userChoice: "0",
	},
}));
socket.send(JSON.stringify({
	type: "postVote",
	body: {
		userID: userID,
		pollID: pollID,
		pollQuestionID: 2,
		userChoice: "1",
	},
}));
socket.send(JSON.stringify({
	type: "postVote",
	body: {
		userID: userID,
		pollID: pollID,
		pollQuestionID: 3,
		userChoice: "1",
	},
}));
