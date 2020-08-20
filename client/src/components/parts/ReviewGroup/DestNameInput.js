import React, { Component } from 'react'

export default class DestNameInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
        }
        this.inputHandler = this.inputHandler.bind(this);
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        let oldProps = this.props
        if(nextProps.reset && nextProps.reset != oldProps.reset) {
            this.setState({name: ''})
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
        let { name } = this.state
        if(!this.props.reset) {
            name = this.props.name || this.state.name
        }
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