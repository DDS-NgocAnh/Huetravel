import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

import { inputHandler, validateName } from '../../utils' 

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser.userData
    }
}

export default connect(mapStateToProps)
(withRouter(class NameChangeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: props.match.params.userId,
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

            let newName = {
                name: userName
            }

            axios.post(
                'http:localhost:9000/api/change-name',
                newName
            ).then(res => {

                }
            )
        }
    }

    render() {
        let { isDisabled, userName,
            userNameInitial, btnChange,
            isVisibled, btnDisabled,
            inputStyle, placeholder,
            userId
         } = this.state

        let isCurrentUser = userId == this.props.currentUser.id ?
        true: false

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
            {isCurrentUser && (
                <button
                className='btn-page-control u-margin-right-tiny'
                onClick={this.changeHandler}
                disabled={btnDisabled}
                >{btnChange}</button>

                )}
            {isCurrentUser && isVisibled && (
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
}))