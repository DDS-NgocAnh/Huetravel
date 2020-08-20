import * as actionTypes from '../actions/actionTypes'

const initialState = {
    isUpdate: false,
    postData: {}
}

export default function(state = initialState, action) {
    switch(action.type) {
        case actionTypes.UPDATE_START:
            return {
                isUpdate: true,
                postData: action.payload
            }

        case actionTypes.UPDATE_DONE:
            return {
                isUpdate: false,
                postData: {}
            }

        default:
            return state
    }
}