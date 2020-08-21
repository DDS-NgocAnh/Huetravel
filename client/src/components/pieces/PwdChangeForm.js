import React, { Component } from 'react'

import {
    checkMatchPwd,
    validatePwd, 
    toastNoti } from '../../utils' 

import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

export default class PwdChangeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isVisibled: false,
            btnDisabled: '',
            btnChange: 'Change',
            isDisabled: false,
            placeholder: '',
            inputStyle: 'input u-margin-bottom-tiny ',
        }

        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.inputHandler = this.inputHandler.bind(this)
        this.toastNoti = toastNoti.bind(this)
        this.validatePwd = validatePwd.bind(this)
        this.checkMatchPwd = checkMatchPwd.bind(this)
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        this.toastNoti(nextState)
    }

    inputHandler(event) {
        event.preventDefault()
        let { name, value } = event.target

        this.setState({
            [name]: value
        })
    }

    changeHandler() {
        let btnChange = this.state.btnChange == 'Change' ?
        'Later' : 'Change'
        this.setState({
            isVisibled: !this.state.isVisibled,
            btnChange: btnChange,
            placeholder: '',
            inputStyle: 'input u-margin-bottom-tiny '
        })
    }

    submitHandler(event) {
        event.preventDefault()
        let { currentPassword, checkNewPassword, newPassword } = this.state
        let errorStyle = 'input u-margin-bottom-tiny input--error'

        let check1 = this.validatePwd(currentPassword, 'currentPwd', errorStyle)
        let check2 = this.validatePwd(checkNewPassword, 'checkNewPassword', errorStyle)
        let check3 = this.validatePwd(newPassword, 'newPwd', errorStyle)
        let check4 = false

        if(check2 && check3) {
            check4 = this.checkMatchPwd(newPassword, 'newPwd', 
            checkNewPassword, 'checkNewPassword', errorStyle)
        }

        if (check1 && check2 && check3 && check4) {
            this.setState({
                btnDisabled: 'disabled',
                isDisabled: !this.state.isDisabled,
            })

            let newPassword = {
                currentPassword: this.state.currentPassword,
                newPassword: this.state.newPassword
            }

            axios.post(
                'http://localhost:9000/api/user/change-password',
                newPassword
            ).then(res => {
                this.setState({
                    successMessage: res.data.message,
                    btnDisabled: '',
                    isDisabled: false,
                    isVisibled: false,
                    btnChange: 'Change',
                    inputStyle: 'input u-margin-bottom-tiny '
                })
            }).catch(err => {
                this.setState({
                    errorMessage: err.response.data.message,
                    btnDisabled: '',
                    isDisabled: false,
                    inputStyle: 'input u-margin-bottom-tiny input--error'
                })
            })
        }
    }


    render() {
        let { isVisibled, btnDisabled, 
            btnChange, isDisabled,
            placeholder, inputStyle } = this.state 
        let disabled = isDisabled ? 'disabled' : '' 

        return (
        <div className='pwd-change-form'>   
            <form>
                <h4 className='form__title heading-tertiary'>Change password</h4>
                <div className='form__content' >
                    {isVisibled && (
                    <>    
                        <input
                        ref={(ref) => this.currentPwd= ref}
                        type='password' 
                        name='currentPassword' 
                        className={inputStyle}
                        onChange={this.inputHandler}
                        disabled={disabled}
                        placeholder={placeholder || 'Currrent password'}/>

                        <input
                        ref={(ref) => this.newPwd= ref}
                        type='password' 
                        name='newPassword' 
                        className={inputStyle}
                        placeholder={placeholder || 'New password'}
                        disabled={disabled}
                        onChange={this.inputHandler}/>

                        <input
                        ref={(ref) => this.checkNewPassword= ref}
                        type='password' 
                        name='checkNewPassword' 
                        className={inputStyle}
                        placeholder={placeholder || 'New password confirmation'}
                        disabled={disabled}
                        onChange={this.inputHandler}/>
                    </> 
                    )}
                </div>
            </form>
            <button
            className='btn-page-control u-margin-right-tiny u-margin-top-small'
            onClick={this.changeHandler}
            disabled={btnDisabled}
            >{btnChange}</button>
            {isVisibled && (
                <button
                type='submit'
                className='btn-page-control u-margin-top-small'
                onClick={this.submitHandler}
                disabled={btnDisabled}
                >Change</button>
            )}
        </div>
        )
    }
}