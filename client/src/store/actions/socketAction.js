import { CONNECT_SOCKET } from './actionTypes'

export const connectSocket = (socket) => {
        return {
            type: CONNECT_SOCKET,
            payload: socket
        }
}