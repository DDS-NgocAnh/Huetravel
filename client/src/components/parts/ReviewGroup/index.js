import React, { Component } from 'react'

import CPhotoUpload from './PhotoUpload'
import CCategoryOptions from './CategoryOptions'
import CDestNameInput from './DestNameInput'
import CDestAddressInput from './DestAddressInput'
import CTextEditor from './TextEditor'

import { validateBlank } from '../../../utils'

export default class ReviewGroup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            placeholder: '',
            isDisabled: false,
            name: '',
            address: '',
            content: '',
            nameError: false,
            addressError: false,
            textEditorError: false
        }

        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setError = this.setError.bind(this)
        this.validateBlank = validateBlank.bind(this)

    }

    changeHandler(data) {
        for(let value of Object.entries(data)) {
            this.setState({
                [value[0]]: value[1]
            })
        }
    }

    submitHandler(event) {
        event.preventDefault()

        let { name, address, content } = this.state

        let check1 = this.validateBlank(name, 'nameInput')
        let check2 = this.validateBlank(address,  'addressInput')
        let check3 = this.validateBlank(content, 'textEditorInput')

        this.setError(check1, 'nameError')
        this.setError(check2, 'addressError')

        if(!check3) {
            this.setState({ textEditorError: true })
        } else {
            this.setState({ textEditorError: false})
        }
        

        if(check1 && check2 &&check3) {
            console.log(this.state.content);
            this.setState({
                isDisabled: true
            })
        }
    }

    setError(condition, state) {
        if(!condition) {
            this.setState({ [state]: true })
        } else {
            this.setState({ [state]: false})
        }
    }

    render() {
        let { isDisabled, 
            nameError, addressError,
            textEditorError
         } = this.state

        let disabled = isDisabled ? 'disabled' : ''

        return (
            <form className='review u-margin-horizontal-5'>
                <div className='review__photo'>
                    <CPhotoUpload 
                    disabled={disabled}  
                    onChange={this.changeHandler}/>
                </div>
                <div className='review__input-group'>
                    <CCategoryOptions 
                    name='addressInput'
                    disabled={disabled}  
                    onChange={this.changeHandler}/>
                    <CDestNameInput
                    ref={(ref) => this.nameInput = ref}
                    disabled={disabled}  
                    error = {nameError}
                    onChange={this.changeHandler}/>
                    <CDestAddressInput
                    ref={(ref) => this.addressInput = ref}
                    error = {addressError}
                    disabled={disabled}  
                    onChange={this.changeHandler}/>
                    <div className='text-editor u-margin-bottom-medium'>
                        <CTextEditor 
                        ref={(ref) => this.textEditorInput = ref}
                        disabled={disabled}  
                        onChange={this.changeHandler}/>
                    </div>
                    <div className='review__submit'>
                        <button type='submit'
                        disabled={disabled}   
                        onClick={this.submitHandler}
                        className='btn-page-control'>Post</button>
                    </div>
                </div>
            </form>
        )
    }
}