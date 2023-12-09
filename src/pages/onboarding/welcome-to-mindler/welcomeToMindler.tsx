import React from 'react'
import "./welcome-to-mindler.scss";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import LeftBanner from '../left-banner/LeftBanner';
import { Link } from 'react-router-dom';
import { IOnboardingUserDetails } from '../../../types/onboarding-interfaces';

const imageBaseUrl = "https://mindler-products-images.imgix.net/confluence";

const WelcomeToMindlerPage = (props: { onboardingUserDetails: IOnboardingUserDetails }) => {

	return (
		<>
			<div className='onboarding-welcome-page tw-flex tw-justify-items-center tw-flex-wrap md:tw-flex-nowrap md:tw-gap-8'>
				<LeftBanner />
				<div className='right-section tw-my-4 tw-w-full md:tw-w-1/2 tw-p-4'>
					<div className='md:tw-flex tw-hidden tw-justify-end tw-w-full'>
						<img src={`${imageBaseUrl}/onboarding/mindlerIcon.svg`} alt="mindlerIcon" className='tw-w-40' />
					</div>
					<div className='tw-flex md:tw-hidden tw-w-full'>
						<img src={`${imageBaseUrl}/onboarding/mindlerIcon.svg`} alt="mindlerIcon" className='tw-w-40' />
					</div>
					<div className='form-container'>
						<div className='welcome tw-mt-12 tw-mb-8'>
							<img src={`${imageBaseUrl}/onboarding/greet.svg`} alt="welcomeIcon" className='welcomeIcon' />
						</div>
						<div className='name md:tw-font-bold tw-font-semibold tw-mb-6'>Hello {props.onboardingUserDetails.first_name ? props.onboardingUserDetails?.first_name : props.onboardingUserDetails.name?.split(" ")[0]},</div>
						<div className='greet tw-mb-4'>Welcome to Mindler Learning Platform</div>
						<div className='description tw-mb-12'>
							All the milestone would help you attain various objectives to make inform career decisions. Please complete all the activities to get the maximum benefit.<br /><br />

							You can click on “Dashboard” anytime you want to track your over all progress. Keep an eye on " Next Activity " to know your next step. Our intelligent guidance system would keep guiding you throughout your Journey.

						</div>
						<Link to={`/dashboard`} className="btn btn--blue tw-text-sm tw-flex tw-justify-center tw-items-center tw-font-bold">Take me to Dashboard</Link>
					</div>

				</div>
			</div>
		</>
	)
}

export default WelcomeToMindlerPage