import axios from 'axios'
import { GLOBAL_API_ROUTES } from '../globalApiRoutes';
import { MODULES_API_MAP } from '../httpService';



const AssessmentAPI = axios.create({
    baseURL: MODULES_API_MAP.ASSESSMENT
});



AssessmentAPI.interceptors.request.use((config) => {
    let key = localStorage.getItem('key')||"";
    config.headers = {
        'key': key
    } as any;
    return config;
});


export const getAssessmentDetails = async () => {
    try {
        const response = await AssessmentAPI.get(GLOBAL_API_ROUTES.GET_ASSESSMENT_DETAILS);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const getQuestion = async (lastQuestion = false) => {
    try {
        const response = await AssessmentAPI.get(`${GLOBAL_API_ROUTES.GET_QUESTION}?lastQuestion=${lastQuestion}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const saveAnswer = async (answerObj: { questionId: number, optionId: number }) => {
    try {
        const response = await AssessmentAPI.post(GLOBAL_API_ROUTES.SAVE_ANSWER, answerObj);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRemainingTime = async (subtest_id: number) => {
    try {
        const response = await AssessmentAPI.get(`${GLOBAL_API_ROUTES.GET_TIME}/${subtest_id}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const saveRemainingTime = async (saveTimeObj: { new_remaining_time: number, subtest_id: number }) => {
    try {
        const response = await AssessmentAPI.post(GLOBAL_API_ROUTES.SAVE_TIME, saveTimeObj);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const submitSubtest = async (submitObj: { subtest_id: number, test_id: number }) => {
    try {
        const response = await AssessmentAPI.post(GLOBAL_API_ROUTES.SUBMIT_SUBTEST, submitObj);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const getTestResult = async (test_id: number) => {
    try {
        const response = await AssessmentAPI.get(`${GLOBAL_API_ROUTES.TEST_RESULT}/${test_id}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const getCareerMatches = async () => {
    try {
        const response = await AssessmentAPI.get(`${GLOBAL_API_ROUTES.GET_CAREER_MATCHES}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const authenticateForAssessment = async (reqObj: { main_user_id: number, type: number }) => {
    try {
        const response = await AssessmentAPI.post(GLOBAL_API_ROUTES.AUTHENTICATE_USER, reqObj, {
            headers: {
                'access-key': process.env.REACT_APP_ASSESSMENT_ACCESS_KEY || "",
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
} 