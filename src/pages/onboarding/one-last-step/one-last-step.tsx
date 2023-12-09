import React, { useEffect, useState } from 'react'
import "./one-last-step.scss";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import LeftBanner from '../left-banner/LeftBanner';


import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import MobileTabs from '../mobile-tabs/MobileTabs';

import { useNavigate } from 'react-router-dom';
import { IOnboardingUserDetails } from '../../../types/onboarding-interfaces';
import { GLOBAL_API_ROUTES } from '../../../globalApiRoutes';
import { httpService, MODULES_API_MAP, IAPIResponse } from '../../../httpService';
import { LOCAL_STORAGE_DATA_KEYS } from '../../../localstorageDataModel';
import { getDataFromLocalStorage, removeDataFromLocalStorage, setDataOnLocalStorage } from '../../../utils/globalUtilities';



/**
 * @author: Prashant Sharma
 * @desc:  Step 3 of user registration process.
 */

export interface OneLastStepPageProps {
	updateActiveStep: (step: number, updatedDetails?: any) => void,
	currentActiveStep: number
	onboardingUserDetails: IOnboardingUserDetails;
}
const validationSchema = yup.object().shape({
	interest: yup.array().min(1, 'Interest field must have at least 1 items').required('Interest is required').nullable(),
	country: yup.array().min(1, 'Country field must have at least 1 items').required('Country is Required').nullable()
});
const OneLastStepPage = ({ updateActiveStep, currentActiveStep, onboardingUserDetails }: OneLastStepPageProps) => {
	const imageBaseUrl = process.env.REACT_APP_MINDLER_PRODUCT_IMAGES_URL;
	const navigate = useNavigate();
	const [interests, setInterests] = useState<any>();

	useEffect(() => {
		_fetchData();
	}, [])

	const _fetchData = async () => {
		let interestsRes = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.GET_INTERESTS, true, true, { key: getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_KEY) }).GET();
		setInterests(interestsRes.data);
	}


	const { register, watch, setValue, getValues, handleSubmit, formState: { errors }, setError, reset } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			interest: [],
			country: []
		}
	});

	const onChangeInterest = (interestId: string) => {
		let selectedInterests: any = getValues('interest');
		const interestIndex: number = selectedInterests?.findIndex((interest: any) => interest === interestId);
		if (interestIndex > -1) {
			selectedInterests?.splice(interestIndex, 1);
			setValue('interest', selectedInterests);
		} else {
			selectedInterests?.push(interestId);
			setValue('interest', selectedInterests);
		}
	}

	const onChangeCountry = (countryId: string) => {
		let selectedCountries: any = getValues('country');
		const countryIndex: number = selectedCountries?.findIndex((country: any) => country === countryId);
		if (countryIndex > -1) {
			selectedCountries?.splice(countryIndex, 1);
			setValue('country', selectedCountries);
		} else {
			selectedCountries?.push(countryId);
			setValue('country', selectedCountries);
		}
	}


	/**
	 * @param data: form data
	 * function to submit tell us more form
	 */
	const onSubmit = async (data: any) => {
		data.step = 3;

		const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.POST_REGISTER, false, true, { key: getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_KEY) }).POST(data)
			.catch((err: any) => {
				let errorMessage = err.response.data.errors[0]?.message;
				setError('country', { type: 'custom', message: errorMessage })
				// setError('country', { type: 'custom', message: ('No Country has Chosen') })
			})
		if (response.success) {
			//clear temp data when onboarding done
			removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_KEY);
			removeDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_DATA);
			setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY, response.data?.session);
			setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.USER_DETAILS, JSON.stringify(response.data));
			// dispatch(setUserData({ isLoggedIn: true, user: { ...response.data } }));
			updateActiveStep(3);


			navigate("/assessment")


		}
	};

	return (
		<>


			<div className='onboarding-interest-page tw-flex tw-justify-items-center tw-flex-wrap md:tw-flex-nowrap md:tw-gap-8'>
				<div className='tw-flex tw-justify-between md:tw-hidden tw-items-center tw-w-full tw-p-3'>
					<div className='tw-flex tw-gap-4'>
						{
							onboardingUserDetails?.student_type_id === 1 &&
							<>
								<div onClick={() => { updateActiveStep(currentActiveStep - 2) }}><ArrowBackIosNewIcon /></div>
								<div className='breadcrumb-header tw-text-lg tw-font-medium tw-ml-2'>Interest</div>
							</>
						}
					</div>
					<div className='tw-font-medium tw-text-sm primary-text-1'>3/3</div>
				</div>

				<MobileTabs index={currentActiveStep} />

				<LeftBanner />

				<div className='right-section tw-my-4 tw-w-full md:tw-w-1/2 tw-p-4'>
					<form onSubmit={handleSubmit(onSubmit)} className='form-container' >
						<div className='md:tw-flex tw-justify-end tw-w-full tw-hidden'>
							<img src={`${imageBaseUrl}/onboarding/mindlerIcon.svg`} alt="mindlerIcon" className='tw-w-40' />
						</div>
						<div>
							<div>
								<div className='primary-text-1 tw-font-medium tw-text-sm'>Hi {onboardingUserDetails.name ? onboardingUserDetails.name : onboardingUserDetails?.first_name + ' ' + onboardingUserDetails.last_name}</div>
								<div className='primary-text-1 fs32 tw-font-bold'>Just one last step</div>
							</div>
							<div className='enqiry tw-mb-2 tw-font-bold'>Tell us what your are interested in <br /> (Check the boxes that you prefer)</div>
							<div className='interest tw-mb-2 tw-flex tw-flex-wrap tw-gap-2 '>

								{
									interests?.interestList?.map((interest: any) => {
										return <div key={interest.id} className='radio-btn-onboarding'>
											{/* <CheckIcon className='last-one-tick' /> */}
											<input onChange={() => { onChangeInterest(interest?.id) }} id={interest.name} type="checkbox" />

											<label htmlFor={interest.name} className='interest-name tw-text-sm'>
												{interest?.name}
											</label>
										</div>
									})
								}

							</div>
							<p className='validation-msg tw-mb-6'>{errors?.interest?.message}</p>
							<div className='enqiry tw-mb-2 tw-font-bold'>Which are the countries are you interested in?</div>
							<div className='interest tw-mb-2 tw-flex tw-flex-wrap tw-gap-2 '>
								{
									interests?.countryList?.map((country: any) => {
										return <div key={country.id} className='radio-btn-onboarding'>
											{/* <CheckIcon className='last-one-tick' /> */}

											<input onChange={() => { onChangeCountry(country?.id) }} id={country?.name} type="checkbox" />
											<label htmlFor={country?.name} className='interest-name tw-text-sm'>
												{country?.name}
											</label>
										</div>
									})
								}
							</div>
							<p className='validation-msg tw-mb-6'>{errors?.country?.message}</p>
							<button type="submit" className='btn btn--blue tw-w-full tw-my-2 tw-font-bold'>Take me to Dashboard</button>
							{
								onboardingUserDetails?.student_type_id === 1 && //show for b2c only
								<div className='tw-flex tw-justify-center tw-items-center tw-cursor-pointer'>
									<div onClick={() => { updateActiveStep(currentActiveStep - 2) }} className='tw-flex tw-justify-center tw-items-center'>
										<div><ArrowBackIcon /></div>
										<div>Back</div>
									</div>
								</div>
							}
						</div>

					</form>
				</div>

			</div>

		</>
	)
}

export default OneLastStepPage