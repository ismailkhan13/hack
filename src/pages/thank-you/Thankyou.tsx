import React from 'react'
import { Link } from 'react-router-dom'
import "./Thankyou.scss"
const Thankyou = () => {
    return (

        <div className="activities-completed-container">
            <div className='tw-flex  r'>
                <Link className='arrow tw-hidden md:tw-block tw-cursor-pointer tw-self-start tw-p-2' to={`/`}>
                    {/* <ArrowBackIcon /> */}
                </Link>
            </div>
            <div className="completed-activities">
                <img
                    className="completed-img"
                    src={`https://mindler-products-images.imgix.net/confluence/my-activities/completed.svg`}
                    alt="completedimg"
                />
                <h1 className="completed-h1 tw-text-center">
                    Thank you for completing your Survey
                </h1>

                {/* <Link to={'/'} className="btn btn--blue bt-xl book-session">
                    Home
                </Link> */}
            </div>
        </div>
    )
}

export default Thankyou