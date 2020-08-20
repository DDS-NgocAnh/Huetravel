import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import facebookIcon from '../../../assets/icons/facebook.png'
import instagramIcon from '../../../assets/icons/instagram.png'
import youtubeIcon from '../../../assets/icons/youtube.png'

export default class Footer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            facebookLink: 'https://www.facebook.com/TheHueOfHue.Official/',
            youtubeLink: 'https://www.youtube.com/watch?v=3vQk9LihHXc',
            instagramLink: 'https://www.instagram.com/thehueofhue.official/',
            posts: '',
        }
    }

    componentDidMount() {
        axios.request({
            url: 'http://localhost:9000/api/post/all/top-3-posts',
            method: 'GET'
        }).then( res => {
            if(res.data.length > 0) {
                this.setState({
                    posts: res.data
                })
            }
        }
        )
    }

    render() {
        let {
            facebookLink,
            instagramLink,
            youtubeLink,
            posts
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
                {posts && (
                <>    
                    {posts.map((post, index) => {
                        let link = '/destinations/' + post._id
                        let ranking = '0' + (index+1)
                        let avatar = post.avatar

                        return (
                            <div key={index} className='col-1-of-3 top-dest-box'>
                                <img src={avatar} alt={'top-'+index+1} className='top-dest-box__photo'></img>
                                <div className='top-dest-box__info'>
                                    <span className='info info--ranking'>{ranking}</span>
                                    <span className='info info--title'>{post.name}</span>
                                    <Link to={link} className='info info--btn btn-arr btn-arr--right'>
                                        Know more &#10140;
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </>    
                )}
                </div>
            </div>
            </div>
        )
    }
}

