const k_user_session_item = 'userSession';

export const getUserSessionFromStorage = () => {
    try {
        let userSession: any = localStorage.getItem(k_user_session_item);
        userSession = JSON.parse(userSession);
        return userSession;
    } catch (err) {
        return undefined;
    }
}

export const setUserSessionInStorage = (userSession: any) => {
    try {
        localStorage.setItem(k_user_session_item, JSON.stringify(userSession));
    } catch (err) {
        console.error("Error saving user session to local storage: ", err);
    }
}

export const clearUserSessionInStorage = () => {
    try {
        localStorage.removeItem(k_user_session_item);
    } catch (err) {
        console.error("Error clearing user session in local storage: ", err);
    }
}
