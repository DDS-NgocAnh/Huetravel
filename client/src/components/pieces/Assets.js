import React, { Component } from 'react'

import flowerIcon from '../../assets/icons/flower.png'
import rockIcon from '../../assets/icons/rock.png'

export default class Assets extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='assets'>
                <h4 className='assets__title heading-tertiary'>ASSETS</h4>
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
        )
    }
}
