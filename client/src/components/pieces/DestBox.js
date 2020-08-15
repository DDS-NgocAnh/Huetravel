import React, { Component } from 'react'
import { Link } from 'react-router-dom'


import flowerIcon from '../../assets/icons/flower.png'
import rockIcon from '../../assets/icons/rock.png'
import locationIcon from '../../assets/icons/location.png'

import Bookmark from '../../assets/icons/bookmark.svg'

import demo from '../../assets/img/dest-demo.jpg'

export default class DestBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='dest-box'>
                <div className='dest-box__bookmark'>
                    <Bookmark className='bookmark-icon'/>
                </div>
                <div className='dest-box__react'>
                    <div className='react-box'>
                        <img src={flowerIcon} className='react-box__icon' alt='Flower'></img>
                        <span className='react-box__info'>999+</span>
                    </div>
                    <div className='react-box'>
                        <img src={rockIcon} className='react-box__icon' alt='Rock'></img>
                        <span className='react-box__info'>999+</span>
                    </div>
                </div>
                <img src={demo} className='dest-box__photo' alt='Destination photo'></img>
                <div className='dest-box__info'>
                    <h4 className='dest-box-info__heading'>Kinh thành Huế</h4>
                    <div className='dest-box-info__address'>
                        <img src={locationIcon} className='dest-box-info__address-icon' alt='Location'></img>
                        <span className='dest-box-info__address-info'>Hương Hòa, Thành phố Huế</span>
                    </div>
                    <Link to='/destinations/:id' className='dest-box-info__btn'>
                        <div className='btn-arr btn-arr--right'>Know more <span className='btn-arr--yellow'>&rarr;</span> </div>
                    </Link>
                </div>
            </div>
        )
    }
}