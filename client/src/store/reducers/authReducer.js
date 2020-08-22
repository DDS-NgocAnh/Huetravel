import * as actionTypes from '../actions/actionTypes'

const initialState = {
    isLoggedIn: false,
    userData: {
        id: '',
        avatar: ''
    },
}

export default function(state = initialState, action) {
    switch(action.type) {
        case actionTypes.SET_CURRENT_USER:
            return action.payload ? {
                isLoggedIn: true,
                userData: {
                    ...state.userData,
                    id: action.payload.id,
                },
            } : initialState

        case actionTypes.LOGOUT:
            return initialState
        
        case actionTypes.CHANGE_AVATAR:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    avatar: action.payload
                }
            }

        default:
            return state
    }
}