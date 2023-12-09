import React, { useEffect, useState } from 'react';
import { ILoginRes, ILoginUserData, IOnboardingStep1Details, IOnboardingStep2Details, IOnboardingUserDetails } from '../../types/onboarding-interfaces';
import { useNavigate, useSearchParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';

import "./OnboardingPage.scss";
import { LOCAL_STORAGE_DATA_KEYS } from '../../localstorageDataModel';
import { httpService, IAPIResponse, MODULES_API_MAP } from '../../httpService';
import { getDataFromLocalStorage, setDataOnLocalStorage } from '../../utils/globalUtilities';
import { GLOBAL_API_ROUTES } from '../../globalApiRoutes';
import TellUsMorePage from './tell-us-more/tellUsMore';

const OnboardingPage = () => {

	const navigate = useNavigate();

	const [activeStep, setActiveStep] = useState<number>(1);

	const [onboardingUserData, setOnboardingUserData] = useState<IOnboardingUserDetails | undefined>();

	const [queryParams] = useSearchParams();

	useEffect(() => {
		_checkOnboardingCachedData();
	}, [])

	const _checkOnboardingCachedData = async () => {

		let email_signup = queryParams.get('email');
		let bail = false;

		let lead_token = queryParams.get('additional_parameters');
		let lead_send = false;
		let leadObj: any;

		if (lead_token) {
			try {
				let decoded_token = jwtDecode(lead_token);
				if (decoded_token) {
					localStorage.setItem('lead_data', JSON.stringify(decoded_token));
				}
				lead_send = true;
				leadObj = decoded_token;
			} catch (err) {
				console.log(err);
			}
		}

		if (email_signup) {
			await submitSignupEmail(email_signup, leadObj?.data).catch((err: Error) => {
				toast.error(err.message);
				bail = true;
				return;
			})
			if (!bail && lead_send) {
				let key = localStorage.getItem(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_KEY);
			}
		}

		if (bail) {
			setTimeout(() => {
				window.location.replace(process.env.REACT_APP_MINDLER_LOGIN_URL + '/login');
			}, 2000);
			return
		};



		checkTemporaryLoginDetails();

	}


	const checkTemporaryLoginDetails = () => {
		if (!getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_KEY) && !getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_DATA)) {
			return
		}

		let detailsString: string = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_DATA);
		let detailsParsed: ILoginRes;
		if (detailsString) {
			detailsParsed = JSON.parse(detailsString) as ILoginRes;
			if (!detailsParsed['userData']) {
				detailsParsed['userData'] = {} as ILoginUserData;
				detailsParsed['userData']['email'] = detailsParsed.email;
			}
			detailsParsed['userData']['is_phone_verified'] = detailsParsed?.is_phone_verified;
			setOnboardingUserData(detailsParsed.userData);
			if (detailsParsed.isCompleted !== 1 && detailsParsed.step) { //checking if there is any incomplete step on onboarding
				setActiveStep(detailsParsed.step + 1); //step - refers to number of steps completed
			}
		} else {
			throw Error("Email already registered, Signup with a different account")
		}
	}

	const submitSignupEmail = async (email: string, extraObj: any = {}) => {

		let signupRes: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.SIGN_UP, false, true, { key: getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_KEY) }).POST({ email: email, ip_adress: "", ...extraObj })
			.catch((err) => {
				// toast.error('Error Occurred, Please try Later');
			})
		if (signupRes.success) {
			let temp_session = signupRes.data?.tempSessionDetails?.session;
			let temp_data = signupRes.data;
			if (temp_session) {
				setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_KEY, temp_session);
				setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_DATA, JSON.stringify(temp_data));
			}
		} else {
			throw Error("Email already registered, Signup with a different account")
		}

	}

	const updateActiveStep = (activeStepParam: number, updatedDetails: any = null) => {
		setActiveStep(activeStepParam + 1); //step - number of steps completed + 1
		if (updatedDetails) {
			updateCachedUserData(updatedDetails, activeStepParam);
		}
	}

	const updateCachedUserData = (updatedDetails: IOnboardingStep1Details | IOnboardingUserDetails | IOnboardingStep2Details, newStep: number) => {
		let stringifiedData = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_DATA);
		let stored_data = JSON.parse(stringifiedData);
		let new_data = { ...stored_data, step: newStep, userData: { ...stored_data.userData, email: stored_data.email, ...updatedDetails, } };
		setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_DATA, JSON.stringify(new_data));
		setOnboardingUserData(new_data.userData);
	}

	return (
		<>
			{/* step - 1 - onboarding tell us about your self page */}

			{activeStep === 1 ?
				<TellUsMorePage
					updateActiveStep={updateActiveStep}
					currentActiveStep={activeStep}
					onboardingUserDetails={onboardingUserData!}
					checkTemporaryLoginDetailsFn={checkTemporaryLoginDetails}
				/>
				: null}
			{/* step - 2 - onboarding choice page */}

			{/* step - 4 - onboarding welcome page */}
			{/* {activeStep === 4 ? <WelcomeToMindlerPage onboardingUserDetails={onboardingUserData!} /> : null} */}
		</>

	)
}

export default OnboardingPage