
import axios from "axios";
import { toast } from "react-toastify";
import { LOCAL_STORAGE_DATA_KEYS } from "./localstorageDataModel";

export const MODULES_API_MAP = {
    ASSESSMENT: "https://developmentapis.mindler.com/api/assessment/v1",
    MISCELLANEOUS: "https://developmentapis.mindler.com/api/miscellaneous/v1",
    AUTHENTICATION: "https://developmentapis.mindler.com/api/authentication/v1" 
}

export interface IAPIResponse {
    message: string;
    success: boolean;
    data: any;
}


export function httpService(moduleBaseApiUrl: string | undefined = "", endpoint: string, showErrorToast = true, requireAuth = true, customHeaders: any = undefined, rawResponse = false, signal?: AbortSignal) {
    const httpInstance = axios.create({});
    if (requireAuth) {
        httpInstance.interceptors.request.use((config) => {
            let key = localStorage.getItem(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY)||"";
            config.headers = {
                key: key,
            } as any;
            if (customHeaders && Object.keys(customHeaders).length > 0) {
                config.headers = {
                    key: key,
                    ...customHeaders
                }
            }
            config.baseURL = moduleBaseApiUrl;
            return config;
        });
    }

    async function GET() {
        try {
            let config: any = {};
            if(signal){
                config["signal"] = signal;
            }
            let apiResponse = await httpInstance.get<IAPIResponse, any>(endpoint, {...config});
            if (rawResponse) {
                return apiResponse;
            }
            return apiResponse?.data;
        } catch (err: any) {
            if (showErrorToast) {
                if (err?.response.data.errors && err?.response.data?.errors[0]?.message)
                    toast.error(err?.response.data?.errors[0]?.message);
                else
                    toast.error('Something went wrong, please try later');
            } else {
                return Promise.reject(err);
            }
        }
    }

    async function POST(requestObject: any) {
        try {
            let config: any = {};
            if(signal){
                config["signal"] = signal;
            }
            let apiResponse = await httpInstance.post<IAPIResponse, any>(endpoint, requestObject, {...config});
            if (rawResponse) {
                return apiResponse;
            }
            return apiResponse?.data;
        } catch (err: any) {
            if (showErrorToast) {
                if (err?.response.data.errors && err?.response.data?.errors[0]?.message)
                    toast.error(err?.response.data?.errors[0]?.message);
                else
                    toast.error('Something went wrong, please try later');
            } else {
                return Promise.reject(err);
            }
        }
    }

    async function PUT(requestObject: any) {
        try {
            let config: any = {};
            if(signal){
                config["signal"] = signal;
            }
            let apiResponse = await httpInstance.put<IAPIResponse, any>(endpoint, requestObject, {...config});
            if (rawResponse) {
                return apiResponse;
            }
            return apiResponse?.data;
        } catch (err: any) {
            if (showErrorToast) {
                if (err?.response.data.errors && err?.response.data?.errors[0]?.message)
                    toast.error(err?.response.data?.errors[0]?.message);
                else
                    toast.error('Something went wrong, please try later');
            } else {
                return Promise.reject(err);
            }
        }
    }

    async function DELETE() {
        try {
            let config: any = {};
            if(signal){
                config["signal"] = signal;
            }
            let apiResponse = await httpInstance.delete<IAPIResponse, any>(endpoint, {...config});
            if (rawResponse) {
                return apiResponse;
            }
            return apiResponse?.data;
        } catch (err: any) {
            if (showErrorToast) {
                if (err?.response.data.errors && err?.response.data?.errors[0]?.message)
                    toast.error(err?.response.data?.errors[0]?.message);
                else
                    toast.error('Something went wrong, please try later');
            } else {
                return Promise.reject(err);
            }
        }
    }

    async function PATCH(requestObject: any) {
        try {
            let config: any = {};
            if(signal){
                config["signal"] = signal;
            }
            let apiResponse = await httpInstance.put<IAPIResponse, any>(endpoint, requestObject, {...config});
            if (rawResponse) {
                return apiResponse;
            }
            return apiResponse?.data;
        } catch (err: any) {
            if (showErrorToast) {
                if (err?.response.data.errors && err?.response.data?.errors[0]?.message)
                    toast.error(err?.response.data?.errors[0]?.message);
                else
                    toast.error('Something went wrong, please try later');
            } else {
                return Promise.reject(err);
            }
        }
    }

    return { GET, POST, PUT, PATCH, DELETE }
}
