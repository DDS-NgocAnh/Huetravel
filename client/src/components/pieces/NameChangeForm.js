import React, { Component } from 'react'

import { inputHandler, validateName } from '../../utils' 

export default class NameChangeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userNameInitial: 'Ngoc Anh Nguyen',
            userName: 'Ngoc Anh Nguyen',
            placeholder: '',
            isVisibled: false,
            isDisabled: true,
            btnChange: 'Change',
            btnDisabled: '',
            inputStyle: 'input u-margin-bottom-tiny ' 
        }

        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.inputHandler = inputHandler.bind(this)
        this.validateName = validateName.bind(this)
    }

    changeHandler(event) {
        event.preventDefault()
        let btnChange = this.state.btnChange == 'Change' ?
        'Later' : 'Change'
        this.setState({
            isVisibled: !this.state.isVisibled,
            btnChange: btnChange,   
            isDisabled: !this.state.isDisabled,
            userNameInitial: this.state.userNameInitial,
            userName: this.state.userNameInitial,
        })
    }

    submitHandler(event) {
        event.preventDefault()
        let { userName } = this.state

        let check1 = this.validateName(userName, 'nameInput', 'input--error')
        if(check1) {
            this.setState({
                btnDisabled: 'disabled',
                isDisabled: !this.state.isDisabled
            })
        }
    }

    render() {
        let { isDisabled, userName,
            userNameInitial, btnChange,
            isVisibled, btnDisabled,
            inputStyle, placeholder
         } = this.state


        let disabled = isDisabled ? 'disabled' : ''

        return (
        <div className='name-change-form'>    
            <form onSubmit={this.submitHandler}>
                <h4 className='form__title heading-tertiary'>NAME</h4>
                {!isVisibled && (
                    <input name='userName' 
                    className='input input--primary u-margin-bottom-tiny' 
                    value={userNameInitial}
                    disabled={disabled}
                    />
                )}
                {isVisibled && (
                    <input 
                    ref={(ref) => this.nameInput= ref}
                    name='userName' 
                    className={inputStyle}
                    placeholder = {placeholder}
                    defaultValue={userName}
                    onChange={this.inputHandler}
                    disabled={disabled}
                    />
                )}
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