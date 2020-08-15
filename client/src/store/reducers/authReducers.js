import * as actionTypes from '../actions/types'

const initialState = {
    isLoggedIn: false,
    token: '',
    currentUser: {
        id: '',
        name: '',
        reviews: '',
        notes: '',
        active: '',
    },
    isLoading: false,
    users: [],
    notifications: {},
    errorMessage: '',
    successMessage: ''
}

export default function(state = initialState, action) {
    switch(action.type) {
        case actionTypes.REGISTER_START:
            return {
                ...state,
                isLoading: action.isLoading,
                errorMessage: '',
                successMessage: ''
            }

        case actionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                successMessage: action.successMessage,
                errorMessage: '',
                isLoading: action.isLoading
            }

        case actionTypes.REGISTER_FAIL:
            return {
                ...state,
                errorMessage: action.errorMessage,
                successMessage: '',
                isLoading: action.isLoading
            }
        default:
            return {
                ...state,
                errorMessage: '',
                successMessage: ''
            }
    }
}