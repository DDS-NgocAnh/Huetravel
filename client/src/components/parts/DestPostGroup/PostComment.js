import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import CDropdown from "./Dropdown";
import CComment from "../../pieces/Comment";
import CCommentInput from "../../pieces/CommentInput";

import * as actionTypes from "../../../store/actions/actionTypes";

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.currentUser.isLoggedIn,
    currentUser: state.currentUser.userData,
    isOpen: state.popup.isOpen,
    socket: state.socket.socket,
    notification: state.notification,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOpen: () => dispatch({ type: actionTypes.OPEN_POPUP }),
    jumpToCommentDone: () =>
      dispatch({ type: actionTypes.JUMP_TO_COMMENT_DONE }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(
    class PostComment extends Component {
      constructor(props) {
        super(props);
        this.state = {
          postId: props.match.params.postId,
          filter: "newest",
          pageIndex: 1,
          comments: [],
          pageSize: 0,
          scrolling: false,
          commentsTotal: 0,
          isFilter: false,
          hasChange: false
        };

        this.mustGetComments = this.mustGetComments.bind(this);
        this.renderComment = this.renderComment.bind(this);
        this.loadComments = this.loadComments.bind(this);
        this.handleScroll = this.handleScroll.bind(this)
      }

      componentDidMount() {
        this.mustGetComments(this.state);
        this.loadComments();
        if (this.props.notification.isJumpToComment) {
          window.scrollTo(0, this.postComment.offsetTop);
        }
      }

      UNSAFE_componentWillMount() {
        this.scrollListener = window.addEventListener('scroll', (e) => {
          this.handleScroll(e)
        })
        this.props.socket.on(`hasChange${this.state.postId}`, () => {
          this.setState({hasChange: true})
        })
      }

      handleScroll(e) {
        let { scrolling, commentsTotal, pageSize } = this.state
        
        if(scrolling) {return}
        if(commentsTotal <= pageSize) {return}
        let lastComment = document.querySelector('div.post-comment__content > div.comment-footer:last-child')
        if(lastComment) {
          let lastCommentOffset = lastComment.offsetTop + lastComment.clientHeight
          let pageOffset = window.pageYOffset + window.innerHeight
  
          if(pageOffset >= lastCommentOffset) {
            this.setState({scrolling: true})
            this.mustGetComments(this.state)
          }
        }

      }

      UNSAFE_componentWillUpdate(nextProps, nextState) {
        let oldState = this.state;

        if (nextState.filter != oldState.filter) {
          this.setState({isFilter: true})
          this.mustGetComments({...nextState, pageSize: 0});
        }

        if (
          nextProps.notification.isJumpToComment &&
          nextProps.notification.commentId != this.props.notification.commentId
        ) {
          window.scrollTo(0, this.postComment.offsetTop);
        }

        if(nextState.hasChange && nextState.hasChange != this.state.hasChange) {
          this.mustGetComments(nextState)
        }
      }

      mustGetComments(state) {
        this.props.socket.emit("getComments", {
          postId: state.postId,
          sortBy: state.filter,
          pageSize: state.pageSize,
          hasChange: state.hasChange
        });
      }

      loadComments() {
        this.props.socket.on(`returnCommentsOf${this.state.postId}`, (data) => {
          if (data.error) {
            this.setState({ errorMessage: data.error });
          } else {
            let loadedComments = this.state.comments
            if(this.state.isFilter) {
              this.setState({
                isFilter: false,
                comments: data.comments,
                commentsTotal: data.commentsTotal,
                pageSize: data.comments.length,
                scrolling: false
              })
            } else if (!this.state.hasChange 
              && data.comments.length > 1) {
              this.setState({
                comments: [...loadedComments, ...data.comments],
                commentsTotal: data.commentsTotal,
                pageSize: loadedComments.length + data.comments.length,
                scrolling: false
              });
            } else if(this.state.hasChange) {
              this.setState({
                comments: data.comments,
                commentsTotal: data.commentsTotal,
                pageSize: data.comments.length,
                scrolling: false,
                hasChange: false
              });
            } else {
              this.setState({
                comments: [...data.comments, ...loadedComments],
                commentsTotal: this.state.commentsTotal + data.comments.length,
                pageSize: loadedComments.length + data.comments.length,
                scrolling: false
              });
            }
          }
        });
      }

      componentWillUnmount() {
        this.props.jumpToCommentDone();
        this.props.socket.off(`returnCommentsOf${this.state.postId}`);
        this.props.socket.off(`hasChange${this.state.postId}`)
      }

      setQueryConfig(config = { filter }) {
        this.props.jumpToCommentDone();
        this.setState(config);
      }

      renderComment() {
        let { comments } = this.state;
        let result;
        if (!comments.length) {
          result = (
            <h3 className="u-center-text u-text-bold u-color-light u-margin-top-big">
              No comment found
            </h3>
          );
        } else {
          let isSpecial = false;
          if (this.props.notification.isJumpToComment ) {
            comments.unshift(
              comments.splice(
                comments.findIndex(
                  comment => comment._id === this.props.notification.commentId
                ),
                1
              )[0]
            );
            isSpecial = true;
          }

          result = comments.map((comment, i) => {
            let key = comment._id;
            let specialStyle = false;
            if (i === 0) {
              specialStyle = isSpecial && !this.props.notification.commentStyle ? "comment special" : false;
            }

            return (
              <CComment
                key={key}
                specialStyle={specialStyle}
                isReply={this.props.notification.isReply}
                isLoggedIn={this.props.isLoggedIn}
                comment={comment}
                postId={this.state.postId}
                avatar={this.props.currentUser.avatar}
                userId={this.props.currentUser.id}
                pageSize={this.state.pageSize}
                commentId={this.props.notification.commentId}
                date={this.props.notification.date}
                commentStyle={this.props.notification.commentStyle}
              />
            );
          });
        }

        return result;
      }

      render() {
        let { avatar } = this.props.currentUser;
        let { commentsTotal } = this.state;
        return (
          <div className="post-comment">
            <div className="post-comment__header">
              <h4 className="post-comment__title">{`Comments (${commentsTotal})`}</h4>
              <CDropdown
                onChange={(value) => {
                  this.setQueryConfig({ filter: value });
                }}
              />
            </div>
            {this.props.isLoggedIn && (
              <CCommentInput
                style="input-comment"
                avatar={avatar}
                postId={this.state.postId}
                sortBy={this.state.filter}
                pageIndex={this.state.pageIndex}
                userId={this.props.currentUser.id}
                pageSize={this.state.pageSize}
              />
            )}
            {!this.props.isLoggedIn && (
              <div>
                <h4 className="u-margin-bottom-small u-center-text u-text-normal">
                  You must be logged in to post a comment
                </h4>
                <a
                  className="u-margin-bottom-medium btn-primary u-center-btn"
                  onClick={this.props.onOpen}
                >
                  Log in
                </a>
              </div>
            )}
            <div
              className="post-comment__content"
              ref={(ref) => (this.postComment = ref)}
            >
              {this.renderComment()}
            </div>
          </div>
        );
      }
    }
  )
);
