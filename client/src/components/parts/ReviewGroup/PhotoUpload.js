import React, { Component } from 'react'

import CFileUpload from '../../pieces/FileUpload'
import imageDefault from '../../../assets/img/image-default.png'


export default class PhotoUpload extends Component {
    constructor(props){
        super(props)
        this.inputHandler = this.inputHandler.bind(this)
      }

    inputHandler(data) {
        if(this.props.onChange) {
            this.props.onChange(data)
        }
    }

    render() {
        let avatar  = imageDefault
        if(!this.props.reset) {
            avatar = this.props.avatar || imageDefault
        }
        return (
            <CFileUpload 
                reset = {this.props.reset}
                defaultImg = {avatar}
                disabled = {this.props.disabled}
                onChange={this.inputHandler}
            />
        )
    }
}