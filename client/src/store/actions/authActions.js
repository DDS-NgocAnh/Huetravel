import axios from 'axios'
import * as actionTypes from './types'

// Register
export const registerStart = () => {
    return {
        type: actionTypes.REGISTER_START,
        isLoading: true
    }
}

export const registerSuccess = (message) => {
    return {
        type: actionTypes.REGISTER_SUCCESS,
        successMessage: message,
        isLoading: false
    }
}

export const registerFail = (error) => {
    return {
        type: actionTypes.REGISTER_FAIL,
        errorMessage: error,
        isLoading: false
    }
}

export const register = (name, email, password) => {
    return dispatch => {
        dispatch(registerStart())

        let userData = {
            name: name,
            email: email,
            password: password
        }

        axios
            .post('http://localhost:9000/api/user/register', 
            userData)
            .then(res => {
                dispatch(registerSuccess(res.message))
            })
            .catch(err => {
                dispatch(registerFail(err.response.data.message))
            })   
    }
}