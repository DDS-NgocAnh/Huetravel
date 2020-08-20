import React, { Component } from 'react'

import searchIcon from '../../../assets/icons/search.png'

export default class SearchForm extends Component {
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
            <form className='search-form'>
                <button className='search-form__btn' type='submit'><img className='btn-icon' src={searchIcon} alt='search-icon'></img></button>
                <input onChange={this.inputHandler}
                className='search-form__input input input--transparent' 
                placeholder='Search a destinations'/>
            </form>
        )
    }
}
