import React, { Component } from 'react'

export default class Dropdown extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='dropdown'>
                <span className='dropdown__title'>Sort by</span>
                <select className="dropdown__content">
                    <option value="flower" defaultValue={this.props.value}>Flower</option>
                    <option value="rock">Rock</option>
                </select>
            </div>
        )
    }
}
