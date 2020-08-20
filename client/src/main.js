import './scss/main.scss'
import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import jwt_decode from 'jwt-decode'

import { login, logout } from './store/actions/authAction'
import { setAuthToken } from './utils'
import App from './App'
import store from './store'

if(localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken)
  store.dispatch(login(localStorage.jwtToken))

  const decoded = jwt_decode(localStorage.jwtToken)
  
  const currentTime = Date.now() /1000
  if(decoded.exp < currentTime) {
    store.dispatch(logout())
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.querySelector('#app')
)