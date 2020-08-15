import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import locationIcon from '../../../assets/icons/location.png'
import flowerIcon from '../../../assets/icons/flower.png'
import rockIcon from '../../../assets/icons/rock.png'
import Bookmark from '../../../assets/icons/bookmark.svg'

import demo from '../../../assets/img/writer-demo.jpg'

export default class PostHeader extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='post-header'>
                <div className='post-header__bookmark'>
                    <Bookmark className='bookmark--unnoted'/>
                </div>
                <h1 className='post-header__title'>Kinh thành Huế </h1>
                <div className='post-header__address'>
                    <img src={locationIcon} alt='Location' className='address__icon'></img>
                    <span className='address__info'>
                        Khải Định, Thủy Bằng, Hương Thủy, Thừa Thiên Huế
                    </span> 
                </div>
                <div className='post-header__info'>
                    <Link to='/:userId' className='post-header__info-writer'>
                        <img src={demo} alt='Writer' className='info-writer__photo'></img>
                        <div>
                            <span className='info-writer__name'>Writer</span>
                            <span className='info-writer__published-date'>Dec 12, 2019</span>
                        </div>
                    </Link>
                    <div className='assets__content'>
                        <div className='assets__box'>
                            <img src={flowerIcon} alt='flower' className='assets__box-icon'></img>
                            <span className='assets__box-name'>30k flowers</span>
                        </div>
                        <div className='assets__box'>
                            <img src={rockIcon} alt='rock' className='assets__box-icon'></img>
                            <span className='assets__box-name'>3k rocks</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}