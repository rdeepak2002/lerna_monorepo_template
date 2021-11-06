import React from "react";
import {Navigate} from "react-router-dom";
import {route_home, route_landing} from "../PageRoutes";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

const DefaultPage = () => {
    // get user session from redux and method to update it
    const userSession = useSelector((state: RootState) => state.userSession.current);

    return (
        <div>
            {/*automatically redirect to home page if logged in*/}
            {userSession
                ?
                <Navigate to={route_home}/>
                :
                <Navigate to={route_landing}/>
            }
        </div>
    );
}

export default DefaultPage;
