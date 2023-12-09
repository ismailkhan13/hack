import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import TestSection from '../../components/assessment/test-section/TestSection';
import OnboardingPage from '../onboarding/OnboardingPage';

const Assessment = () => {

	const [modalVis, setModalVis] = useState(false);

	const onFinishHandler = () => {
		console.log("Finished Test")		
	}

	const setModalVisibility = (x: boolean) => {
		setModalVis(x);
	}

	return (
		<div className='routes-container'>
			<Routes>
				<Route path={'/'} element={
					<React.Suspense fallback={<div>Loading...</div>}>
						<TestSection onFinishHandler={onFinishHandler} setModalVisibility={setModalVisibility} />
					</React.Suspense> 
				} >
				</Route>
			</Routes>
		</div>
	)
}

export default Assessment