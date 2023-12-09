import React from 'react'
import "./Survey.scss"
import SurveyCards from '../../components/survey-cards/SurveyCards'
const Survey = () => {

    return (
        <div className='survey-container'>
            <p className='section-heading tw-m-4'>Survey Heading</p>
            <div className='card-container tw-grid  tw-gap-4'>
                {[1, 2, 3, 4, 5, 6].map(() => {
                    return (
                        <SurveyCards />
                    )
                })}
            </div>

        </div>
    )
}

export default Survey