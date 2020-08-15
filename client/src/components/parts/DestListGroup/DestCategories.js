import React, { Component } from 'react'

export default class DestCategories extends Component {
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
            <>
            <div className='dest-categories' onChange={this.inputHandler}>
                <div className='input-radio input-radio--text'>
                    <input id='block-attraction' type='radio' name='category' value='attraction' defaultChecked='true'/>
                    <label htmlFor='block-attraction'>Attractions</label>
                </div>
                <div className='input-radio input-radio--text'>
                    <input id='block-restaurant' type='radio' name='category' value='restaurant'/>
                    <label htmlFor='block-restaurant'>Restaurants</label>
                </div>
                <div className='input-radio input-radio--text'>
                    <input id='block-cafe' type='radio' name='category' value='cafe'/>
                    <label htmlFor='block-cafe'>Cafes</label>
                </div>
                <div className='input-radio input-radio--text'>
                    <input id='block-shopping' type='radio' name='category' value='shopping'/>
                    <label htmlFor='block-shopping'>Shoppings</label>
                </div>
                <div className='underline'></div> 
            </div>
            <div className='dest-results'>
                <span className='u-text-bold'>1.238 results</span>
            </div>
            </>
        )
    }
}