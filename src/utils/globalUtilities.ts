import jwt_decode from 'jwt-decode';
import jwt_encode from 'jwt-encode';
import { LOCAL_STORAGE_DATA_KEYS } from '../localstorageDataModel';



export const encodeString = (value: any) => {
    const JWT_ENCODE_SECRET = process.env.REACT_APP_JWT_ENCODE_SECRET!;
    return jwt_encode(value, JWT_ENCODE_SECRET);
}

export const decodeString = (value: string) => {
    return jwt_decode(value);
}

export const encodeKeyAndUrl = (route: string, isResourcesTabOpen = false) => {
    let userDetails: string = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.USER_DETAILS);
    if (userDetails) {
        const parsedUserDetails = JSON.parse(userDetails) as { auth_id: number; email: string; uid: number; name: string; accesscode: string; alumni_connect: 1 | 0; vip_status: "1" | undefined; referrer_code: string; };
        const userDetailsObj = {
            ...parsedUserDetails,
            isResourcesTabOpen,
            url: route
        }
        return encodeString(userDetailsObj);
    }
}

export const setDataOnLocalStorage = (key: string, value: string) => {
    return localStorage.setItem(key, value);
}

export const getDataFromLocalStorage = (key: string) => {
    const value = localStorage.getItem(key);
    if (value === null) {
        return "";
    }
    return value;
}

export const removeDataFromLocalStorage = (key: string) => {
    localStorage.removeItem(key);
}

export const isMobile = (): boolean => {
    if (window.screen.width <= 992) {
        return true;
    }
    return false;
}

/**
     * @param object - Object of objects
     * @returns - Array of objects
     */

export const getArrayOfObjects = (object: any): Array<any> => {
    if (object) {
        return Object.keys(object).map(key => {
            return object[key];
        })
    } else {
        return [];
    }
}

export const setCookie = (key: string, value: string, days = 1) => {
    var expires = "";
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();

    document.cookie = key + "=" + (value || "") + expires + "; path=/; domain=.mindler.com";
}

export const deleteCookie = (name: string) => {
    document.cookie = name +'=; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=.mindler.com';
}