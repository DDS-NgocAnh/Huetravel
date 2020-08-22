import * as actionTypes from '../actions/actionTypes'

const initialState = {
    socket: {}
}

export default function(state = initialState, action) {
    switch(action.type) {
        case actionTypes.CONNECT_SOCKET:
            return {
                ...state,
                socket: action.payload
            }

        default:
            return state
    }
}