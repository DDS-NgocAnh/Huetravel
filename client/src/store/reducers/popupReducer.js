import * as actionTypes from '../actions/actionTypes'

const initialState = {
    isOpen: false,
    login: true,
    register: false,
    isDisabled: false,
    reset: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case actionTypes.OPEN_POPUP:
            return {
                ...state,
                isOpen: true
            }

        case actionTypes.CLOSE_POPUP:
            return {
                ...state,
                isOpen: false
            }

        case actionTypes.POPUP_SUBMIT:
            return {
                ...state,
                isDisabled: true
            }
        
        case actionTypes.POPUP_SUBMIT_DONE:
            return {
                ...state,
                isDisabled: false
            }

        case actionTypes.OPEN_POPUP_LOGIN:
            return {
                ...state,
                register: false,
                login: true,
                reset: false,
            }

        case actionTypes.OPEN_POPUP_RESET:
            return {
                ...state,
                register: false,
                login: false,
                reset: true,
            }

        case actionTypes.OPEN_POPUP_REGISTER:
            return {
                ...state,
                register: true,
                login: false,
                reset: false
            }
            
        default:
            return state
    }
}