import React, { Component, Suspense } from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import io from 'socket.io-client'
import { connect } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'

import Loading from './components/pieces/Loading'
import { connectSocket } from './store/actions/socketAction'
import Routes from './Routes'

import { changeAvatar } from './store/actions/authAction'


let socket
const ENDPOINT = 'http://localhost:9000'

console.log(
  `TODO:
  1.socket update totalFlowers/Rocks in userProfile when user react Post
  2.socket update post when writer update post
  3.update nitifications
  4.update comment/reply
  5.socket update postTotalFlowers/postTotalRocks when user react
  6.socket update no found post when writer delete post
  7.(optional) update refreshToken
  8.(optional) update socket with jwt (dont use restfulAPI anymore)`
);


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