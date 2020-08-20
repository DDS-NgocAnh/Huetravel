import React, { Component } from 'react'

import flowerIcon from '../../assets/icons/flower.png'
import rockIcon from '../../assets/icons/rock.png'

export default class Assets extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let flowers = this.props.flowers > 1 ?
        `${this.props.flowers} flowers` : `${this.props.flowers} flower`

        let rocks = this.props.rocks > 1 ?
        `${this.props.rocks} rocks` : `${this.props.rocks} rock`

        return (
            <div className='assets'>
                <h4 className='assets__title heading-tertiary'>ASSETS</h4>
                <div className='assets__content'>
                    <div className='assets__box'>
                        <img src={flowerIcon} alt='flower' className='assets__box-icon'></img>
                        <span className='assets__box-name'>{flowers}</span>
                    </div>
                    <div className='assets__box'>
                        <img src={rockIcon} alt='rock' className='assets__box-icon'></img>
                        <span className='assets__box-name'>{rocks}</span>
                    </div>
                </div>
            </div>
        )
    }
}
