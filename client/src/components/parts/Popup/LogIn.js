import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import * as actionTypes from '../../../store/actions/actionTypes'
import { login } from '../../../store/actions/authAction'

import { inputHandler, validatePwd, validateEmail } from '../../../utils'

const mapStateToProps = (state) => {
    return {
        login: state.popup.login
    }
}

const mapDisPatchToProps = dispatch => {
    return {
        onLogin: (userData) => dispatch(login(userData)),
        onSubmit: () => dispatch({type: actionTypes.POPUP_SUBMIT}),
        submitDone: () => dispatch({type: actionTypes.POPUP_SUBMIT_DONE}),
        loginDone: () => dispatch({type: actionTypes.CLOSE_POPUP})
    }
}

export default connect(mapStateToProps, mapDisPatchToProps) 
(withRouter(class LogIn extends Component {
    constructor(props) {
        super(props)

        this.state = {
            placeholder: '',
            isDisabled: false,
            inputStyle: 'input-border ',
            email: '',
            password: '',
            errorMessage: ''
        }

        this.submitHandler = this.submitHandler.bind(this)
        this.inputHandler = inputHandler.bind(this)
        this.validatePwd = validatePwd.bind(this)
        this.validateEmail = validateEmail.bind(this)
    }

    submitHandler(event) {
        event.preventDefault()

        let { email, password } = this.state
        let errorStyle = 'input-border input-border--error'

        let check1 = this.validateEmail(email, 'emailInput', errorStyle)
        let check2 = this.validatePwd(password,  'pwdInput', errorStyle)

        if(check1 && check2) {
            this.props.onSubmit()
            this.setState({
                isDisabled: true
            })

            let user = {
                email: email,
                password: password
            }

            axios.request({
                url: 'http://localhost:9000/api/user/login',
                method: 'POST',
                data: user
              })
              .then((res) => {
                let { token } = res.data
                localStorage.setItem('jwtToken', token)
                this.props.onLogin(token)
                
                this.setState({ 
                    successMessage: res.data.message,
                    errorMessage: ''
                })
                this.props.loginDone()
              })
              .catch((err) => {
                this.setState({ 
                    successMessage: '',
                    errorMessage: err.response.data.message,
                    isDisabled: false,
                    inputStyle: 'input-border '
                })
                this.form.reset()
              }).finally(
                this.props.submitDone()
              )
        }
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(!nextProps.login) {
            this.pwdInput.className = this.state.inputStyle
            this.emailInput.className = this.state.inputStyle
            this.form.reset(),
            nextState.errorMessage = ''
        }
    }

    render() {
        let { isDisabled, 
            inputStyle,
            errorMessage
         } = this.state



        let disabled = isDisabled ? 'disabled' : ''

        return (
        <>    
            {(!errorMessage) && (
                <div className='content__noti--default'></div>)}
            {errorMessage && (
                <div className='content__noti--error'>{errorMessage}</div>
            )}
            <form 
            ref = {(ref) => this.form = ref}
            >
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
                <a className='btn-link' onClick={this.props.reset}>Forget password?</a>
                <input 
                className='btn-primary' 
                type='submit' 
                value='Log in' 
                disabled={disabled}
                onClick={this.submitHandler}/>
            </form>
        </>
        )
    }
}))