import React, { Component, lazy } from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'))
const Destinations = lazy(() => import('./pages/Destinations'))
const DestinationPost = lazy(() => import('./pages/DestinationPost'))
const Review = lazy(() => import('./pages/Review'))
const UserProfile = lazy(() => import('./pages/UserProfile'))
const MainNav = lazy(() => import('./components/parts/MainNav'))


class Routes extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
    <>
      <Route path="/"><MainNav/></Route>
      <Switch>
        <Route exact path='/'><Home /></Route>
        <Route exact path='/destinations' ><Destinations /></Route>
        <Route exact path='/destinations/:postId' ><DestinationPost /></Route>
        <Route exact path='/review'><Review /></Route>
        <Route exact path='/:userId'><UserProfile /></Route>
        <Route exact path='/:userId/reviews'><Destinations title='reviews'/></Route>
        <Route exact path='/:userId/notes'><Destinations title='notes'/></Route>
      </Switch>
    </>
    )
  }
}

export default Routes
