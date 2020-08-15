import { combineReducers } from 'redux'
import authReducers from './authReducers'
import postReducers from './postReducers'
// import notificationReducers from './notificationReducers'


export default combineReducers({
    users: authReducers,
    posts: postReducers,
    // notifications: notificationsReducers,
})