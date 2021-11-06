import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignUpPage from "../SignUpPage";
import SignInPage from "../SignInPage";
import HomePage from "../HomePage";
import LandingPage from "../LandingPage";
import DefaultPage from "../DefaultPage";

// define route urls
export const route_signup = "/signup";
export const route_signin = "/signin";
export const route_home = "/home";
export const route_landing = "/landing";

const PageRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path={route_signup} element={<SignUpPage/>}/>
                <Route path={route_signin} element={<SignInPage/>}/>
                <Route path={route_home} element={<HomePage/>}/>
                <Route path={route_landing} element={<LandingPage/>}/>
                {/*fallback page when route cannot be found*/}
                <Route path="/*" element={<DefaultPage/>}/>
            </Routes>
        </Router>
    );
}

export default PageRoutes;
