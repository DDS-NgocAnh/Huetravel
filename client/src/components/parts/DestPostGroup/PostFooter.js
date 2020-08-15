import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import flowerIcon from '../../../assets/icons/flower.png'
import rockIcon from '../../../assets/icons/rock.png'

import demo from '../../../assets/img/writer-demo.jpg'


export default class PostFooter extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='post-footer'>
                <div className='post-footer__reaction'>
                    <h4 className='post-footer__title'>Reactions</h4>
                    <div className='post-footer__reaction-content'>
                        <div className='post-footer__reaction-box'>
                            <img src={flowerIcon} alt='flower' className='reaction-box__icon'/>
                            <span className='reaction-box__title'>Give a flower</span>
                        </div>
                        <div className='post-footer__reaction-box'>
                            <img src={rockIcon} alt='rock' className='reaction-box__icon'/>
                            <span className='reaction-box__title'>Throw a rock</span>
                        </div>
                    </div>
                </div>
                <div className='post-footer__spacer'></div>
                <div className='post-footer__writer'>
                    <h4 className='post-footer__title'>Written by</h4>
                    <Link to='/:userId' className='post-footer__writer-info'>
                        <img src={demo} alt='Writer' className='post-footer__writer-photo'></img>
                        <span className='post-footer__writer-name'>Writer's name</span>
                    </Link>
                </div>
            </div>
        )
    }
}