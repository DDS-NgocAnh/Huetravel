import ReactLoading from "react-loading";
import React, { Component } from 'react'

export default class BubbleLoading extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ReactLoading type={'bubbles'} color="#f1f525" />
        )
    }
}