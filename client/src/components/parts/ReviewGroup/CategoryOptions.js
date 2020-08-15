import React, { Component } from 'react'

export default class CategoryOptions extends Component {
    constructor(props) {
        super(props)

        this.state = {
            category: '',
        }
        this.inputHandler = this.inputHandler.bind(this);
    }

    inputHandler(event) {
        const target = event.target
        const { name, value } = target
        this.setState({
            [name] : value
        })
    }

    render() {
        return (
            <div className='category-options u-margin-bottom-small' onChange={this.inputHandler}>
                <div className='input-radio input-radio--block'>
                    <input id='block-attraction' type='radio' name='category' value='attraction' defaultChecked='true'/>
                    <label htmlFor='block-attraction'>Attraction</label>
                </div>
                <div className='input-radio input-radio--block'>
                    <input id='block-restaurant' type='radio' name='category' value='restaurant'/>
                    <label htmlFor='block-restaurant'>Restaurant</label>
                </div>
                <div className='input-radio input-radio--block'>
                    <input id='block-cafe' type='radio' name='category' value='cafe'/>
                    <label htmlFor='block-cafe'>Cafe</label>
                </div>
                <div className='input-radio input-radio--block'>
                    <input id='block-shopping' type='radio' name='category' value='shopping'/>
                    <label htmlFor='block-shopping'>Shopping</label>
                </div>
            </div>
        )
    }
}