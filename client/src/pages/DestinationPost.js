import React, { Component } from 'react'

import CDestPostGroup from '../components/parts/DestPostGroup'

export default class DestinationPost extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <section className='section-destination-post u-margin-horizontal-5'>
                <CDestPostGroup/>
            </section>
        )
    }
}