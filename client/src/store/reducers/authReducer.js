import * as actionTypes from '../actions/actionTypes'

const initialState = {
    isLoggedIn: false,
    userData: {
        id: '',
        name: '',
        avatar: ''
    },
    flowers: [],
    rocks: [],
    notes: [],
    reviews: [],
    unSeenNotifications: 0,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case actionTypes.SET_CURRENT_USER:
            return action.payload ? {
                isLoggedIn: true,
                userData: {
                    id: action.payload.id,
                    name: action.payload.name,
                    avatar: action.payload.avatar
                },
                flowers: action.payload.flowers,
                rocks: action.payload.rocks,
                notes: action.payload.notes,
                reviews: action.payload.reviews,
                unSeenNotifications: action.payload.unSeenNotifications
            } : initialState

        case actionTypes.LOGOUT:
            return initialState

        default:
            return state
    }
}