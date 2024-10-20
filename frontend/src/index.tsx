import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QuestionCurrentProvider } from "./context/questionCurrentContext";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<QuestionCurrentProvider>
		<App />
	</QuestionCurrentProvider>
);
