import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'

import { validateName, trimValue, toastNoti } from '../../utils' 

export default 
withRouter(class NameChangeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: props.match.params.userId,
            userName: '',
            placeholder: '',
            isVisibled: false,
            isDisabled: true,
            btnChange: 'Change',
            btnDisabled: '',
            inputStyle: 'input u-margin-bottom-tiny ' 
        }

        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.validateName = validateName.bind(this)
        this.toastNoti = toastNoti.bind(this)
        this.trimValue = trimValue.bind(this)
        this.inputHandler = this.inputHandler.bind(this)
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        let oldState = this.state
        if(nextProps.userName && !oldState.userName) {
            nextState.userName = nextProps.userName
            nextState.userNameInitial = nextProps.userName
        }
        this.toastNoti(nextState)

        this.props.socket.on(`returnUserProfileOf${this.state.userId}`, data => {
            if(data.error) {
                this.setState({errorMessage: data.error})
            } else {
                this.setState({userName: data.name})
            }
        })
    }

    inputHandler(event) {
        event.preventDefault()
        let { name, value } = event.target

        this.setState({
            [name]: value
        })
    }

    changeHandler() {
        let btnChange = this.state.btnChange == 'Change' ?
        'Later' : 'Change'
        this.setState({
            isVisibled: !this.state.isVisibled,
            btnChange: btnChange,   
            isDisabled: !this.state.isDisabled
        })
    }

    submitHandler(event) {
        event.preventDefault()
        let { userName } = this.state
        let errorStyle = 'input u-margin-bottom-tiny input--error'

        let check1 = this.validateName(userName, 'nameInput', errorStyle)
        if(check1) {
            this.setState({
                btnDisabled: 'disabled',
                isDisabled: true
            })

            let newName = {
                name: trimValue(userName)
            }

            axios.post(
                'http://localhost:9000/api/user/change-name',
                newName
            ).then(res => {
                this.props.socket.emit('changeName', (this.props.userId))

                this.setState({
                    successMessage: res.data.message
                })
            }
            ).catch(err => {
                this.setState({errorMessage: err.message || err.response.data.message})
            })
            .finally(
                this.setState({
                    btnDisabled: '',
                    isDisabled: true,
                    isVisibled: false,
                    btnChange: 'Change',
                    inputStyle: 'input u-margin-bottom-tiny ' 
                })
            )
        }
    }


    render() {
        let { isDisabled, userName,
            btnChange,
            isVisibled, btnDisabled,
            inputStyle, placeholder,
            userId
         } = this.state

        let isCurrentUser = this.props.isCurrentUser

        let disabled = isDisabled ? 'disabled' : ''

        return (
        <div className='name-change-form'>    
            <form onSubmit={this.submitHandler}>
                <h4 className='form__title heading-tertiary'>NAME</h4>
                {!isVisibled && (
                    <input name='userName' 
                    className='input input--primary u-margin-bottom-tiny' 
                    defaultValue={userName}
                    disabled={disabled}
                    onChange={this.inputHandler}
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
                className='btn-page-control u-margin-right-tiny u-margin-top-small'
                onClick={this.changeHandler}
                disabled={btnDisabled}
                >{btnChange}</button>
            )}
            {isCurrentUser && isVisibled && (
                <button
                type='submit'
                className='btn-page-control u-margin-top-small'
                onClick={this.submitHandler}
                disabled={btnDisabled}
                >Change</button>
            )}
        </div> 
        )
    }
})