import React from "react";
import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import Statistic from "./pages/Statistic";

const AppRouter = () => {
	return (
		<main>
			<BrowserRouter>
				<Switch>
					<Route element={<AuthPage />} path="/" />
					<Route element={<Homepage />} path="/home" />
					<Route element={<Statistic />} path="/statistic" />
				</Switch>
			</BrowserRouter>
		</main>
	);
};

export default AppRouter;
