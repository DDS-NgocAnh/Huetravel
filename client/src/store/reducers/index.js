import { combineReducers } from 'redux'
import loginReducer from './authReducer'
import popupReducer from './popupReducer'
import postReducer from './postReducer'
import socketReducer from './socketReducer'
import notificationReducer from './notificationReducer'


export default combineReducers({
    currentUser: loginReducer,
    popup: popupReducer,
    postUpdate: postReducer,
    socket: socketReducer,
    notification: notificationReducer
})