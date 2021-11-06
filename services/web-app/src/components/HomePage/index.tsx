import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Navigate, useNavigate} from "react-router-dom";
import {route_landing} from "../PageRoutes";
import {signOut} from "../../services/auth-server-api";
import {updateUserSession} from "../../redux/slice/userSessionSlice";
import {clearUserSessionInStorage} from "../../utils/local-storage";

const HomePage = (props: any) => {
    // get router history
    let navigate = useNavigate();

    // get user session from redux
    const userSession = useSelector((state: RootState) => state.userSession.current);
    const reduxDispatch = useDispatch();

    return (
        <div>
            {/*go to landing page if not logged in, otherwise display content*/}
            {!userSession
                ?
                <Navigate to={route_landing}/>
                :
                <div>
                    <p>home page content</p>
                    <p>user session:</p>
                    <p>{JSON.stringify(userSession)}</p>
                    <button onClick={() => {
                        const clearSessionAndRedirect = () => {
                            // clear user session and navigate to landing page
                            clearUserSessionInStorage();
                            reduxDispatch(updateUserSession(undefined));
                            navigate(route_landing);
                        }

                        signOut(userSession)
                            .then((res) => {
                                clearSessionAndRedirect();
                            }).catch((err) => {
                                clearSessionAndRedirect();
                            });
                    }}>sign out</button>
                </div>
            }
        </div>
    );
}

export default HomePage;
