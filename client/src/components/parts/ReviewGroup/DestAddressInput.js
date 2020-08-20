import React, { Component } from 'react'

export default class DestAddressInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address: '',
        }
        this.inputHandler = this.inputHandler.bind(this);
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        let oldProps = this.props
        if(nextProps.reset && nextProps.reset != oldProps.reset) {
            this.setState({address: ''})
        }
    }

    inputHandler(event) {
        const target = event.target
        const { name, value } = target
        this.setState({ [name] : value }, () => {
            if(this.props.onChange) {
                this.props.onChange(this.state)
            }
        })
    }

    render() {
        let { address } = this.state
        if(!this.props.reset) {
            address = this.props.address || this.state.address
        }
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