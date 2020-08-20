import { combineReducers } from 'redux'
import loginReducer from './authReducer'
import popupReducer from './popupReducer'
import postReducer from './postReducer'


export default combineReducers({
    currentUser: loginReducer,
    popup: popupReducer,
    postUpdate: postReducer,
})