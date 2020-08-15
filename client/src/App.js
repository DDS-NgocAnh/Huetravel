import React, { Component, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import MainNav from './components/parts/MainNav'
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
              <MainNav />     
              <Routes />
          </Suspense>
        </Router>
    )
  }
}

export default App