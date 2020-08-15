import React, { Component } from 'react'
import { connect } from 'react-redux'

import { register } from '../../../store/actions/authActions'

import { inputHandler, validatePwd, 
    validateEmail, checkMatchPwd,
    validateName } from '../../../utils'

const mapStateToProps = (state) => {
    return {
        isLoading: state.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onRegister: (name, email, password) => 
        dispatch(register(name, email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)
(class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            placeholder: '',
            isDisabled: false,
            inputStyle: 'input-border ',
            email: '',
            password: '',
            passwordCheck: '',
            name: '',
        }

        this.submitHandler = this.submitHandler.bind(this)
        this.inputHandler = inputHandler.bind(this)
        this.validateName = validateName.bind(this)
        this.validatePwd = validatePwd.bind(this)
        this.validateEmail = validateEmail.bind(this)
        this.checkMatchPwd = checkMatchPwd.bind(this)
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(!nextProps.isLoading) {
            nextState.isDisabled = false
            nextState.email = ''
            nextState.password = ''
            nextState.passwordCheck = ''
            nextState.name = ''
            nextState.inputStyle = 'input-border '
        }
    }

    submitHandler(event) {
        event.preventDefault()

        let { name, email, password, passwordCheck } = this.state
        let errorStyle = 'input-border--error'

        let check1 = this.validateName(name, 'nameInput', errorStyle)
        let check2 = this.validateEmail(email, 'emailInput', errorStyle)
        let check3 = this.validatePwd(password, 'pwdInput', errorStyle)
        let check4 = this.validatePwd(passwordCheck, 'pwdCheckInput', errorStyle)
        let check5 = false

        if (check3 && check4) {
            check5 = this.checkMatchPwd(password, 'pwdInput', 
            passwordCheck, 'pwdCheckInput', errorStyle)
        }

        if(check1 && check2 && check3 && check4 && check5) {
            this.setState({
                isDisabled: true
            })

            this.props.onRegister(
                this.state.name,
                this.state.email,
                this.state.password  
            )
        }
    }

    render() {
        let { isDisabled, 
            inputStyle,
         } = this.state

        
        let disabled = isDisabled ? 'disabled' : ''

        return (
            <form >
                <input 
                ref = {(ref) => this.nameInput = ref}
                name='name'
                className={inputStyle} 
                disabled={disabled}
                onChange={this.inputHandler}
                placeholder='Name (Maximum 20 characters)'/>
               <input 
                ref = {(ref) => this.emailInput = ref}
                type='email'
                name='email'
                className={inputStyle} 
                disabled={disabled}
                onChange={this.inputHandler}
                placeholder='Email'/>
                <input 
                ref = {(ref) => this.pwdInput = ref}
                name='password'
                type='password'
                className={inputStyle} 
                disabled={disabled}
                onChange={this.inputHandler}
                placeholder='Password'/>
                <input 
                ref = {(ref) => this.pwdCheckInput = ref}
                name='passwordCheck'
                type='password'
                className={inputStyle} 
                disabled={disabled}
                onChange={this.inputHandler}
                placeholder='Password confirmation'/>
                <input className='btn-primary' 
                type='submit' 
                value='Register' 
                disabled={disabled}
                onClick={this.submitHandler}/>
            </form>
        )
    }
})