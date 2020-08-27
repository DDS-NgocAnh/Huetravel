import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CPhotoUpload from "./PhotoUpload";
import CCategoryOptions from "./CategoryOptions";
import CDestNameInput from "./DestNameInput";
import CDestAddressInput from "./DestAddressInput";
import CTextEditor from "./TextEditor";

import { validateBlank, trimValue, toastNoti } from "../../../utils";
import imageDefault from "../../../assets/img/image-default.png";
import * as actionTypes from "../../../store/actions/actionTypes";

import "react-toastify/dist/ReactToastify.css";

const mapStateToProps = (state) => {
  return {
    postData: state.postUpdate.postData,
    isUpdate: state.postUpdate.isUpdate,
    socket: state.socket.socket,
    currentUser: state.currentUser.userData,
    isLoggedIn: state.currentUser.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateDone: () => dispatch({ type: actionTypes.UPDATE_DONE }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(
    class ReviewGroup extends Component {
      constructor(props) {
        super(props);

        let category = "attraction";
        if (this.props.isUpdate) {
          category = this.props.postData.category;
        }

        this.state = {
          placeholder: "",
          isDisabled: false,
          name: "",
          address: "",
          content: "",
          avatar: imageDefault,
          category: category,
          nameError: false,
          addressError: false,
          textEditorError: false,
          successMessage: "",
          errorMessage: "",
          reset: false,
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.setError = this.setError.bind(this);
        this.validateBlank = validateBlank.bind(this);
        this.getFilePath = this.getFilePath.bind(this);
        this.trimValue = trimValue.bind(this);
        this.toastNoti = toastNoti.bind(this);
      }

      componentDidMount() {
        if (this.props.isUpdate) {
          let {
            name,
            address,
            content,
            avatar,
            category,
          } = this.props.postData;
          this.setState({ name, address, content, avatar, category });
        }
      }

      changeHandler(data) {
        for (let value of Object.entries(data)) {
          this.setState({
            [value[0]]: value[1],
          });
        }
      }

      getFilePath(data) {
        this.setState({
          avatar: data,
        });
      }

      UNSAFE_componentWillUpdate(nextProps, nextState) {
        this.toastNoti(nextState);
      }

      submitHandler(event) {
        event.preventDefault();

        let { name, address, content } = this.state;

        let check1 = this.validateBlank(name, "nameInput");
        let check2 = this.validateBlank(address, "addressInput");
        let check3 = this.validateBlank(content, "textEditorInput");

        this.setError(check1, "nameError");
        this.setError(check2, "addressError");

        if (!check3) {
          this.setState({ textEditorError: true });
        } else {
          this.setState({ textEditorError: false });
        }

        if (check1 && check2 && check3) {
          this.setState({
            isDisabled: true,
            reset: false,
          });
          let { name, address, content, avatar, category } = this.state;
          let post = {
            name: trimValue(name),
            address: trimValue(address),
            content: trimValue(content),
            avatar: trimValue(avatar),
            category: trimValue(category),
          };

          let url = "/api/post/";
          let method = "post";
          if (this.props.isUpdate) {
            url = `/api/post/${this.props.postData.id}`;
            method = "put";
          }

          axios
            .request({
              url: url,
              method: method,
              data: post,
            })
            .then((res) => {
              let updateMessage = "";
              let successMessage = "";

              if (this.props.isLoggedIn) {
                this.props.socket.emit(
                  "createReview",
                  this.props.currentUser.id
                );
              }

              if (this.props.isUpdate) {
                updateMessage = res.data.message;
                this.props.socket.emit("updatePost", this.props.postData.id);
                this.props.history.push(
                  `/destinations/${this.props.postData.id}`
                );
                this.props.updateDone();
              } else {
                successMessage = res.data.message;
              }
              this.setState({
                updateMessage,
                successMessage,
                errorMessage: "",
              });
            })
            .catch((err) => {
              this.setState({
                successMessage: "",
                updateMessage: "",
                errorMessage: err.message || err.response.data.message,
              });
            })
            .finally(() => {
              this.setState({
                isDisabled: false,
                reset: true,
              });
            });
        }
      }

      setError(condition, state) {
        if (!condition) {
          this.setState({ [state]: true });
        } else {
          this.setState({ [state]: false });
        }
      }

      render() {
        let {
          isDisabled,
          nameError,
          addressError,
          name,
          address,
          avatar,
          content,
          category,
          reset,
        } = this.state;

        let disabled = isDisabled ? "disabled" : "";

        return (
          <>
            <form
              ref={(ref) => (this.form = ref)}
              className="review u-margin-horizontal-5"
            >
              <div className="review__photo">
                <CPhotoUpload
                  avatar={avatar}
                  reset={reset}
                  disabled={disabled}
                  onChange={this.getFilePath}
                />
              </div>
              <div className="review__input-group">
                <CCategoryOptions
                  category={category}
                  reset={reset}
                  name="addressInput"
                  disabled={disabled}
                  onChange={this.changeHandler}
                />
                <CDestNameInput
                  name={name}
                  ref={(ref) => (this.nameInput = ref)}
                  reset={reset}
                  disabled={disabled}
                  error={nameError}
                  onChange={this.changeHandler}
                />
                <CDestAddressInput
                  address={address}
                  reset={reset}
                  ref={(ref) => (this.addressInput = ref)}
                  error={addressError}
                  disabled={disabled}
                  onChange={this.changeHandler}
                />
                <div className="text-editor u-margin-bottom-medium">
                  <CTextEditor
                    content={content}
                    reset={reset}
                    ref={(ref) => (this.textEditorInput = ref)}
                    disabled={disabled}
                    onChange={this.changeHandler}
                  />
                </div>
                <div className="review__submit">
                  <button
                    type="submit"
                    disabled={disabled}
                    onClick={this.submitHandler}
                    className="btn-page-control"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          </>
        );
      }
    }
  )
);
