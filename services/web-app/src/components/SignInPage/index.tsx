import React, {useState} from "react";
import {signIn} from "../../services/auth-server-api";
import {useDispatch, useSelector} from "react-redux";
import {updateUserSession} from "../../redux/slice/userSessionSlice";
import {setUserSessionInStorage} from "../../utils/local-storage";
import { useNavigate } from "react-router-dom"
import {route_home} from "../PageRoutes";

const SignInPage = (props: any) => {
    // get router history
    let navigate = useNavigate();

    // get user session from redux and method to update it
    const reduxDispatch = useDispatch();

    // store username and password in variables
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // handle pressing login button or submitting login form
    const submitForm = (e: any) => {
        // prevent form refresh
        e.preventDefault();

        // return if invalid input
        if(username.length === 0 || password.length === 0) {
            return;
        }

        // sign in
        signIn(username, password)
            .then((res) => {
                // get the user session from api call
                const userSession = res.data;
                // store user session in local storage
                setUserSessionInStorage(userSession);
                // store user session in redux
                reduxDispatch(updateUserSession(userSession));
                // navigate to home page
                navigate(route_home);
            })
            .catch((err) => {
                console.error('signin page: login error', err);
            })
    }

    return (
        <div>
            <p>sign in page</p>

            <form onSubmit={submitForm}>
                <input placeholder={"username"} onChange={(e)=>{setUsername(e.target.value)}}></input>
                <input type={"password"} placeholder={"password"} onChange={(e)=>{setPassword(e.target.value)}}></input>
                <button type={"submit"}>
                    login
                </button>
            </form>
        </div>
    );
}

export default SignInPage;
