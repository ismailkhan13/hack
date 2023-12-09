import React, { useEffect, useState, useCallback, useRef } from 'react'
import "./tellUsMore.scss";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Autocomplete, FormControl, InputAdornment, MenuItem, OutlinedInput, Select, TextField, IconButton } from '@mui/material';

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";


import { yupResolver } from "@hookform/resolvers/yup";
import PhoneInput from "react-phone-input-2";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import "react-phone-input-2/lib/bootstrap.css";

import OtpInput from 'react-otp-input';



import { toast } from 'react-toastify';

import { debounce } from 'lodash';
import LeftBanner from '../left-banner/LeftBanner';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import MobileTabs from '../mobile-tabs/MobileTabs';
import { ArrowLeft, ArrowLeftSharp } from '@mui/icons-material';





import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ICitys, ICountry, IOnboardingStep1Details, IOnboardingUserDetails, IState } from '../../../types/onboarding-interfaces';
import { GLOBAL_API_ROUTES } from '../../../globalApiRoutes';
import { IAPIResponse, httpService, MODULES_API_MAP } from '../../../httpService';
import { LOCAL_STORAGE_DATA_KEYS } from '../../../localstorageDataModel';
import { getDataFromLocalStorage, setDataOnLocalStorage } from '../../../utils/globalUtilities';
import { countryWisePhoneValidation, VALIDATION_REGEX_PATTERN } from '../../../constants';


const imageBaseUrl = "https://mindler-products-images.imgix.net/confluence";

interface formType {
	name: string,
	city_id: { city_name: string, city_id: number, state_name: string, state_id: number, country_name: string, country_id: number, } | null,
	country_id: number | null,
	state_id: number | null,
	phone_no: string,
	phone_country_code: string,
	password: string,
	otp: string
	school_id: number | null,
	school_branch_id: number | null,
	school_type_id: number | null,
	email: string
}

const validationSchema = yup.object().shape({
	name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(50).matches(VALIDATION_REGEX_PATTERN.names, "Special characters and numbers are not allowed"),
	email: yup.string().required('Email is required').min(2, 'Email must be at least 2 characters').max(50).matches(VALIDATION_REGEX_PATTERN.emailPattern, "Email is  not valid"),
	phone_no: yup.string().required('Phone number is required').matches(VALIDATION_REGEX_PATTERN.mobile, 'Invalid Phone Number'),
	phone_country_code: yup.string(),
	password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').max(12, 'Password must be at most 12 characters'),
});

const schoolNameData = [{ id: 1, school_name: 'Prakriti School' }, { id: 2, school_name: 'Kaushalya World School' }];

interface TellUsMorePageProps {
	updateActiveStep: (step: number, updatedDetails?: any) => void,
	currentActiveStep: number,
	onboardingUserDetails: IOnboardingUserDetails,
	checkTemporaryLoginDetailsFn: () => void
}

/**
 * 
 *  Basic registration form with user details. Step 1 of user registration process.
 */

