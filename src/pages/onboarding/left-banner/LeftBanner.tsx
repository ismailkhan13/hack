import React from 'react'
import Carousel from 'better-react-carousel'
import "./LeftBanner.scss"
const imageBaseUrl = "https://mindler-products-images.imgix.net/confluence";


const LeftBanner = () => {
    return (
        <div className='left-section tw-ml-4 tw-mt-4 md:tw-w-1/2 tw-hidden md:tw-flex tw-flex-col tw-items-center md:tw-p-16'>
            <Carousel cols={1} rows={1} loop={true} showDots={true} dotColorActive="#1480B7" autoplay={5000}>
                <Carousel.Item>
                    <div className=''>
                        <img src={`${imageBaseUrl}/onboarding/youngBoy.png`} alt='' className='' />
                    </div>
                    <div className='section-heading tw-mt-4 tw-text-center'>
                        Enable students to identify their best-fit career with our world-class career assessment and personalised guidance.
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={`${imageBaseUrl}/onboarding/girlOne.png`} alt='' className='' />
                    </div>
                    <div className='section-heading tw-mt-4 tw-text-center'>
                        Empower students to learn all about the professional world with virtual career simulations, exhaustive career library, career blogs and vlogs.
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={`${imageBaseUrl}/onboarding/girlTwo.png`} alt='' className='' />
                    </div>
                    <div className='section-heading tw-mt-4 tw-text-center'>
                        Pave student’s way to their dream college with our end-to-end college application guidance, scholarship drive and corporate internship program.
                    </div>
                </Carousel.Item>
                {/* <Carousel.Item>
                    <div>
                        <img src={`${imageBaseUrl}/onboarding/youngKids.png`} alt='' className='' />
                    </div>
                    <div className='section-heading tw-mt-4 tw-text-center'>
                        Enable schools in creating a career guidance ecosystem in sync with the vision of New Education Policy
                    </div>
                </Carousel.Item> */}
            </Carousel>

        </div>
    )
}

export default LeftBanner