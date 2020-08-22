import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Comment extends Component {
    constructor(props) {
        super(props)

        this.renderReplies = this.renderReplies.bind(this)
    }

    renderReplies() {
        
    }

    render() {
        return (
        <>
            <div className={this.props.style}>
                <Link>
                    <img src={this.props.avatar} className='comment-avatar'></img>
                </Link>
                <div className='comment-content'>
                    <h6 className='comment-content__name'>Ngoc Anh</h6>
                    <span className='comment-content__text'>Ngoc Anh</span>
                </div>
            </div>
            <div className='comment-footer'>
                {this.props.style == 'comment' && (
                    <a className='btn-reply' onClick={this.renderReplies}>Reply</a>
                )}
                <span className='comment-footer__comment-date'>18:06AM | 12 Dec, 2019</span>
            </div>
        </>
        )
    }
}