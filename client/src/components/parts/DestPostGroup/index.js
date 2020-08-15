import React, { Component } from 'react'

import CPostFooter  from './PostFooter'
import CPostHeader  from './PostHeader'

export default class DestPost extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <CPostHeader/>
                <div className ='post'>
                    <div className='post__content'></div>
                    <div className='post__edit-group-btn'>
                        <a className='btn-page-control'>Edit</a>
                        <a className='btn-delete'>Delete</a>
                    </div>
                </div>
                <CPostFooter />
            </>
        )
    }
}