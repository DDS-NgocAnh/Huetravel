//TODO: update redux when react, note Post

import React, { Component } from "react"
import { Link, NavLink, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actionTypes from '../../../store/actions/actionTypes'
import { logout, changeAvatar } from '../../../store/actions/authAction'

import LoginPopup from '../Popup'

import logOutIcon from '../../../assets/icons/logout.png'
import logOutWhiteIcon from '../../../assets/icons/white-logout.png'

import { toastNoti } from '../../../utils'

const mapStateToProps = (state) => {
  return {
    isOpen: state.popup.isOpen,
    isLoggedIn: state.currentUser.isLoggedIn,
    currentUser: state.currentUser.userData,
    socket: state.socket.socket,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOpen: () => dispatch({
      type: actionTypes.OPEN_POPUP
    }),
    onLogout: () => dispatch(logout()),
    onChangeAvatar: (avatar) => dispatch(changeAvatar(avatar))
  }
}

export default connect(mapStateToProps, mapDispatchToProps) 
(withRouter(class MainNav extends Component {
  constructor(props) {
    super(props)

    this.state = {
      successMessage: '',
      errorMessage: ''
    }

    this.logout = this.logout.bind(this)
    this.goBack = this.goBack.bind(this)
    this.toastNoti = toastNoti.bind(this)
    this.getCurrentAvatar = this.getCurrentAvatar.bind(this)
  }

  componentDidMount() {
    this.getCurrentAvatar(this.props.currentUser.id)
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if(nextProps.isLoggedIn && nextProps.isLoggedIn != this.props.isLoggedIn) {
      this.getCurrentAvatar(nextProps.currentUser.id)
    }
  }

  getCurrentAvatar(userId) {
    this.props.socket.emit('getCurrentAvatar', userId)
    this.props.socket.on('returnCurrentAvatar', data => {
      this.props.onChangeAvatar(data.avatar)
    })
  }

  logout() {
    localStorage.removeItem('jwtToken')
    this.props.onLogout()
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const path = this.props.history.location.pathname
    let colorBtn = path == '/' ? 
    'btn-transparent btn-transparent--white' :
    'btn-transparent'

    let icon = path == '/' ? 
    logOutWhiteIcon :
    logOutIcon

    let userProfileLink
    if(this.props.isLoggedIn) {
      userProfileLink = `/${this.props.currentUser.id}`
    }
    let checkBackBtn = ['/', '/destinations', '/review', '/user']

    let backBtn = checkBackBtn.some(el=> path == el) ? 
    false : true

    return (
      <>
        <LoginPopup/>
        <div className="main-nav">
          {backBtn && (
            <a onClick={this.goBack}  className='btn-arr btn-arr--left'>&larr; Back</a>
          )}
          <div className='main-nav__content'>
            <nav className="main-nav__nav">
              <NavLink  exact to="/" activeClassName='btn-transparent--current' className={colorBtn}>Home</NavLink>
              <NavLink  to="/destinations" activeClassName='btn-transparent--current' className={colorBtn}>Destinations</NavLink>
              <NavLink  to="/review" activeClassName='btn-transparent--current' className={colorBtn}>Review</NavLink>
            </nav>
            {!this.props.isLoggedIn && (
              <div className="main-nav__log-in-status">
                <a onClick = {this.props.onOpen} className="btn-primary">Log in</a>
              </div>
            )}
            {this.props.isLoggedIn && (
              <div className="main-nav__log-in-status">
                <NavLink to={userProfileLink} className='btn-avatar'>
                  <img src={this.props.currentUser.avatar} className='avatar-icon' alt='Avatar'></img>
                </NavLink>
                <a className="btn-logout" onClick={this.logout}>
                  <img src={icon} className='logout-icon' alt='Logout'></img>
                </a>
              </div> 
            )}
          </div>
        </div>
      </>
    )
  }
}))
