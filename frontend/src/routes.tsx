import React from "react";
import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import Statistic from "./pages/Statistic";
import CreateQuiz from "./pages/create-quiz/createQuiz";
import GlobalRanking from "./pages/globalRanking";
import UserProvider from "./context/UserContext";
import { WebSocketProvider } from "./context/WebSocketContext";

const AppRouter = () => {
	return (
		<main>
			<UserProvider>
				<WebSocketProvider>
					<BrowserRouter>
						<Switch>
							<Route element={<AuthPage />} path="/" />
							<Route element={<Homepage />} path="/home" />
							<Route element={<Statistic />} path="/statistic" />
							<Route element={<CreateQuiz />} path="/create" />
							<Route element={<GlobalRanking />} path="/global" />
						</Switch>
					</BrowserRouter>
				</WebSocketProvider>
			</UserProvider>
		</main>
	);
};

export default AppRouter;
