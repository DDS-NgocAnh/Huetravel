import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getFormatedDate } from "../../utils";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";

import CReplyInput from "../pieces/CommentInput";

const mapDispatchToProps = (dispatch) => {
  return {
    onJumpToCommentDone: () =>
      dispatch({ type: actionTypes.JUMP_TO_COMMENT_DONE }),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(
  class Comment extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isReply: false,
        comment: "",
      };

      this.renderComments = this.renderComments.bind(this);
      this.getFormatedDate = getFormatedDate.bind(this);
      this.renderReplyInput = this.renderReplyInput.bind(this);
      this.renderReplies = this.renderReplies.bind(this);
    }

    renderComments(style, comment) {
      let date = this.getFormatedDate(comment.date);
      if (this.props.isReply) {
        let dateOfNoti = new Date(this.props.date).getTime();
        let dateOfComment = new Date(comment.date).getTime();

        if (dateOfComment === dateOfNoti) {
          style = "reply special";
        }
      } else if (this.props.commentId && this.props.commentId == comment._id) {
        style = this.props.specialStyle ? this.props.specialStyle : style;
      }

      let result = (
        <div key={comment._id}>
          <div className={style}>
            <Link to={`/${comment.user._id}`}>
              <img src={comment.user.avatar} className="comment-avatar"></img>
            </Link>
            <div className="comment-content">
              {/* {this.props.userId == comment.user._id && (
                <a className='btn-x' onClick={this.deleteComment}>&#10006;</a>
              )} */}
              <h6 className="comment-content__name">{comment.user.name}</h6>
              <span className="comment-content__text">{comment.text}</span>
            </div>
          </div>
          <div className="comment-footer">
            {style.includes("comment") && (
              <a className="btn-reply" onClick={this.renderReplies}>
                {`Reply (${comment.replies.length})`}
              </a>
            )}
            <span className="comment-footer__comment-date">{date}</span>
          </div>
        </div>
      );

      return result;
    }

    renderReplies() {
      if (!this.state.isReply && this.props.commentStyle) {
        this.props.onJumpToCommentDone();
        this.setState({ isReply: false });
      } else {
        this.setState({ isReply: !this.state.isReply });
      }
    }

    renderReplyInput() {
      let replyInput;
      if (this.props.userId) {
        replyInput = (
          <CReplyInput
            style="input-reply"
            avatar={this.props.avatar}
            postId={this.props.postId}
            sortBy={this.props.sortBy}
            pageIndex={this.props.pageIndex}
            userId={this.props.userId}
            pageSize={this.props.pageSize}
            commentId={this.props.comment._id}
          />
        );
      }
      return replyInput;
    }

    render() {
      let { comment, commentStyle } = this.props;
      let { isReply } = this.state;

      if (isReply || commentStyle) {
        return (
          <>
            {this.renderComments("comment", comment)}
            {comment.replies.map((reply) => {
              return this.renderComments("reply", reply);
            })}
            {this.renderReplyInput()}
          </>
        );
      } else {
        return <>{this.renderComments("comment", comment)}</>;
      }
    }
  }
);
