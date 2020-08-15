import React, { Component } from 'react'

import { connect } from 'react-redux'

import CLogIn from './LogIn'
import CRegister from './Register'

const mapStateToProps = (state) => {
    return {
        errorMessage: state.errorMessage,
        successMessage: state.successMessage
    }
}

export default connect(mapStateToProps)(class LoginPopup extends Component {
    constructor(props) {
        super(props)

        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
    }

    login() {
        this.loginForm.style.left = '0'
        this.registerForm.style.left = '30rem' 
        this.btn.style.left = '0'
    }
    

    register() {
        this.loginForm.style.left = '-30rem'
        this.registerForm.style.left = '0'
        this.btn.style.left = '9rem'
    }


    render() {
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
                                <button className='toggle-btn__btn' onClick={this.login}>Log in</button>
                                <button className='toggle-btn__btn' onClick={this.register}>Register</button>
                            </div>
                            <div className='content__noti--default' ></div>
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