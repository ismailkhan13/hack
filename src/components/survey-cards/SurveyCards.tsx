import React from 'react'
import "./SurveyCards.scss"
import { Link } from 'react-router-dom';
import thumbnail from "../../assets/images/thumbnail.jpeg"
const SurveyCards = (props: any) => {
    return (
        <div className='survey-card'>
            <div>
                <div>
                    <p className='survey-heading'>{props.title}</p>
                    <p className='survey-content tw-font-light'>{props.description}</p>
                </div>
                <div className='thumbnail-container'>
                    <img src={'/thumbnail.jpeg'}/> 
                </div>
            </div>


            <Link to={`/survey/${props.set}`} className='btn btn--blue tw-bottom-4 tw-left-4'>Take Survey</Link>
        </div>
    )
}

export default SurveyCards