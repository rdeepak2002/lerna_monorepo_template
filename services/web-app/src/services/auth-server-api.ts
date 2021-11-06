import axios from "axios";

// TODO: get API url from .env file
const AUTH_API_URL = 'http://localhost:8080';

export const signUp = async (username: string, email: string, password: string) => {
    const data = JSON.stringify({
        "username": username,
        "email": email,
        "password": password
    });

    const config: any = {
        method: 'post',
        url: `${AUTH_API_URL}/api/v1/auth/signup`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config);
}

export const signIn = async (username: string, password: string) => {
    const data = JSON.stringify({
        "username": username,
        "password": password
    });

    const config: any = {
        method: 'post',
        url: `${AUTH_API_URL}/api/v1/auth/signin`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config);
}

export const refreshTokens = async (userSession: any) => {
    // TODO: pass in redux function to update tokens if necessary

    const refreshToken = userSession.refreshToken.token;

    const data = JSON.stringify({
        "refreshToken": refreshToken
    });

    const config: any = {
        method: 'post',
        url: `${AUTH_API_URL}/api/v1/auth/refresh_tokens`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config);
}

export const signOut = async (userSession: any) => {
    const refreshToken = userSession.refreshToken.token;

    const data = JSON.stringify({
        "refreshToken": refreshToken
    });

    const config: any = {
        method: 'post',
        url: `${AUTH_API_URL}/api/v1/auth/signout`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config);
}
