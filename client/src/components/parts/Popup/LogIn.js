import React, { Component } from 'react'

import { inputHandler, validatePwd, validateEmail } from '../../../utils'

export default class LogIn extends Component {
    constructor(props) {
        super(props)

        this.state = {
            placeholder: '',
            isDisabled: false,
            inputStyle: 'input-border ',
            email: '',
            password: '',
        }

        this.submitHandler = this.submitHandler.bind(this)
        this.inputHandler = inputHandler.bind(this)
        this.validatePwd = validatePwd.bind(this)
        this.validateEmail = validateEmail.bind(this)
    }


    submitHandler(event) {
        event.preventDefault()

        let { email, password } = this.state
        let errorStyle = 'input-border--error'

        let check1 = this.validateEmail(email, 'emailInput', errorStyle)
        let check2 = this.validatePwd(password,  'pwdInput', errorStyle)

        if(check1 && check2) {
            this.setState({
                isDisabled: true
            })
        }
    }

    render() {
        let { isDisabled, 
            inputStyle
         } = this.state

        let disabled = isDisabled ? 'disabled' : ''

        return (
            <form >
                <input 
                ref = {(ref) => this.emailInput = ref}
                name='email'
                className={inputStyle} 
                placeholder='Email' 
                type='email'
                disabled={disabled}
                onChange={this.inputHandler}
                />
                <input 
                ref = {(ref) => this.pwdInput = ref}
                name='password'
                className={inputStyle} 
                placeholder='Password'
                disabled={disabled}
                onChange={this.inputHandler}
                type='password'/>
                <input 
                className='btn-primary' 
                type='submit' 
                value='Log in' 
                disabled={disabled}
                onClick={this.submitHandler}/>
            </form>
        )
    }
}