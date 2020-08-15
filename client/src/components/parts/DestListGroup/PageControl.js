import React, { Component } from 'react'

export default class PageControl extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        <>
            <a className='btn-page-control'>Previous</a>
            <div className='page-control__pages'>
                <a className='btn-page btn-page--current'>1</a>
                <a className='btn-page'>2</a>
                <a className='btn-page'>3</a>
            </div>    
            <a className='btn-page-control'>Next</a>
        </>
        )
    }
}
