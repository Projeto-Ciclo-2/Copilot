import React from "react";
import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import Quiz from "./pages/Quiz";
import Statistic from "./pages/Statistic";
import CreateQuiz from "./pages/create-quiz/createQuiz";
import Lobby from "./pages/Lobby";
import GlobalRanking from "./pages/globalRanking";
import RankingQuiz from "./pages/rankingQuiz";

const AppRouter = () => {
	return (
		<main>
			<BrowserRouter>
				<Switch>
					<Route element={<AuthPage />} path="/" />
					<Route element={<Homepage />} path="/home" />
					<Route element={<Quiz />} path="/quiz" />
					<Route element={<Statistic />} path="/statistic" />
					<Route element={<CreateQuiz />} path="/create" />
					<Route element={<Lobby />} path="/lobby" />
					<Route element={<GlobalRanking/>} path="/global" />
					<Route element={<RankingQuiz/>} path="/ranking" />
				</Switch>
			</BrowserRouter>
		</main>
	);
};

export default AppRouter;
