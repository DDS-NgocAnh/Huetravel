import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'

import { toastNoti } from '../../utils' 

import { changeAvatar } from '../../store/actions/authAction'

const mapDispatchToProps = dispatch => {
    return {
        onChangeAvatar: (avatar) => dispatch(changeAvatar(avatar))
    }
}

export default connect(null,mapDispatchToProps)
(withRouter(class FileUpload extends Component {
    constructor(props = {defaultImg}){
        super(props)
        this.state = {
            filePath: '',
            fileName: ''
        }
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
        this.toastNoti = toastNoti.bind(this)
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        let oldProps = this.props
        if(nextProps.reset && nextProps.reset != oldProps.reset) {
            this.setState({filePath: ''})
        }
        this.toastNoti(nextState)
    }  

    fileSelectedHandler(event) {
        const formData = new FormData()
        formData.append('file', event.target.files[0])

        let isUserProfile = this.props.history.location.pathname == '/review' ?
        false : true

        axios.post(
            '/api/upload/photo',
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
            if(isUserProfile) {
                let avatar = filePath
                let data = {
                    avatar
                }
                axios.post(
                    '/api/user/change-avatar',
                    data
                ).then(res => {
                    this.props.onChangeAvatar(filePath)
                    this.props.socket.emit('changeAvatar', this.props.userId)
                    this.setState({ successMessage: res.data.message})
                }
                ).catch(err => {
                    console.log(err.message || err.response.data.message);
                    this.setState({errorMessage: err.message || err.response.data.message})
                })
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
}))