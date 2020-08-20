import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import flowerIcon from '../../assets/icons/flower.png'
import rockIcon from '../../assets/icons/rock.png'
import locationIcon from '../../assets/icons/location.png'

import Bookmark from '../../assets/icons/bookmark.svg'

import * as actionTypes from '../../store/actions/actionTypes'

import { bookmark, isUserInArr, toastNoti } from '../../utils'

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.currentUser.isLoggedIn,
        currentUser: state.currentUser.userData,
        isOpen: state.popup.isOpen
    }
}

const mapDispatchToProps = dispatch => {
  return {
    onOpen: () => dispatch({type: actionTypes.OPEN_POPUP})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
(class DestBox extends Component {
    constructor(props) {
        super(props)
        let { info, currentUser } = this.props

        let isBookmark = 'bookmark--unnoted'
        if(this.props.isLoggedIn && info.notes) {
            let hasPostInNotes = isUserInArr(info.notes, currentUser.id)
            isBookmark = hasPostInNotes ? 
            'bookmark--noted' : 'bookmark--unnoted'
        }

        this.state = {
            isBookmark: isBookmark,
            successMessage: '',
            errorMessage: ''
        }

        this.bookmark = bookmark.bind(this)
        this.toastNoti = toastNoti.bind(this)
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        this.toastNoti(nextState)
      }

    render() {
        let { isBookmark } = this.state

        let info = this.props.info
        let link = '/destinations/' + info._id
        return (
            <div className='dest-box'>
                <div className='dest-box__bookmark'>
                    <Bookmark 
                    onClick={() => this.bookmark(info._id)}
                    className={isBookmark}
                    />
                </div>
                <div className='dest-box__react'>
                    <div className='react-box'>
                        <img src={flowerIcon} className='react-box__icon' alt='Flower'></img>
                        <span className='react-box__info'>{info.flowersTotal}</span>
                    </div>
                    <div className='react-box'>
                        <img src={rockIcon} className='react-box__icon' alt='Rock'></img>
                        <span className='react-box__info'>{info.rocksTotal}</span>
                    </div>
                </div>
                <img src={info.avatar} className='dest-box__photo' alt='Destination photo'></img>
                <div className='dest-box__info'>
                    <h4 className='dest-box-info__heading'>{info.name}</h4>
                    <div className='dest-box-info__address'>
                        <img src={locationIcon} className='dest-box-info__address-icon' alt='Location'></img>
                        <span className='dest-box-info__address-info'>{info.address}</span>
                    </div>
                    <Link to={link} className='dest-box-info__btn'>
                        <div className='btn-arr btn-arr--right'>Know more <span className='btn-arr--yellow'>&rarr;</span> </div>
                    </Link>
                </div>
            </div>
        )
    }
})