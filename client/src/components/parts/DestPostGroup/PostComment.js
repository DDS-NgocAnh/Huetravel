import React, { Component } from 'react'
import { connect } from 'react-redux'

import CDropdown from './Dropdown'
import CComment from '../../pieces/Comment'
import CCommentInput from '../../pieces/CommentInput'

import * as actionTypes from '../../../store/actions/actionTypes'

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.currentUser.isLoggedIn,
        currentUser: state.currentUser.userData,
        isOpen: state.popup.isOpen
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOpen: () => dispatch({type: actionTypes.OPEN_POPUP})
    }
}

export default connect (mapStateToProps, mapDispatchToProps)
(class Comment extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { avatar } = this.props.currentUser
        return (
            <div className='post-comment'>
                <div className='post-comment__header'>
                    <h4 className='post-comment__title'>Comments</h4>
                    <CDropdown/>
                </div>
                {this.props.isLoggedIn && (
                    <CCommentInput
                    style='input-comment'
                    avatar={avatar}/>
                )}
                {!this.props.isLoggedIn && (
                    <div>
                        <h4 className='u-margin-bottom-small u-center-text u-text-normal'>You must be logged in to post a comment</h4>
                        <a className='u-margin-bottom-medium btn-primary u-center-btn'
                        onClick={this.props.onOpen}>Log in</a>
                    </div>
                )}
                <div className='post-comment-content'>
                    <CComment
                    style='comment'
                     avatar={avatar}/>
                </div>
            </div>
        )
    }
})