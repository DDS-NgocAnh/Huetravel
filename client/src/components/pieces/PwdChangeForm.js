import React, { Component } from 'react'

import {
    inputHandler,
    checkMatchPwd,
    validatePwd } from '../../utils' 

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

        this.inputHandler = inputHandler.bind(this)
        this.validatePwd = validatePwd.bind(this)
        this.checkMatchPwd = checkMatchPwd.bind(this)
    }

    changeHandler(event) {
        event.preventDefault()
        let btnChange = this.state.btnChange == 'Change' ?
        'Later' : 'Change'
        this.setState({
            isVisibled: !this.state.isVisibled,
            btnChange: btnChange,
            placeholder: '',
        })
    }

    submitHandler(event) {
        event.preventDefault()
        let { currentPwd, checkCurrentPwd, newPwd } = this.state
        let errorStyle = 'input--error'

        let check1 = this.validatePwd(currentPwd, 'currentPwd', errorStyle)
        let check2 = this.validatePwd(checkCurrentPwd, 'checkCurrentPwd', errorStyle)
        let check3 = this.validatePwd(newPwd, 'newPwd', errorStyle)
        let check4 = false

        if(check1 && check2) {
            check4 = this.checkMatchPwd(currentPwd, 'currentPwd', 
            checkCurrentPwd, 'checkCurrentPwd', errorStyle)
        }

        if (check1 && check2 && check3 && check4) {
            this.setState({
                btnDisabled: 'disabled',
                isDisabled: !this.state.isDisabled,
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
                        name='currentPwd' 
                        className={inputStyle}
                        onChange={this.inputHandler}
                        disabled={disabled}
                        placeholder={placeholder || 'Currrent password'}/>

                        <input
                        ref={(ref) => this.checkCurrentPwd= ref}
                        type='password' 
                        name='checkCurrentPwd' 
                        className={inputStyle}
                        placeholder={placeholder || 'Currrent password confirmation'}
                        disabled={disabled}
                        onChange={this.inputHandler}/>

                        <input
                        ref={(ref) => this.newPwd= ref}
                        type='password' 
                        name='newPwd' 
                        className={inputStyle}
                        placeholder={placeholder || 'New password'}
                        disabled={disabled}
                        onChange={this.inputHandler}/>
                    </> 
                    )}
                </div>
            </form>
            <button
            className='btn-page-control u-margin-right-tiny'
            onClick={this.changeHandler}
            disabled={btnDisabled}
            >{btnChange}</button>
            {isVisibled && (
                <button
                type='submit'
                className='btn-page-control'
                onClick={this.submitHandler}
                disabled={btnDisabled}
                >Change</button>
            )}
        </div>
        )
    }
}