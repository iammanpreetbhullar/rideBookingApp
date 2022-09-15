import { SESSION_KEYS } from "./../util/constants";

export async function createSession(userData) {
    localStorage.setItem(SESSION_KEYS.USER, JSON.stringify(userData));
    const jwt = parseJwt(userData.token);
    const exp = new Date(jwt.exp * 1000);
    localStorage.setItem(SESSION_KEYS.EXPIRY, exp.getTime());
    localStorage.setItem("resources", userData.resourceBaseUrl);
    localStorage.setItem("userRole", userData.roleName);
    localStorage.setItem("companyInfo", JSON.stringify(userData.companyInfo));
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

export function isAuthenticated() {
    const sessionUser = localStorage.getItem(SESSION_KEYS.USER);


    if (sessionUser && isExpired()) {
        invalidateSession();
        return false;
    }
    return sessionUser ? true : false;
}

function isExpired() {
    const exp = localStorage.getItem(SESSION_KEYS.EXPIRY);
    if (Date.now() <= exp) {
        return false;
    }
    return true;
}

export const resourceURL = localStorage.getItem("resources");
export const currentUserRole = localStorage.getItem("roleName");

export function invalidateSession() {
    localStorage.removeItem(SESSION_KEYS.USER);
    localStorage.removeItem(SESSION_KEYS.EXPIRY);
}

