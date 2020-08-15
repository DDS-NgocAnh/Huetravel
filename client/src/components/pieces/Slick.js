import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// import Slider from 'react-slick'
import CDestBox from './DestBox'

// function SamplePrevArrow() {
//     return (
//       <div className='btn-slider btn-slider--left'><span>&#10140;</span></div>
//     );
// }

// function SampleNextArrow() {
//     return (
//       <div className='btn-slider btn-slider--right'><span>&#10140;</span></div>
//     );
// }

export default class Slick extends Component {
    constructor(props = { tittle }) {
        super(props)

        this.savePath = this.savePath.bind(this)
    }

    savePath(path) {
        localStorage.setItem('previousPath', path)
    }

    render() {
        // const settings = {
        //     dot: true,
        //     infinite: true,
        //     speed: 500,
        //     slidesToShow: 5,
        //     slidesToScroll: 3,
        //     arrow: true,
        //     lazyLoad: true,
        //     // nextArrow: <SampleNextArrow />,
        //     // prevArrow: <SamplePrevArrow />,
        //     className: 'slick__slider'
        // }
        let title = this.props.title

        return (
            <div className='slick'>
                <div className='slick__title'>
                    <h5 className='heading-tertiary'>{title}</h5>
                    <Link onClick={this.savePath(`/:userId`)} to={`/:userId/` + title} className='btn-arr btn-arr--right'>See all &rarr;</Link>
                </div>
                <div className='slick__content'>
                    <CDestBox/>
                    <CDestBox/>
                    <CDestBox/>
                    <CDestBox/>
                    <CDestBox/>
                </div>
            </div>
        )
    }
}