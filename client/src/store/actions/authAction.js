import { SET_CURRENT_USER, LOGOUT } from './actionTypes'
import { setAuthToken, removeAuthToken } from '../../utils'
import jwt_decode from 'jwt-decode'

export const login = (token) => {
    try {
        const decoded = jwt_decode(token)
        setAuthToken(token)
        return {
            type: SET_CURRENT_USER,
            payload: decoded
        }     
    } catch (error) {
        return {
            type: SET_CURRENT_USER,
        }
    }
}

export const logout = () => {
    removeAuthToken()
    return {
        type: LOGOUT
    }
}

