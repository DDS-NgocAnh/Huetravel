import React, { Component } from 'react'
import axios from 'axios'

import CFileUpload from '../../pieces/FileUpload'
import imageDefault from '../../../assets/img/image-default.png'


export default class PhotoUpload extends Component {
    constructor(props){
        super(props)
        this.state = {
        //   avatar: imageDefault,
        }
        // this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
      }

    // fileSelectedHandler(event) {
    // this.setState({
    //     avatar: URL.createObjectURL(event.target.files[0]),
    // })
    // }

    render() {

        return (
            <CFileUpload 
                // onChange={this.fileSelectedHandler} 
                defaultImg = {imageDefault}
                disabled = {this.props.disabled}
            />
        )
    }
}