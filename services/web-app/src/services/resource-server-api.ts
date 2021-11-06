import axios from "axios";

// TODO: get API url from .env file
const RESOURCE_API_URL = 'http://localhost:8081';

export const testUserAccess = async (userSession: any) => {
    // TODO: pass in redux function to update tokens if necessary
    const accessToken = userSession.accessToken.token;

    const config: any = {
        method: 'get',
        url: `${RESOURCE_API_URL}/api/v1/test/user`,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };

    return axios(config);
}
