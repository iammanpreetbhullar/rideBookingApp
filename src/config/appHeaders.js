import { SESSION_KEYS } from "./../util/constants";

//Headers to access API data 
export const HEADERS = {
    LOGIN: (basicData) => {
        return {
            'Accept': 'application/json,text/plain',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicData}`,
            'Cache-Control': 'no-cache'
        }
    },
    AUTHENTIC: () => {
        return {
            'Accept': 'application/json,text/plain',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token()}`,
            'Cache-Control': 'no-cache',
        }
    },
    FILE: () => {
        return {
            'Accept': 'application/json,text/plain',
            'Content-Type': '',
            'Authorization': `Bearer ${token()}`,
            'Cache-Control': 'no-cache',
        }
    }

}

//login token save here
function token() {
    // return authorization header with jwt token
    const sessionUsr = localStorage.getItem(SESSION_KEYS.USER);
    if (sessionUsr) {
        const loginUser = JSON.parse(sessionUsr);
        if (loginUser) {
            // return { 'Authorization': 'Bearer ' + user.token };
            if (loginUser.token) {
                return loginUser.token;
            }

            return '';
        }
    } else {
        return '';
    }
}

