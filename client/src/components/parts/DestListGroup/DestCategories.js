import React, { Component } from 'react'

export default class DestCategories extends Component {
    constructor(props) {
        super(props)

        this.state = {
            category: 'all',
        }
        this.inputHandler = this.inputHandler.bind(this);
    }

    inputHandler(event) {
        if (this.props.onChange instanceof Function) {
            let value = event.target.value
            this.props.onChange(value)
        }
    }

    render() {
        let result = this.props.count > 1 ? ' results' : ' result'
        let totalPosts = this.props.count + result
        return (
            <>
            <div className='dest-categories' onChange={this.inputHandler}>
                <div className='input-radio input-radio--text'>
                    <input id='block-all' type='radio' name='category' value='all' defaultChecked='true'/>
                    <label htmlFor='block-all'>All</label>
                </div>
                <div className='input-radio input-radio--text'>
                    <input id='block-attraction' type='radio' name='category' value='attraction'/>
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
                <span className='u-text-bold'>{totalPosts}</span>
            </div>
            </>
        )
    }
}