import React, { Component } from "react";

import { trimValue, validateBlank } from "../../utils";

import TextareaAutosize from "react-textarea-autosize";

import { connect } from "react-redux";

import * as actionTypes from "../../store/actions/actionTypes";

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.currentUser.isLoggedIn,
    currentUser: state.currentUser.userData,
    isOpen: state.popup.isOpen,
    socket: state.socket.socket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    jumpToCommentDone: () =>
      dispatch({ type: actionTypes.JUMP_TO_COMMENT_DONE }),
    jumpToReplyDone: () =>
      dispatch({ type: actionTypes.JUMP_TO_REPLY_DONE }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class CommentInput extends Component {
    constructor(props) {
      super(props);

      this.state = {
        inputStyle: "textarea ",
        isDisabled: "",
      };

      this.submitHandler = this.submitHandler.bind(this);
      this.validateBlank = validateBlank.bind(this);
      this.trimValue = trimValue.bind(this);
      this.inputHandler = this.inputHandler.bind(this);
    }

    inputHandler(event) {
      event.preventDefault();
      let { name, value } = event.target;

      this.setState({
        [name]: value,
      });
    }

    submitHandler(event) {
      if (event.keyCode == 13 && event.shiftKey == false) {
        event.preventDefault();
        let { comment } = this.state;
        let errorStyle = "textarea textarea--error";

        let check = this.validateBlank(comment, "commentInput", errorStyle);
        if (check) {
          let newComment = {
            postId: this.props.postId,
            text: trimValue(comment),
            pageIndex: this.props.pageIndex,
            sortBy: this.props.sortBy,
            userId: this.props.userId,
            pageSize: this.props.pageSize,
            commentId: this.props.commentId || "",
          };

          this.setState({ isDisabled: "disabled" });
          if (this.props.style == "input-reply") {
            this.props.socket.emit("replyComment", newComment);
            this.props.jumpToReplyDone();
          } else {
            this.props.jumpToCommentDone();
            this.props.socket.emit("commentPost", newComment);
          }
          this.form.reset();
          this.setState({
            inputStyle: "textarea ",
            isDisabled: "",
            comment: "",
          });
        }
      }
    }

    render() {
      let { inputStyle, isDisabled } = this.state;

      return (
        <form ref={(ref) => (this.form = ref)} className={this.props.style}>
          <img src={this.props.avatar} className="comment-avatar"></img>
          <TextareaAutosize
            ref={(ref) => (this.commentInput = ref)}
            name="comment"
            className={inputStyle}
            onChange={this.inputHandler}
            disabled={isDisabled}
            placeholder="Write your comment"
            onKeyDown={this.submitHandler}
            rows={1}
          />
        </form>
      );
    }
  }
);
