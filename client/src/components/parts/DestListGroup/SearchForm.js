import React, { Component } from 'react'

import searchIcon from '../../../assets/icons/search.png'

export default class SearchForm extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <form className='search-form'>
                <button className='search-form__btn' type='submit'><img className='btn-icon' src={searchIcon} alt='search-icon'></img></button>
                <input className='search-form__input input input--transparent' placeholder='Search a destinations'/>
            </form>
        )
    }
}
