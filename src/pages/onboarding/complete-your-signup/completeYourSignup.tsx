import React, { useEffect, useState } from 'react'
import "./completeYourSignup.scss";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { IOnboardingGrade, IOnboardingIdentity, IOnboardingLevel, IOnboardingOptionsRes, IOnboardingUserDetails } from '../../../types/onboarding-interfaces';
import { GLOBAL_API_ROUTES } from '../../../globalApiRoutes';
import { IAPIResponse, httpService, MODULES_API_MAP } from '../../../httpService';
import { LOCAL_STORAGE_DATA_KEYS } from '../../../localstorageDataModel';
import { getDataFromLocalStorage } from '../../../utils/globalUtilities';
import LeftBanner from '../left-banner/LeftBanner';
import MobileTabs from '../mobile-tabs/MobileTabs';

const imageBaseUrl = "https://mindler-products-images.imgix.net/confluence";


interface Props {
	updateActiveStep: (step: number, updatedDetails?: any) => void,
	currentActiveStep: number,
	onboardingUserDetails: IOnboardingUserDetails

}

const validationSchema = yup.object().shape({
	student_identity_id: yup.number().required('Identity is required').nullable().typeError(''),
	student_level_id: yup.number().required('Level is required').nullable().typeError(''),
	grade_id: yup.number().required('Grade is Required').nullable().typeError(''),
});


interface IFormType {
	student_identity_id: number | null | string,
	student_level_id: number | null,
	grade_id: number | null,
}


