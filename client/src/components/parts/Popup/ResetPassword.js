import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import * as actionTypes from '../../../store/actions/actionTypes'

import { inputHandler, validateEmail } from '../../../utils'

const mapStateToProps = (state) => {
    return {
        reset: state.popup.reset
    }
}

const mapDisPatchToProps = dispatch => {
    return {
        onSubmit: () => dispatch({type: actionTypes.POPUP_SUBMIT}),
        submitDone: () => dispatch({type: actionTypes.POPUP_SUBMIT_DONE}),
    }
}

export default connect(mapStateToProps, mapDisPatchToProps) 
(withRouter(class Reset extends Component {
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
        this.validateEmail = validateEmail.bind(this)
    }

    submitHandler(event) {
        event.preventDefault()

        let { email } = this.state
        let errorStyle = 'input-border input-border--error'

        let check = this.validateEmail(email, 'emailInput', errorStyle)

        if(check) {
            this.props.onSubmit()
            this.setState({
                isDisabled: true
            })

            let user = {
                email: email,
            }

            axios.post(
                'http://localhost:9000/api/user/reset-password',
                user
              )
              .then((res) => {
                let successMessage = res.data.message
                this.setState({ successMessage })
              })
              .catch(err => {
                let errorMessage = err.message || err.response.data.message
                this.setState({ errorMessage })
              })
              .finally(() => {
                  this.props.submitDone()
                    this.form.reset()
                    this.setState({
                        isDisabled: false,
                        inputStyle: 'input-border '
                    })
              })
        }
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(!nextProps.reset) {
            this.emailInput.className = this.state.inputStyle
            this.form.reset(),
            nextState.errorMessage = ''
            nextState.successMessage = ''
        }
    }

    render() {
        let { isDisabled, 
            inputStyle,
            errorMessage,
            successMessage
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
                className='btn-primary' 
                type='submit' 
                value='Reset password' 
                disabled={disabled}
                onClick={this.submitHandler}/>
            </form>
        </>
        )
    }
}))