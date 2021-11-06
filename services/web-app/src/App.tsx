import React, {useEffect, useState} from 'react';
import PageRoutes from "./components/PageRoutes";
import {useDispatch} from "react-redux";
import {getUserSessionFromStorage} from "./utils/local-storage";
import {updateUserSession} from "./redux/slice/userSessionSlice";

const App = () => {
    const [appReady, setAppReady] = useState<boolean>(false);
    // get user session from redux and method to update it
    const reduxDispatch = useDispatch();

    // read and set the user session from local storage
    useEffect(() => {
        // set user session from local storage
        const userSessionInStorage = getUserSessionFromStorage();
        reduxDispatch(updateUserSession(userSessionInStorage));

        // tell app it is now ready to render the pages (auth state has been defined by now)
        setAppReady(true);
    }, []);

    return (
        <div>
            { appReady &&
                <PageRoutes/>
            }
        </div>
    );
}

export default App;
