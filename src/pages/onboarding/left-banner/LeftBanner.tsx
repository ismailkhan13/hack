import React from 'react'
import Carousel from 'better-react-carousel'
import "./LeftBanner.scss"
import Image1 from "./../../../assets/images/landing_1.jpeg"
import Image2 from "./../../../assets/images/landing_2.jpeg"
import Image3 from "./../../../assets/images/landing_3.jpeg"
import Image4 from "./../../../assets/images/landing_4.jpeg"





const imageBaseUrl = "https://mindler-products-images.imgix.net/confluence";

const LeftBanner = () => {
    return (
        <div className='left-section tw-ml-4 tw-mt-4 md:tw-w-1/2 tw-hidden md:tw-flex tw-flex-col tw-items-center md:tw-p-4'>
            <Carousel cols={1} rows={1} loop={true} showDots={true} dotColorActive="#1480B7" autoplay={5000}>
                <Carousel.Item>
                    <div className='logo-container'>
                        <img src={`${Image1}`} alt='' className='logo' />
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className='logo-container'>
                        <img src={`${Image2}`} alt='' className='logo' />
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className='logo-container'>
                        <img src={`${Image3}`} alt='' className='logo' />
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className='logo-container'>
                        <img src={`${Image4}`} alt='' className='logo' />
                    </div>
                </Carousel.Item>
            </Carousel>

        </div>
    )
}

export default LeftBanner