import React from "react";
import {Route, BrowserRouter, Routes as Switch} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage"

const AppRouter = () => {
    return(
        <BrowserRouter>
        <Switch>
            <Route element={<AuthPage/>} path="/" />
            <Route element={<Homepage/>} path="/home"/>
        </Switch>
        </BrowserRouter>
    )
}

export default AppRouter;