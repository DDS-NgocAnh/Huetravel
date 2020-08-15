import React, { Component } from 'react'

export default class FileUpload extends Component {
    constructor(props = {defaultImg}){
        super(props)
      }

    render() {
        let { defaultImg } = this.props
        return (
            <div className='photo-upload'>
                <input className='photo-upload__btn'
                disabled = {this.props.disabled}
                type='file'
                onChange={this.fileSelectedHandler} 
                required/>
                <img src={defaultImg} className='photo-upload__photo' alt='Photo'></img> 
            </div>
        )
    }
}