const CompleteYourSignUpPage = ({ updateActiveStep, currentActiveStep, onboardingUserDetails }: Props) => {

	const [identities, setIdentities] = useState<IOnboardingIdentity[] | []>([]);
	const [studentLevels, setStudentLevels] = useState<IOnboardingLevel[] | []>([]);
	const [studentGrades, setStudentGrades] = useState<IOnboardingGrade[] | []>();
	const [allGrades, setAllGrades] = useState<IOnboardingGrade[] | []>();
	const [isDataPatched, setIsDataPatched] = useState(false);


	const { register, control, getValues, watch, setValue, handleSubmit, formState: { errors }, reset } = useForm<IFormType>({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			student_identity_id: null,
			student_level_id: null,
			grade_id: null,
		}
	});


	//event tracking script


	useEffect(() => {
		getAssets();
	}, [])

	useEffect(() => {
		if (!isDataPatched) {
			patchFormData();
		}
	}, [studentLevels])

	useEffect(() => {
		//patching data for the first time state changes if,old data is present
		if (!isDataPatched && onboardingUserDetails.grade_id) {
			setValue('grade_id', onboardingUserDetails.grade_id);
			setIsDataPatched(true);
		}
	}, [studentGrades])

	const patchFormData = () => {
		if (onboardingUserDetails.student_identity_id && onboardingUserDetails.student_level_id) {
			reset({
				student_identity_id: onboardingUserDetails.student_identity_id,
				student_level_id: onboardingUserDetails.student_level_id
			})
			getGrades(onboardingUserDetails.student_level_id);
		}
	}

	const getAssets = async () => {

		let categoriesRes: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.GET_STUDENT_OPTIONS, true, true, { key: getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_KEY) }).GET();

		if (categoriesRes.success) {
			let responseData: IOnboardingOptionsRes = categoriesRes.data;
			setIdentities(responseData.identities);
			setStudentLevels(responseData.levels);
			setAllGrades(responseData.grades);
		}
	}

	const getGrades = async (level_id: number) => {
		setValue('grade_id', null);
		let gradesRes = allGrades?.filter((g)=> g.level_id===level_id);
		setStudentGrades(gradesRes);
	}

	/**
		 * @param data: form data
		 * function to submit tell us more form
		 */
	const onSubmit = async (data: any) => {
		data.step = 2;

		const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.POST_REGISTER, true, true, { key: getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.TEMPORARY_ONBOARDING_KEY), is_b2b_request: Boolean(onboardingUserDetails?.school_branch_id) ? '1' : 0 }).POST(data);

		if (response.success) {
			updateActiveStep(2, data);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='onboarding-choice-page tw-flex tw-justify-items-center tw-flex-wrap md:tw-flex-nowrap md:tw-gap-8'>
					<div className='tw-flex tw-justify-between md:tw-hidden tw-items-center tw-w-full tw-p-3'>
						<div className='tw-flex tw-gap-4'>
							<div onClick={() => { updateActiveStep(currentActiveStep - 2) }}><ArrowBackIosNewIcon /></div>
							<div className='breadcrumb-header tw-text-lg tw-font-medium tw-ml-2'>Personal Information</div>
						</div>
						<div className='tw-font-medium tw-text-sm primary-text-1'>{currentActiveStep}/3</div>
					</div>

					<MobileTabs index={currentActiveStep} />

					<LeftBanner />
					<div className='right-section tw-w-full md:tw-w-1/2 tw-p-4'>
						<div className='md:tw-flex tw-justify-end tw-w-full tw-hidden'>
							<img className='tw-w-40' src={`${imageBaseUrl}/onboarding/mindlerIcon.svg`} alt="mindlerIcon" />
						</div>
						<div className='form-container'>
							<div>
								<div className='primary-text-1 tw-font-medium tw-text-sm'>Hi {onboardingUserDetails.name ? onboardingUserDetails.name : onboardingUserDetails?.first_name + ' ' + onboardingUserDetails?.last_name}</div>
								<div className='section-heading tw-font-bold tw-mb-8'>Complete Your Signup</div>
							</div>
							<div>
								<div className='tw-font-medium tw-text-sm tw-mb-2 '>I am</div>
								<Controller
									name='student_identity_id'
									control={control}
									render={
										({
											field: { onChange, onBlur, value, name, ref },
											fieldState: { invalid, isTouched, isDirty, error },
										}) => (
											<FormControl className='tw-w-full'>
												<Select name={name} onChange={onChange} onBlur={onBlur} value={value} ref={ref}
													id="demo-simple-select"
													defaultValue=""
													renderValue={(selected) => {
														if (!selected) {
															return <p className='tw-text-gray-400'>Choose Option</p>
														}
														return identities?.filter((designation: { name: string, id: number }) => { return designation.id === selected })[0]?.name
													}}
													displayEmpty

												>
													{

														identities?.map((designation: any, index: number) => {

															return <MenuItem key={`designation${designation?.id}`} value={designation.id} >{designation?.name}</MenuItem>
														})
													}
												</Select>

												<p className='validation-msg'>{errors?.student_identity_id?.message}
												</p>
											</FormControl>
										)
									}
								/>
							</div>
							<div className='tw-mb-4'>
								<div className='tw-font-medium tw-text-sm tw-mt-4 tw-mb-2'>I Need Help With</div>
								<div className='md:tw-flex md:tw-gap-x-6'>
									{/* <div className='tw-w-full'>
								<div className='icons tw-flex md:tw-flex-col md:tw-justify-center md:tw-items-center tw-mb-2 tw-cursor-pointer tw-p-1 tw-gap-4 tw-w-4/5'>
									<div> <img src={`${imageBaseUrl}/onboarding/teacher.svg`} alt="" /></div>
									<div className='tw-font-semibold tw-text-sm tw-mb-4 primary-text-1'>Choose my stream</div>
								</div>
								<p className='fs11 tw-font-medium tw-mb-4'>Ideal for Class 8-9 students</p>
							</div>
							<div className='tw-w-full'>
								<div className='icons tw-flex md:tw-flex-col md:tw-justify-center md:tw-items-center tw-mb-2 tw-cursor-pointer tw-p-1 tw-gap-4 tw-w-4/5'>
									<div> <img src={`${imageBaseUrl}/onboarding/briefcase.svg`} alt="" /></div>
									<div className='tw-font-medium tw-text-sm tw-mb-4 primary-text-1'>Choose my Career</div>
								</div>
								<p className='fs11 tw-font-medium tw-mb-4'>Ideal for Class 10-12 students</p>
							</div>
							<div className='tw-w-full'>
								<div className='icons tw-flex md:tw-flex-col md:tw-justify-center md:tw-items-center tw-mb-2 tw-cursor-pointer tw-p-1 tw-gap-4 tw-w-4/5'>
									<div> <img src={`${imageBaseUrl}/onboarding/programming.svg`} alt="" /></div>
									<div className='tw-font-medium tw-text-sm tw-mb-4 primary-text-1'>Planning my career</div>
								</div>
								<p className='fs11 tw-font-medium tw-mb-4'>Ideal for Graduates</p>
							</div> */}
									{
										studentLevels?.map((level: any) => {
											return <div key={level.id}>
												<div className='selection-btn-onboarding tw-my-2'>
													<Controller
														name='student_level_id'
														control={control}
														render={
															({
																field: { onChange, onBlur, value, name, ref },
																fieldState: { invalid, isTouched, isDirty, error },
															}) => (
																<>
																	<input name={name} value={level.id} checked={value == level.id} type="radio" onBlur={onBlur} onChange={(e) => { onChange(e); getGrades(level.id) }} id={`level-${level.id}`} />
																	<label className='tw-w-full' htmlFor={`level-${level.id}`}>
																		<div className='tw-flex tw-gap-4 md:tw-gap-0 tw-items-center md:tw-flex-col'>
																			<img className={`${value != level.id ? 'grayscale' : ''}`} src={imageBaseUrl + '/onboarding/' + level?.icon} alt="" />
																			<div className={`${value == level.id ? 'tw-font-semibold' : ''} tw-text-sm tw-mt-4 md:mt-0 tw-mb-4 primary-text-1 md:tw-w-24 tw-text-center`}>
																				{level?.name}</div>
																		</div>
																	</label>
																	<p className={`tw-text-xs tw-mt-2 ${value == level.id ? 'tw-text-primary-blue' : ''}`}>{level.description}</p>
																</>
															)
														}
													/>
												</div>
												<div className='tw-text-sm tw-font-medium'>{level?.desc}</div>
											</div>
										})
									}
								</div>

								<p className='validation-msg'>{errors?.student_level_id?.message}
								</p>
							</div>
							{studentGrades &&
								<div className='class tw-flex tw-flex-col'>
									<div className='tw-font-medium tw-text-sm tw-mb-4'>I am in</div>
									<div className='tw-flex tw-mb-4'>
										{
											studentGrades?.map((grade: any) => {
												return <div key={grade.id} className='radio-btn-onboarding tw-mr-2'>
													<Controller
														name='grade_id'
														control={control}
														render={
															({
																field: { onChange, onBlur, value, name, ref },
																fieldState: { invalid, isTouched, isDirty, error },
															}) => (
																<>
																	<input name={name} type="radio" onChange={onChange} onBlur={onBlur} value={grade.id} checked={value == grade.id} />
																	<label className='primary-text-1 tw-font-semibold tw-text-sm' htmlFor="class">
																		{grade?.name}
																	</label>
																</>
															)
														}
													/>

												</div>
											})
										}
									</div>
									<p className='validation-msg'>{errors?.grade_id?.message}
									</p>
								</div>
							}
							<button  type="submit" className='btn btn--blue tw-font-bold tw-w-full tw-my-4'>Continue</button>
							<div className='tw-flex tw-justify-center tw-items-center tw-cursor-pointer'>
								<div onClick={() => { updateActiveStep(currentActiveStep - 2) }} className='tw-flex tw-justify-center tw-items-center'>
									<div><ArrowBackIcon /></div>
									<div>Back</div>
								</div>
							</div>
						</div>


					</div>
				</div>
			</form>
		</>
	)
}
export default CompleteYourSignUpPage