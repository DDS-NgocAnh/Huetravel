import * as actionTypes from "../actions/actionTypes";

const initialState = {
  isJumpToComment: false,
  commentId: "",
  isReply: "",
  date: "",
  commentStyle: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.JUMP_TO_COMMENT:
      let commentStyle = action.payload.isReply ? true : false;
      return {
        isJumpToComment: true,
        commentId: action.payload.commentId,
        isReply: action.payload.isReply,
        date: action.payload.date,
        commentStyle: commentStyle,
      };

    case actionTypes.JUMP_TO_COMMENT_DONE:
      return initialState;

    case actionTypes.JUMP_TO_REPLY_DONE:
      return {
        ...state,
        isReply: false
      };

    default:
      return state;
  }
}
