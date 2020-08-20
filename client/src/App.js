import React, { Component, Suspense } from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

import Loading from './components/pieces/Loading'

import Routes from './Routes'

class App extends Component {
  constructor(props) {
    super(props)
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

export default App