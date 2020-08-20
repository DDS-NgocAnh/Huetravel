import React, { Component } from 'react'

export default class Dropdown extends Component {
    constructor(props) {
        super(props)
        this.inputHandler = this.inputHandler.bind(this)
    }

    inputHandler(event) {
        if (this.props.onChange instanceof Function) {
            let value = event.target.value
            this.props.onChange(value)
        }
    }

    render() {
        return (
            <div className='dropdown'>
                <span className='dropdown__title'>Sort by</span>
                <select className="dropdown__content" onChange={this.inputHandler}>
                    <option value="flowers" defaultValue={this.props.value}>Flower</option>
                    <option value="rocks">Rock</option>
                </select>
            </div>
        )
    }
}
