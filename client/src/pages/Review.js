import React, { Component } from 'react'

import CReviewGroup from '../components/parts/ReviewGroup'

export default class Review extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <section className='section-review'>
                <CReviewGroup />
            </section>
        )
    }
}
