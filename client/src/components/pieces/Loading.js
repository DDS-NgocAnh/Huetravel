import React, { Component } from 'react'

export default class Loading extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        <div className='loading'>
            <div className="loading__ripple"><div></div><div></div></div>
        </div>
        )
    }
}