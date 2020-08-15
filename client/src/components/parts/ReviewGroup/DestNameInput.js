import React, { Component } from 'react'

import { trimValue } from '../../../utils'

export default class DestNameInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
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
        let { name } = this.state
        let style = this.props.error ? 'input input--error' : 'input'
        return (
            
            <input name='name' 
                className={style}
                placeholder='Destination name' 
                value = {name}
                onChange={this.inputHandler}
                disabled={this.props.disabled}
                required/>
                
        )
    }
}