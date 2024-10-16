import React from "react";
import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import Quiz from "./pages/Quiz";

const AppRouter = () => {
	return (
		<main>
			<BrowserRouter>
				<Switch>
					<Route element={<AuthPage />} path="/" />
					<Route element={<Homepage />} path="/home" />
					<Route element={<Quiz />} path="/quiz" />
				</Switch>
			</BrowserRouter>
		</main>
	);
};

export default AppRouter;
