import React, { Component } from 'react'
import { connect } from 'react-redux'


import * as actionTypes from '../../../store/actions/actionTypes'
import CLogIn from './LogIn'
import CRegister from './Register'

const mapStateToProps = (state) => {
    return {
        isOpen: state.popup.isOpen,
        login: state.popup.login,
        register: state.popup.register,
        isDisabled: state.popup.isDisabled
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onClose: () => dispatch({type: actionTypes.CLOSE_POPUP}),
        onLogin: () => dispatch({type:actionTypes.OPEN_POPUP_LOGIN}),
        onRegister: () => dispatch({type:actionTypes.OPEN_POPUP_REGISTER})
    }
}

export default connect(mapStateToProps, mapDispatchToProps) 
(class LoginPopup extends Component {
    constructor(props) {
        super(props)
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(nextProps.isOpen && nextProps.login) {
            this.login
        }
        if(nextProps.isOpen && nextProps.register) {
            this.register
        }
    }

    login() {
        this.props.onLogin()
        this.loginForm.style.left = '0'
        this.registerForm.style.left = '30rem' 
        this.btn.style.left = '0'
    }
    

    register() {
        this.props.onRegister()
        this.loginForm.style.left = '-30rem'
        this.registerForm.style.left = '0'
        this.btn.style.left = '9rem'
    }

    render() {
        let isDisabled = this.props.isDisabled ? 'disabled' : false
        return (
            <>
            {this.props.isOpen && (
                <section className='popup'>
                    <div className='popup__content'>
                        <div className='popup__close'>
                            <div className='close-btn' onClick={this.props.onClose}>
                                <div className="close-btn__leftright close-line"></div>
                                <div className="close-btn__rightleft close-line"></div>
                                <label className="close-btn__title">close</label>
                            </div>
                        </div>
                        <div className='content'>
                            <div className='content__toggle-btn'>
                                <div 
                                ref={(ref) => this.btn = ref}
                                className='toggle-btn__effect'></div>
                                <button className='toggle-btn__btn' disabled={isDisabled} onClick={this.login}>Log in</button>
                                <button className='toggle-btn__btn' disabled={isDisabled} onClick={this.register}>Register</button>
                            </div>
                            <div className='content__form'>
                                <div 
                                ref={(ref) => this.loginForm = ref} 
                                className='login-form'>
                                    <CLogIn/>
                                </div>
                                <div 
                                ref={(ref) => this.registerForm = ref}
                                className='register-form'>
                                    <CRegister logIn={this.login}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            </>
        )            
    }
})