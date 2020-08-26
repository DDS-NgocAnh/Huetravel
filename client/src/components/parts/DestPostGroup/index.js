import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import { update } from "../../../store/actions/postAction";

import CPostHeader from "./PostHeader";
import CPostFooter from "./PostFooter";
import CPostComment from "./PostComment";

import { toastNoti, updateSocket } from "../../../utils";

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser.userData,
    userNotes: state.currentUser.notes,
    socket: state.socket.socket
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    onUpdate: (postData) => dispatch(update(postData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToState
)(
  withRouter(
    class DestPost extends Component {
      constructor(props) {
        super(props);
        this.state = {
          postId: props.match.params.postId,
          isDelete: false,
        };
        this.deletePost = this.deletePost.bind(this);
        this.closeNoti = this.closeNoti.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.toastNoti = toastNoti.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.updateSocket = updateSocket.bind(this);
      }

      componentDidMount() {
        this.props.socket.emit("getPost", this.state.postId);
        this.props.socket.on(`returnPostOf${this.state.postId}`, (data) => {
          if (data.error) {
            this.setState({ errorMessage: data.error });
          } else {
            this.setState({
              post: data,
            });
          }
        });
      }

      UNSAFE_componentWillMount() {
        this.updateSocket('post', `returnPostOf${this.state.postId}`)
      }

      componentWillUnmount() {
        this.props.socket.off(`returnPostOf${this.state.postId}`)
      }

      UNSAFE_componentWillUpdate(nextProps, nextState) {
        this.toastNoti(nextState);
        if (nextProps.match.params.postId != this.props.match.params.postId) {
          this.props.socket.emit("getPost", nextProps.match.params.postId);
          this.updateSocket(
            'post',
            `returnPostOf${nextProps.match.params.postId}`
          );
        }
      }

      updatePost() {
        let { name, address, avatar, content, category } = this.state.post;
        let { postId } = this.state;
        let postData = {
          name,
          address,
          avatar,
          content,
          category,
          id: postId,
        };
        this.props.onUpdate(postData);
        this.props.history.push("/review");
      }

      deletePost() {
        this.setState({ isDelete: true });
      }

      onDelete() {
        axios
          .delete(`/api/post/${this.state.postId}`)
          .then((res) => {
            this.props.socket.emit("deletePost", {
              userId: this.props.currentUser.id,
              postId: this.state.postId,
            });
            this.setState({
              post: "",
              successMessage: res.data.message,
            });
          })
          .catch((err) => {
            this.setState({
              errorMessage: err.message || err.response.data.message,
            });
          })
          .finally(this.setState({ isDelete: false }));
      }

      closeNoti() {
        this.setState({ isDelete: false });
      }

      render() {
        let { post, postId, isDelete } = this.state;

        if (!post) {
          return (
            <h2 className="u-center-text u-text-bold u-center-el u-color-light">
              No post found
            </h2>
          );
        } else {
          let { currentUser } = this.props;
          let isPostOwner = false;
          if (post.writer) {
            isPostOwner = currentUser.id == post.writer._id ? true : false;
          }

          return (
            <>
              <CPostHeader
                header={post}
                postId={postId}
                socket={this.props.socket}
              />
              {isDelete && (
                <div className="delete-container">
                  <div className="delete-warning">
                    <div className="close-btn" onClick={this.closeNoti}>
                      <div className="close-btn__leftright close-line"></div>
                      <div className="close-btn__rightleft close-line"></div>
                    </div>
                    <h3 className="delete-warning__title">Delete post</h3>
                    <span className="delete-warning__content">
                      Are you sure you want to permanently delete this post?
                    </span>
                    <a className="btn-primary" onClick={this.onDelete}>
                      Delete
                    </a>
                  </div>
                </div>
              )}
              <div className="post">
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="post__content"
                ></div>
                {isPostOwner && (
                  <div className="post__edit-group-btn">
                    <a className="btn-page-control" onClick={this.updatePost}>
                      Edit
                    </a>
                    <a className="btn-delete" onClick={this.deletePost}>
                      Delete
                    </a>
                  </div>
                )}
              </div>
              <CPostFooter
                footer={post}
                postId={postId}
                socket={this.props.socket}
              />
              <CPostComment />
            </>
          );
        }
      }
    }
  )
);
