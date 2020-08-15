import React, { Component } from "react"
import { Link, NavLink } from 'react-router-dom'
import LoginPopup from '../Popup'

import logOutIcon from '../../../assets/icons/logout.png'
import logOutWhiteIcon from '../../../assets/icons/white-logout.png'

import demo from '../../../assets/img/avatar-demo.jpg'

export default class MainNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      path: window.location.pathname,
      // previousPath: localStorage.getItem('previousPath') 
    }

    this.openPopup = this.openPopup.bind(this)
    this.closePopup = this.closePopup.bind(this)
    // this.deletePath = this.deletePath.bind(this)
  }

  // deletePath() {
  //   localStorage.setItem('previousPath', '')
  // }

  openPopup(event) { this.setState({ isOpen: true}) }
  closePopup(event) { this.setState({ isOpen: false}) }
  clickHandler(path) {
      this.setState({ path: path })
  }

  render() {
    let { isOpen, path, previousPath } = this.state

    let colorBtn = path == '/' ? 
    'btn-transparent btn-transparent--white' :
    'btn-transparent'

    let icon = path == '/' ? 
    logOutWhiteIcon :
    logOutIcon

    // let backBtn = previousPath ? true : false

    return (
      <>
        <LoginPopup
          isOpen = {isOpen}  
          onClose = {this.closePopup}
        />
        <div className="main-nav">
          {/* {backBtn && (
            <Link onClick={this.deletePath()} to={previousPath} className='btn-arr btn-arr--left'>&larr; Back</Link>
          )} */}
          <div className='main-nav__content'>
            <nav className="main-nav__nav">
              <NavLink onClick={() => this.clickHandler('/')} exact to="/" activeClassName='btn-transparent--current' className={colorBtn}>Home</NavLink>
              <NavLink onClick={() => this.clickHandler('/destinations')} to="/destinations" activeClassName='btn-transparent--current' className={colorBtn}>Destinations</NavLink>
              <NavLink onClick={() => this.clickHandler('/review')} to="/review" activeClassName='btn-transparent--current' className={colorBtn}>Review</NavLink>
            </nav>
            <div className="main-nav__log-in-status">
              <a onClick = {this.openPopup} className="btn-primary">Log in</a>
            </div>
            {/* <div className="main-nav__log-in-status">
              <NavLink onClick={() => this.clickHandler('/:userId')} to='/:userId' className='btn-avatar'>
                <img src={demo} className='avatar-icon' alt='Avatar'></img>
              </NavLink>
              <a className="btn-logout">
                <img src={icon} className='logout-icon' alt='Logout'></img>
              </a>
            </div> */}
          </div>
        </div>
      </>
    )
  }
}
