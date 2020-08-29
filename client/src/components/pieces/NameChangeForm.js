import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import { validateName, trimValue, toastNoti } from "../../utils";

export default withRouter(
  class NameChangeForm extends Component {
    constructor(props) {
      super(props);

      this.state = {
        userId: props.match.params.userId,
        userName: props.userName,
        placeholder: "",
        isVisibled: false,
        isDisabled: true,
        btnChange: "Change",
        btnDisabled: "",
        inputStyle: "input u-margin-bottom-tiny ",
      };

      this.changeHandler = this.changeHandler.bind(this);
      this.submitHandler = this.submitHandler.bind(this);
      this.validateName = validateName.bind(this);
      this.toastNoti = toastNoti.bind(this);
      this.trimValue = trimValue.bind(this);
      this.inputHandler = this.inputHandler.bind(this);
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
      let oldState = this.state;
      if (nextProps.userName && nextProps.userName != oldState.userName) {
        nextState.userName = nextProps.userName;
      }

      this.toastNoti(nextState);
    }

    UNSAFE_componentWillMount() {
      this.props.socket.on(
        `returnUserProfileOf${this.state.userId}`,
        (data) => {
          if (data.error) {
            this.setState({ errorMessage: data.error });
          } else {
            this.setState({ userName: data.name });
          }
        }
      );
    }

    inputHandler(event) {
      event.preventDefault();
      let { name, value } = event.target;

      this.setState({
        [name]: value,
      });
    }

    changeHandler() {
      let btnChange = this.state.btnChange == "Change" ? "Later" : "Change";
      this.setState({
        isVisibled: !this.state.isVisibled,
        btnChange: btnChange,
        isDisabled: !this.state.isDisabled,
      });
    }

    submitHandler(event) {
      event.preventDefault();
      let { newUserName } = this.state;
      let errorStyle = "input u-margin-bottom-tiny input--error";

      let check1 = this.validateName(newUserName, "nameInput", errorStyle);
      if (check1) {
        this.setState({
          btnDisabled: "disabled",
          isDisabled: true,
        });

        let newName = {
          name: trimValue(newUserName),
        };

        axios
          .post("/api/user/change-name", newName)
          .then((res) => {
            this.props.socket.emit("changeName", this.props.userId);
            this.setState({
              userName: newName.name,
              successMessage: res.data.message,
              isVisibled: false,
              btnDisabled: "",
              isDisabled: true,
              btnChange: "Change",
              inputStyle: "input u-margin-bottom-tiny ",
            });
          })
          .catch((err) => {
            this.setState({
              errorMessage: err.message || err.response.data.message,
              btnDisabled: "",
              isDisabled: false,
              inputStyle: "input u-margin-bottom-tiny input--error",
            });
          });
      }
    }

    render() {
      let {
        isDisabled,
        userName,
        btnChange,
        isVisibled,
        btnDisabled,
        inputStyle,
        placeholder,
      } = this.state;

      let isCurrentUser = this.props.isCurrentUser;

      let disabled = isDisabled ? "disabled" : "";

      return (
        <div className="name-change-form">
          <form onSubmit={this.submitHandler}>
            <h4 className="form__title heading-tertiary">NAME</h4>
            {!isVisibled ? (
              <input
                ref={(ref) => (this.currentUser = ref)}
                name="newUserName"
                className="input input--primary u-margin-bottom-tiny"
                value={userName}
                disabled={disabled}
              />
            ) : (
              <input
                ref={(ref) => (this.nameInput = ref)}
                name="newUserName"
                className={inputStyle}
                placeholder={placeholder}
                defaultValue={userName}
                onChange={this.inputHandler}
                disabled={disabled}
              />
            )}
          </form>
          {isCurrentUser && (
            <button
              className="btn-page-control u-margin-right-tiny u-margin-top-small"
              onClick={this.changeHandler}
              disabled={btnDisabled}
            >
              {btnChange}
            </button>
          )}
          {isCurrentUser && isVisibled && (
            <button
              type="submit"
              className="btn-page-control u-margin-top-small"
              onClick={this.submitHandler}
              disabled={btnDisabled}
            >
              Change
            </button>
          )}
        </div>
      );
    }
  }
);
