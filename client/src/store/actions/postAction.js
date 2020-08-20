import { UPDATE_START } from './actionTypes'

export const update = (postData) => {
        return {
            type: UPDATE_START,
            payload: postData
        }
}