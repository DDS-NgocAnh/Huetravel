import React, { Component } from 'react'

export default class HeadingPrimary extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <h1 className='heading-primary u-center-text u-margin-bottom-big'>
                <span className="heading-primary--sub">Explore</span>
                <span className="heading-primary--main">Hue</span>
            </h1>
        )
    }
}

