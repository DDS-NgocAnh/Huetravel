import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import locationIcon from "../../../assets/icons/location.png";
import flowerIcon from "../../../assets/icons/flower.png";
import rockIcon from "../../../assets/icons/rock.png";
import Bookmark from "../../../assets/icons/bookmark.svg";

import * as actionTypes from "../../../store/actions/actionTypes";
import {
  getFormatedDate,
  isUserInArr,
  bookmark,
  toastNoti,
  updateSocket,
} from "../../../utils";

import anonymousAvatar from "../../../assets/img/avatar-default.png";
import "react-toastify/dist/ReactToastify.css";

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
    onOpen: () => dispatch({ type: actionTypes.OPEN_POPUP }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class PostHeader extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isBookmark: "bookmark--unnoted",
        noteMessage: "",
        errorMessage: "",
      };

      this.renderLink = this.renderLink.bind(this);
      this.bookmark = bookmark.bind(this);
      this.toastNoti = toastNoti.bind(this);
      this.updateSocket = updateSocket.bind(this);
      this.isBookmark = this.isBookmark.bind(this);
      this.isUserInArr = isUserInArr.bind(this);
    }

    componentDidMount() {
      let isBookmark = this.isBookmark(this.state, this.props);
      this.setState({ isBookmark });
      this.updateSocket('post', `returnPostOf${this.state.postId}`)
    }

    isBookmark(state, props) {
      let { isLoggedIn, currentUser } = props;

      let header = state.post || props.header;

      let isBookmark = "bookmark--unnoted";
      if (isLoggedIn && header.notes) {
        let hasPostInNotes = this.isUserInArr(header.notes, currentUser.id);
        isBookmark = hasPostInNotes ? "bookmark--noted" : "bookmark--unnoted";
      }

      return isBookmark;
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
      this.toastNoti(nextState);

      if (!nextProps.isLoggedIn) {
        nextState.isBookmark = "bookmark--unnoted";
      }

      if (nextProps.isLoggedIn && nextProps.currentUser.id != this.props.currentUser.id) {
        let isBookmark = this.isBookmark(nextState, nextProps);
        nextState.isBookmark = isBookmark;
      }
    }

    renderLink() {
      let header = this.state.post || this.props.header;

      let avatar = header.writer ? header.writer.avatar : anonymousAvatar;
      let name = header.writer ? header.writer.name : "Anonymous";
      let date = getFormatedDate(header.date);
      let userProfileLink = header.writer ? `/${header.writer._id}` : "";

      if (userProfileLink) {
        return (
          <Link to={userProfileLink} className="post-header__info-writer">
            <img src={avatar} alt="Writer" className="info-writer__photo"></img>
            <div>
              <span className="info-writer__name">{name}</span>
              <span className="info-writer__published-date">{date}</span>
            </div>
          </Link>
        );
      } else {
        return (
          <div className="post-header__info-writer">
            <img src={avatar} alt="Writer" className="info-writer__photo"></img>
            <div>
              <span className="info-writer__name">{name}</span>
              <span className="info-writer__published-date">{date}</span>
            </div>
          </div>
        );
      }
    }

    render() {
      let header = this.state.post || this.props.header;
      let { isBookmark } = this.state;

      let renderLink = this.renderLink();

      let flower =
        header.flowersTotal > 1
          ? `${header.flowersTotal} flowers`
          : `${header.flowersTotal} flower`;
      let rock =
        header.rocksTotal > 1
          ? `${header.rocksTotal} rocks`
          : `${header.rocksTotal} rock`;

      return (
        <div className="post-header">
          <div className="post-header__bookmark">
            <Bookmark
              onClick={() => this.bookmark(header._id, false)}
              className={isBookmark}
            />
          </div>
          <h1 className="post-header__title">{header.name}</h1>
          <div className="post-header__address">
            <img
              src={locationIcon}
              alt="Location"
              className="address__icon"
            ></img>
            <span className="address__info">{header.address}</span>
          </div>
          <div className="post-header__info">
            {renderLink}
            <div className="assets__content">
              <div className="assets__box">
                <img
                  src={flowerIcon}
                  alt="flower"
                  className="assets__box-icon"
                ></img>
                <span className="assets__box-name">{flower}</span>
              </div>
              <div className="assets__box">
                <img
                  src={rockIcon}
                  alt="rock"
                  className="assets__box-icon"
                ></img>
                <span className="assets__box-name">{rock}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
);
