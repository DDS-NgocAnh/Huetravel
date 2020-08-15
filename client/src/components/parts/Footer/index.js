import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import facebookIcon from '../../../assets/icons/facebook.png'
import instagramIcon from '../../../assets/icons/instagram.png'
import youtubeIcon from '../../../assets/icons/youtube.png'

import demo1 from '../../../assets/img/top-dest-demo-1.jpg'
import demo2 from '../../../assets/img/top-dest-demo-2.jpg'
import demo3 from '../../../assets/img/top-dest-demo-3.jpg'

export default class Footer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            facebookLink: 'https://www.facebook.com/TheHueOfHue.Official/',
            youtubeLink: 'https://www.youtube.com/watch?v=3vQk9LihHXc',
            instagramLink: 'https://www.instagram.com/thehueofhue.official/'
        }
    }

    render() {
        let {
            facebookLink,
            instagramLink,
            youtubeLink
        } = this.state
        return (
            <div className='footer'>
                <div className='footer__contact'>
                    <a href={facebookLink} target='_blank' className="footer__contact-logo">
                        <img src={facebookIcon} alt='Facebook' className='footer__contact-logo--1'></img>
                    </a>
                    <a href={instagramLink} target='_blank' className="footer__contact-logo">
                        <img src={instagramIcon} alt='Instagram' className='footer__contact-logo--2'></img>
                    </a>
                    <a href={youtubeLink} target='_blank' className="footer__contact-logo">
                        <img src={youtubeIcon} alt='Youtube' className='footer__contact-logo--3'></img>
                    </a>
                </div>
                <div className='footer__vertical-line'></div>
                <div className='footer__top-dest-list'>
                    <h4 className='top-dest-list__title'>top 03 favorite destinations</h4>
                    <div className="top-dest-list__content">
                        <div className='col-1-of-3 top-dest-box'>
                            <img src={demo1} alt='top-1' className='top-dest-box__photo'></img>
                            <div className='top-dest-box__info'>
                                <span className='info info--ranking'>01</span>
                                <span className='info info--title'>Đại nội Huế</span>
                                <Link to='/destinations/:id' className='info info--btn btn-arr btn-arr--right'>
                                    Know more &#10140;
                                </Link>
                            </div>
                        </div>
                        <div className='col-1-of-3 top-dest-box'>
                            <img src={demo2} alt='top-2' className='top-dest-box__photo'></img>
                            <div className='top-dest-box__info'>
                                <span className='info info--ranking'>02</span>
                                <span className='info info--title'>Lăng Tự Đức</span>
                                <Link to='/destinations/:id' className='info info--btn btn-arr btn-arr--right'>
                                    Know more &#10140;
                                </Link>
                            </div>
                        </div>
                        <div className='col-1-of-3 top-dest-box'>
                            <img src={demo3} alt='top-3' className='top-dest-box__photo'></img>
                            <div className='top-dest-box__info'>
                                <span className='info info--ranking'>03</span>
                                <span className='info info--title'>Làng Hương Thủy Xuân</span>
                                <Link to='/destinations/:id' className='info info--btn btn-arr btn-arr--right'>
                                    Know more &#10140;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

