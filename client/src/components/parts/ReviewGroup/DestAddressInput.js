import React, { Component } from 'react'

import { trimValue } from '../../../utils'

export default class DestAddressInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address: '',
        }
        this.inputHandler = this.inputHandler.bind(this);
        this.trimValue = trimValue.bind(this)
    }

    inputHandler(event) {
        const target = event.target
        const { name, value } = target
        this.setState({ [name] : trimValue(value) }, () => {
            if(this.props.onChange) {
                this.props.onChange(this.state)
            }
        })
    }

    render() {
        let { address } = this.state
        let style = this.props.error ? 'input input--error' : 'input'
        return (
            <input name='address' 
            className={style}
            placeholder='Address' 
            value = {address}
            disabled={this.props.disabled}
            onChange={this.inputHandler}
            required/>
        )
    }
}