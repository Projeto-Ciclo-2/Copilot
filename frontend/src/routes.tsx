import React from "react";
import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import { WebSocketProvider } from "./context/WebSocketContext";
import UserProvider from "./context/UserContext";

import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import Quiz from "./pages/Quiz";
import Statistic from "./pages/Statistic";
import CreateQuiz from "./pages/create-quiz/createQuiz";
import Lobby from "./pages/Lobby";
import GlobalRanking from "./pages/globalRanking";
import RankingQuiz from "./pages/rankingQuiz";
import LandingPage from "./pages/landingPage";

const AppRouter = () => {
	return (
		<main>
			<UserProvider>
				<WebSocketProvider>
					<BrowserRouter>
						<Switch>
							<Route element={<LandingPage/>} path="/"/>
							<Route element={<AuthPage />} path="/auth" />
							<Route element={<Homepage />} path="/home" />
							<Route element={<Quiz />} path="/quiz" />
							<Route element={<Statistic />} path="/statistic" />
							<Route element={<CreateQuiz />} path="/create" />
							<Route element={<GlobalRanking />} path="/global" />
							<Route element={<Lobby />} path="/lobby" />
							<Route element={<GlobalRanking />} path="/global" />
							<Route element={<RankingQuiz />} path="/ranking" />
						</Switch>
					</BrowserRouter>
				</WebSocketProvider>
			</UserProvider>
		</main>
	);
};

export default AppRouter;
