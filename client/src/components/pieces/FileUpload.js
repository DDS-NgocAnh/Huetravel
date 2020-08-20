import React, { Component } from 'react'
import axios from 'axios'


export default class FileUpload extends Component {
    constructor(props = {defaultImg}){
        super(props)
        this.state = {
            filePath: '',
            fileName: ''
        }
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        let oldProps = this.props
        if(nextProps.reset && nextProps.reset != oldProps.reset) {
            this.setState({filePath: ''})
        }
    }  

    fileSelectedHandler(event) {
        const formData = new FormData()
        formData.append('file', event.target.files[0])

        axios.post(
            'http://localhost:9000/api/upload/photo',
            formData,
            {headers: {
                'Content-Type': 'multipart/form-data'
            }}
        ).then(res => {
            const { filePath } = res.data
            this.setState({filePath: filePath})
            if(this.props.onChange) {
                this.props.onChange(filePath)
            }
        }).catch(err => {
            if(err) {
                console.log(err.message);
            } else {
                console.log(err.response.data.message);
            }
        })
        
    }

    render() {
        let defaultImg = this.state.filePath ? this.state.filePath : this.props.defaultImg
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