import React from 'react'
import "./SurveyCards.scss"
const SurveyCards = () => {
    return (
        <div className='survey-card'>
            <p className='survey-heading'>Heading</p>
            <p className='survey-content'>Explore the world of careers with detailed information on each career domain</p>
            <button className='btn btn--blue tw-absolute tw-bottom-4 tw-left-4'>Know More</button>
        </div>
    )
}

export default SurveyCards