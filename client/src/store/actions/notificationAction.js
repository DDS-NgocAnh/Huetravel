import { JUMP_TO_COMMENT } from './actionTypes'

export const jumpToComment = (commentId, isReply, date) => {
        return {
            type: JUMP_TO_COMMENT,
            payload: {commentId, isReply, date}
        }
}