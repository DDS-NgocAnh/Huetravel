import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class BorderBtn extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Link to="/destinations" className="btn-border">Start now</Link>
        )
    }
}