const TellUsMorePage = ({ updateActiveStep, currentActiveStep, onboardingUserDetails, checkTemporaryLoginDetailsFn }: TellUsMorePageProps) => {

	const [countries, setCountries] = useState<ICountry[]>([]);
	const [states, setStates] = useState<IState[]>([]);
	const [cities, setCities] = useState<ICitys[]>([]);

	const [branches, setBranches] = useState([{ school_branch_id: 0, name: "" }])

	const [isDataPatched, setIsDataPatched] = useState<boolean>(false);

	const [otpButtonClicked, setOtpButtonClicked] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [otpTimer, setOtpTimer] = useState(0);
	const [showOtp, setShowOtp] = useState<boolean>(false)
	const [isOtpVerified, setIsOtpVerified] = useState(false);
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);

	const [emailEditable, setEmailEditable] = useState(false);

	const firstOtpClick = useRef(false);

	const formDefaultValues: formType = {
		name: '',
		email: '',
		city_id: null,
		country_id: null,
		state_id: null,
		phone_no: '',
		phone_country_code: '',
		password: '',
		otp: '',
		school_id: null,
		school_branch_id: null,
		school_type_id: null
	}

	const [emailInput, setEmailInput] = useState("");
	const [emailVerified, setEmailVerified] = useState(false);

	const { register, watch, setValue, unregister, handleSubmit, formState: { errors, isSubmitted, touchedFields },
		reset, getFieldState, control, getValues, setError } = useForm<formType>({
			resolver: yupResolver(validationSchema),
			defaultValues: formDefaultValues
		});



	/**
	 *  fetch data on initial page load
	 */
	const onSchoolChange = (student_type: any) => {
		if (student_type === 1) {
			setBranches([
				{
					school_branch_id: 1,
					name: 'Prakriti Branch',

				}
			])
		}
		else if (student_type === 2) {
			setBranches([
				{
					school_branch_id: 2,
					name: 'Kaushalya Branch',
				}
			])
		}
	}

	/* Function to patch form data if coming back from next pages */
	const patchData = async () => {
		if (onboardingUserDetails) {
			for (const field in onboardingUserDetails) {

				let _field = field.toString() as keyof IOnboardingUserDetails;

				if (_field && onboardingUserDetails[_field] && (_field in formDefaultValues || _field === 'first_name' || _field === 'last_name')) { //first_name last_name hardcoded due to api inconsistency
					if (_field === 'phone_no') {
						setValue(_field as keyof formType, onboardingUserDetails.phone_country_code.slice(1) + onboardingUserDetails[_field]!.toString());
					} else if (_field === 'city_id') {
						const citiesResponse: IAPIResponse = await httpService(MODULES_API_MAP.MISCELLANEOUS, `/searchCity?keyword=${onboardingUserDetails.city_name || ""}`).GET();
						let selectedCity = citiesResponse.data?.find((city: any) => city.city_id === onboardingUserDetails[_field]);
						if (selectedCity) {
							setValue(_field as keyof formType, selectedCity);
						}
						setCities(citiesResponse.data || []);
					} else if (_field === 'first_name' || _field === 'last_name') {
						let user_name = onboardingUserDetails.name;
						if (!user_name) { //name coming from local storage
							user_name = onboardingUserDetails.first_name;
							if (onboardingUserDetails.last_name) {
								user_name += ' ' + onboardingUserDetails.last_name
							}
						}
						setValue('name', user_name);
					}
					else {
						setValue(_field as keyof formType, onboardingUserDetails[_field]!.toString());
					}
				}
			}
			if (onboardingUserDetails.otp || onboardingUserDetails?.is_phone_verified) {
				setIsOtpVerified(true);
				setShowOtp(false);
				unregister('otp');
				setValue('otp', '55555');
			}
			setIsDataPatched(true);
		} else {
			const citiesResponse: IAPIResponse = await httpService(MODULES_API_MAP.MISCELLANEOUS, `/searchCity`).GET();
			setCities(citiesResponse.data || []);
		}
	}

	/**
	 * function to get cities on the basis of selected state and searched input
	 * uses debounce (calls api with 500ms interval to reduce calls while user is typing)
	 */
	const getCities = debounce(async (searchCity: string = "") => {
		// if (searchCity.length < 3) return;'?state_id=' + state_id
		let params_url = '';
		if (searchCity) {
			params_url = 'keyword=' + searchCity;
		}
		const response: IAPIResponse = await httpService(MODULES_API_MAP.MISCELLANEOUS, `/searchCity?${params_url}`).GET();
		if (response.success) {
			const citiesData: ICitys[] = response?.data as ICitys[];
			setCities(citiesData);
		}
	}, 500);

	/**
	 * @param data: form data
	 * function to submit tell us more form
	 */
	const onSubmit = async (data: formType) => {

		let reqObj: IOnboardingStep1Details = { ...data, city_id: data.city_id?.city_id!, phone_no: data.phone_no.slice(data.phone_country_code.length - 1), city_name: data.city_id?.city_name };
		reqObj['step'] = 1;
		const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.POST_REGISTER, true, true, { key: getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_KEY), is_b2b_request: Boolean(data.school_id && data.school_branch_id) ? '1' : 0 }).POST(reqObj)

		if (response.success) {
			updateActiveStep(1, reqObj);
		} else {
			let errorMessage = response.message;
			setError('otp', { type: 'custom', message: errorMessage })
		}
	};




	const arrowBack = () => {
		navigate('/onboarding');
	}

	const onEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setEmailInput(e.target.value);
	}

	useEffect(() => {
		patchData();
	}, [])

	useEffect(() => {
		patchData();
		if (onboardingUserDetails?.email) {
			setEmailVerified(true);
			setEmailEditable(false);
			setEmailInput(onboardingUserDetails?.email || "");
		} else {
			setEmailEditable(true);
		}
	}, [onboardingUserDetails])

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='complete-signup-page tw-flex tw-justify-items-center tw-flex-wrap md:tw-flex-nowrap md:tw-gap-8'>
					<div className='tw-flex tw-justify-between md:tw-hidden tw-items-center tw-w-full md:tw-p-3 tw-px-3 tw-pt-3 tw-pb-0'>
						<div className='tw-flex tw-gap-4'>
							<div onClick={arrowBack}><ArrowBackIosNewIcon /></div>
							<div className='breadcrumb-header tw-text-lg tw-font-medium tw-ml-2'>Personal Information</div>
						</div>
						<div className='tw-font-medium tw-text-sm primary-text-1'>1/3</div>
					</div>
					<LeftBanner />
					<div className='right-section tw-w-full md:tw-w-1/2 md:tw-p-4 tw-px-4 tw-pt-0 tw-pb-4'>
						<a href={process.env.REACT_APP_MINDLER_LOGIN_URL} className='tw-flex tw-justify-start md:tw-justify-end md:tw-w-full md:tw-ml-6 tw-my-4'>
							<img className='tw-w-40 md:tw-mr-8' src={`${imageBaseUrl}/onboarding/mindlerIcon.svg`} alt='' />
						</a>
						<div className='form-container'>
							<div className='primary-text-1 tw-font-bold fs32'>
								<p>Tell us more about yourself </p>
							</div>
							<div className='tw-flex tw-mb-3 tw-w-full'>
								<div className='primary-text-1 tw-text-sm tw-font-medium tw-flex tw-w-full'>
									{

										<FormControl sx={{ width: '100%' }}>
											<div className='tw-relative tw-w-full'>
												<label className='primary-text-75 tw-font-medium fs14'>Email</label>
												<OutlinedInput sx={{ background: 'white' }} {...register('email')} placeholder="Enter Email" className='primary-text-1 tw-font-semibold tw-text-sm tw-w-full' />
												<p className='validation-msg'>{errors?.email?.message}</p>
											</div>
										</FormControl>
									}
								</div>
								{/* <div className='edit tw-ml-2 tw-px-2'>
									<div className='edit_text fs13 tw-font-medium'>Edit</div>
								</div> */}
							</div>
							<div>
								<FormControl sx={{ width: '100%' }}>
									<label className='primary-text-75 tw-font-medium fs14'>My Name Is</label>
									<OutlinedInput sx={{ background: 'white', }}
										{...register("name")} placeholder="Enter name" className='primary-text-1 tw-font-semibold tw-text-sm tw-w-full' />
									<p className='validation-msg'>{errors?.name?.message}
									</p>
								</FormControl>
							</div>
							<div className='phone tw-my-3'>
								<div className='primary-text-75 tw-font-medium tw-text-sm tw-mb-2'>Phone Number</div>
								<div className='tw-flex tw-gap-2 otp'>
									<Controller
										name='phone_no'
										control={control}
										render={
											({
												field: { onChange, onBlur, value, name, ref },
												fieldState: { invalid, isTouched, isDirty, error },
											}) => (
												<FormControl sx={{ width: '100%' }}>
													<PhoneInput
														// sx={{ background: 'white' }}
														value={value}
														specialLabel={''}
														country={'in'}
														placeholder="Enter phone number"
														preferredCountries={["in", "bh", "kw", "om", "qa", "sa", "ae"]}
														onBlur={onBlur}
														isValid={(phoneInput: string, countryDetails: any) => {
															if (!value && !touchedFields.phone_no) return true;
															if (!countryWisePhoneValidation[countryDetails.iso2?.toUpperCase()]) return true;
															if (countryWisePhoneValidation[countryDetails.iso2?.toUpperCase()].test("+" + phoneInput)) {
																setShowOtp(true);
																return true;
															}
															setShowOtp(false);
															return false;
														}}
														defaultErrorMessage={'Invalid Phone Number'}
														onChange={(value: string, data: any, c: any) => {
															// validatePhoneNumber(value, data);
															setValue('phone_country_code', '+' + data?.dialCode);
															onChange(value);
														}}
													/>
												</FormControl>
											)
										}
									/>


								</div>
								<p className='validation-msg'>
									{getFieldState('phone_no').error?.message}
								</p>
							</div>
							<div className='tw-mb-3'>
								<FormControl sx={{ width: '100%' }}>
									<label className='primary-text-75 tw-font-medium fs14'>Password</label>
									<OutlinedInput
										sx={{ background: 'white', }}
										type={showPassword ? 'text' : 'password'}
										endAdornment={
											< InputAdornment position="end" >
												<IconButton
													aria-label="toggle password visibility"
													onClick={() => { setShowPassword(!showPassword) }}
													edge="end"
												>
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										}
										{...register("password")} placeholder="Password" className='primary-text-1 tw-font-semibold tw-text-sm tw-w-full' />
									<p className='validation-msg'>{errors?.password?.message}
									</p>
								</FormControl>
							</div>

							<button className='btn btn--blue tw-font-bold tw-my-4 tw-w-full'>
								Continue
							</button>
						</div>
					</div>
				</div >
			</form >

		</>
	);
}

export default TellUsMorePage