import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function trimValue(value) {
  return value ? value.trim() : value;
}

function isBlank(value) {
  return trimValue(value) ? false : true;
}

function isMaxChar(value, maxChar) {
  if (!value) {
    return false;
  } else {
    return value.length <= maxChar ? true : false;
  }
}

function isMinChar(value, minChar) {
  if (!value) {
    return false;
  } else {
    return value.length >= minChar ? true : false;
  }
}

function inputNameHandler(value) {
  return { isBlank: isBlank(value), isMax20Char: isMaxChar(value, 20) };
}

function inputPwdHandler(value) {
  return {
    isBlank: isBlank(value),
    isMin8Char: isMinChar(value, 8),
  };
}

function checkPwd(value, checkValue) {
  return value == checkValue ? true : false;
}

function inputHandler(event) {
  const target = event.target;
  const { name, value } = target;
  this.setState({
    [name]: trimValue(value),
  });
}

function checkMatchPwd(value, valueId, checkValue, checkValueId, styleError) {
  let isEqual = value === checkValue ? true : false;
  let result = false;

  if (!isEqual) {
    this[checkValueId].className = styleError;
    this[checkValueId].value = "";
    this[checkValueId].placeholder = "Does not match";
  } else {
    result = true;
  }

  return result;
}

function validatePwd(value, inputId, styleError) {
  let { isBlank, isMin8Char } = inputPwdHandler(value);
  let { inputStyle } = this.state;
  let result = false;

  if (isBlank) {
    this[inputId].value = "";
    this[inputId].className = styleError;
  } else if (!isMin8Char) {
    this[inputId].value = "";
    this[inputId].placeholder = "At least 8 characters";
    this[inputId].className = styleError;
  } else {
    this[inputId].className = inputStyle;
    result = true;
  }

  return result;
}

function validateName(value, inputId, styleError) {
  let { isBlank, isMax20Char } = inputNameHandler(value);
  let { inputStyle } = this.state;
  let result = false;

  if (isBlank) {
    this[inputId].value = "";
    this[inputId].className = styleError;
  } else if (!isMax20Char) {
    this[inputId].value = "";
    this[inputId].className = styleError;
    this[inputId].placeholder = "Can't be over 20 characters";
  } else {
    this[inputId].placeholder = "Name (Maximum 20 characters)";
    this[inputId].className = inputStyle;
    result = true;
  }
  return result;
}

function validateEmail(value, inputId, styleError) {
  let { isBlank } = inputNameHandler(value);
  let { inputStyle } = this.state;
  let result = false;
  const regExp = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

  if (isBlank) {
    this[inputId].value = "";
    this[inputId].className = styleError;
  } else if (!regExp.test(value)) {
    this[inputId].value = "";
    this[inputId].placeholder = "Invalid email address";
    this[inputId].className = styleError;
  } else {
    this[inputId].placeholder = "Email";
    this[inputId].className = inputStyle;
    result = true;
  }
  return result;
}

function validateBlank(value, inputId, styleError) {
  let { isBlank } = inputNameHandler(value);
  let { inputStyle } = this.state;
  let result = false;

  if (isBlank) {
    this[inputId].value = "";
    this[inputId].className = styleError;
  } else {
    this[inputId].className = inputStyle;
    result = true;
  }
  return result;
}

function setAuthToken(token) {
  axios.defaults.headers.common["Authorization"] = token;
}

function removeAuthToken() {
  delete axios.defaults.headers.common["Authorization"];
}

function getFormatedDate(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  date = new Date(date);

  let monthIndex = date.getMonth();
  let monthName = months[monthIndex];

  let year = date.getFullYear();
  let dates = date.getDate();

  let hours = date.getHours();
  let minutes = date.getMinutes();

  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;

  let formattedDate = `${strTime} | ${monthName} ${dates}, ${year}`;
  return formattedDate;
}

function isUserInArr(arr, id) {
  const isExist = arr.some((el) => el.user === id);
  return isExist;
}

function bookmark(postId, isUserProfile) {
  if (this.props.isLoggedIn) {
    let { isBookmark } = this.state;
    let style =
      isBookmark == "bookmark--unnoted"
        ? "bookmark--noted"
        : "bookmark--unnoted";
    this.setState({ isBookmark: style });

    axios
      .post(`/api/post/note/${postId}`)
      .then((res) => {
        this.props.socket.emit("notePost", {
          userId: this.props.currentUser.id,
          isUserProfile,
        });
        this.setState({ noteMessage: res.data.message });
      })
      .catch((err) => {
        let errorMessage = err.message || err.response.data.message;
        this.setState({ errorMessage });
      });
  } else {
    this.props.onOpen();
  }
}

function react(reactIcon, postId, userId) {
  if (this.props.isLoggedIn) {
    let toggleIcon = reactIcon == "flowers" ? "rocks" : "flowers";
    let style =
      this.state[reactIcon] == "react--none" ? "react--reacted" : "react--none";
    let toggleStyle = style == "react--none" ? "react--reacted" : "react--none";
    this.setState({ [reactIcon]: style });

    if (this.state[reactIcon] != "react--reacted") {
      this.setState({ [toggleIcon]: toggleStyle });
    }

    this.props.socket.emit("reactPost", {
      userId: userId,
      postId: postId,
      reactIcon: reactIcon,
    });
  } else {
    this.props.onOpen();
  }
}

function updateSocket(stateField, socketName) {
  this.props.socket.on(socketName, (data) => {
    if (data.error) {
      this.setState({
        errorMessage: data.error,
        [stateField]: "",
      });
    } else {

      this.setState({
        [stateField]: data,
        successMessage: data.successMessage,
      });
    }
  });
}

function toastNoti(nextState) {
  if (nextState.successMessage) {
    toast(nextState.successMessage);
    nextState.successMessage = "";
  }
  if (nextState.noteMessage) {
    toast(nextState.noteMessage);
    nextState.noteMessage = "";
  }
  if (nextState.errorMessage) {
    toast.error(nextState.errorMessage);
    nextState.errorMessage = "";
  }
  if (nextState.updateMessage) {
    toast(nextState.updateMessage);
    nextState.updateMessage = "";
  }
}

export {
  inputNameHandler,
  inputPwdHandler,
  inputHandler,
  checkPwd,
  trimValue,
  checkMatchPwd,
  validatePwd,
  validateName,
  validateEmail,
  validateBlank,
  setAuthToken,
  removeAuthToken,
  getFormatedDate,
  isUserInArr,
  bookmark,
  react,
  toastNoti,
  updateSocket,
};
