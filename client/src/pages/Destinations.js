import React, { Component } from 'react'
import CDestListGroup from '../components/parts/DestListGroup'

export default class Destinations extends Component {
    constructor(props = {title}) {
        super(props)
    }

    render() {
        return (
            <section className='section-destinations'>
                <CDestListGroup title = {this.props.title}/>
            </section>
        )
    }
}
