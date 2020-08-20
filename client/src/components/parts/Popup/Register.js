import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import * as actionTypes from '../../../store/actions/actionTypes'

import { inputHandler, validatePwd, 
    validateEmail, checkMatchPwd,
    validateName } from '../../../utils'

const mapStateToProps = (state) => {
    return {
        register: state.popup.register
    }
}

const mapDisPatchToProps = dispatch => {
    return {
        onSubmit: () => dispatch({type: actionTypes.POPUP_SUBMIT}),
        submitDone: () => dispatch({type: actionTypes.POPUP_SUBMIT_DONE})
    }
}
    

export default connect(mapStateToProps, mapDisPatchToProps) 
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
            errorMessage: '',
            successMessage: ''
        }

        this.submitHandler = this.submitHandler.bind(this)
        this.inputHandler = inputHandler.bind(this)
        this.validateName = validateName.bind(this)
        this.validatePwd = validatePwd.bind(this)
        this.validateEmail = validateEmail.bind(this)
        this.checkMatchPwd = checkMatchPwd.bind(this)
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(!nextProps.register) {
            this.pwdInput.className = this.state.inputStyle
            this.emailInput.className = this.state.inputStyle
            this.nameInput.className = this.state.inputStyle
            this.pwdCheckInput.className = this.state.inputStyle
            this.form.reset()
            nextState.errorMessage = ''
            nextState.successMessage = ''
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
            this.props.onSubmit()

            this.setState({
                isDisabled: true
            })

            let newUser = {
                email: email,
                name: name,
                password: password
            }

            axios.request({
                url: 'http://localhost:9000/api/user/register',
                method: 'POST',
                data: newUser
              })
              .then(res => {
                let successMessage = res.data.message
                this.setState({ successMessage })
              })
              .catch(err => {
                let errorMessage = err.response.data.message
                this.setState({ errorMessage })
              })
              .finally(() => {
                  this.props.submitDone()
                    this.form.reset()
                    this.setState({
                        isDisabled: false,
                    })
              })

        }
    }

    render() {
        let { isDisabled, 
            inputStyle,
            successMessage,
            errorMessage
        } = this.state

        
        let disabled = isDisabled ? 'disabled' : ''

        return (
        <>    
            {(!errorMessage && !successMessage) && (
                <div className='content__noti--default'></div>)}
            {errorMessage && (
                <div className='content__noti--error'>{errorMessage}</div>
            )}
            {successMessage && (
                <div className='content__noti'>{successMessage}</div>
            )}
            <form 
                ref = {(ref) => this.form = ref}>
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
        </>
        )
    }
})