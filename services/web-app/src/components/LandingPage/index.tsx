import React from "react";
import {Link} from "react-router-dom";
import {route_signin, route_signup} from "../PageRoutes";

const LandingPage = () => {
    return (
        <div>
            <p>landing page</p>
            <div>
                <Link to={route_signin}>login</Link>
            </div>
            <div>
                <Link to={route_signup}>register</Link>
            </div>
        </div>
    );
}

export default LandingPage;
