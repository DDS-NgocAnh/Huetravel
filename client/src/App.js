import React, { Component, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import io from 'socket.io-client'
import { connect } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'

import Loading from './components/pieces/Loading'
import { connectSocket } from './store/actions/socketAction'
import Routes from './Routes'

let socket
const ENDPOINT = 'http://localhost:9000'

// console.log(
//   `TODO:
//   4. cleanArray in server/ultis not work with includes
//   5.(optional) update refreshToken
//   6.(optional) update socket with jwt (dont use restfulAPI anymore)`
// );


class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    socket = io(ENDPOINT)
    this.props.onSocket(socket)
  }

  render() {
    return (
        <Router>
          <Suspense fallback={<Loading/>}>
            <ToastContainer
                  position="top-center"
                  autoClose={1000}
                  hideProgressBar
                  newestOnTop={false}
                  rtl={false}
                  draggable={false}
              />
              <Routes />
          </Suspense>
        </Router>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSocket: (socket) => dispatch(connectSocket(socket)),
  }
}

export default connect(null, mapDispatchToProps)(App)