import React, { Component } from 'react'

import { trimValue, validateBlank } from '../../utils'

export default class CommentInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            inputStyle: 'input ' 
        }

        this.submitHandler = this.submitHandler.bind(this)
        this.validateBlank = validateBlank.bind(this)
        this.trimValue = trimValue.bind(this)
        this.inputHandler = this.inputHandler.bind(this)
    }


    inputHandler(event) {
        event.preventDefault()
        let { name, value } = event.target

        this.setState({
            [name]: value
        })
    }

    submitHandler(event) {
        event.preventDefault()
        let { comment } = this.state
        let errorStyle = 'input input--error'

        let check = this.validateBlank(comment, 'commentInput', errorStyle)
        if(check) {
            // let newName = {
            //     name: trimValue(userName)
            // }

            // axios.post(
            //     'http://localhost:9000/api/user/change-name',
            //     newName
            // ).then(res => {
            //     this.setState({successMessage: res.data.message})
            // }
            // ).catch(err => {
            //     this.setState({errorMessage: err.message || err.response.data.message})
            // })
            // .finally(
            //     this.setState({
            //         inputStyle: 'input ' 
            //     })
            // )
        }
    }

 
    render() {
        let { inputStyle } = this.state

        return (
        <form             
        ref = {(ref) => this.form = ref}
        className={this.props.style} onSubmit={this.submitHandler}>
            <img src={this.props.avatar} className='comment-avatar'></img>
            <input
            ref = {(ref) => this.commentInput = ref}
            name='comment'
            className={inputStyle}
            onChange={this.inputHandler}
            placeholder='Write your comment'/>
        </form>
        )
    }
}