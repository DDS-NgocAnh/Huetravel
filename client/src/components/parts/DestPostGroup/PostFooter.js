import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import flowerIcon from '../../../assets/icons/flower.png'
import rockIcon from '../../../assets/icons/rock.png'

import { react, isUserInArr, toastNoti, updateSocket } from '../../../utils'
import * as actionTypes from '../../../store/actions/actionTypes'
import anonymousAvatar from '../../../assets/img/avatar-default.png'

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
(class PostFooter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            flowers: 'react--none',
            rocks: 'react--none',
            noteMessage: '',
            errorMessage: ''
        }

        this.react = react.bind(this)
        this.renderLink = this.renderLink.bind(this)
        this.isReact = this.isReact.bind(this)
        this.toastNoti = toastNoti.bind(this)
        this.updateSocket = updateSocket.bind(this)
        this.isUserInArr = isUserInArr.bind(this)
    }

    componentDidMount() {
        let { flowers, rocks } = this.isReact(this.state, this.props)
        this.setState({flowers, rocks})
    }

    isReact(state, props) {
        let { currentUser, isLoggedIn } = this.props
        let footer = state.post || props.footer

        let flowers, rocks

        if(isLoggedIn) {
            let hasUserInFlowers = this.isUserInArr(footer.flowers, currentUser.id)
            flowers = hasUserInFlowers ? 
            'react--reacted' : 'react--none'

            let hasUserInRocks = this.isUserInArr(footer.rocks, currentUser.id)
            rocks = hasUserInRocks ? 
            'react--reacted' : 'react--none'
        }

        return {flowers, rocks}
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        this.toastNoti(nextState)
        this.updateSocket('post', `returnPostOf${this.state.postId}`)
        if(!nextProps.isLoggedIn) {
            nextState.flowers = 'react--none'
            nextState.rocks = 'react--none'
        }

        if(nextProps.isLoggedIn) {
            let {flowers, rocks} = this.isReact(nextState, nextProps)
            nextState.flowers = flowers || this.state.flowers
            nextState.rocks = rocks || this.state.rocks
        }
      }

    renderLink() {
        let footer  = this.state.post || this.props.footer;

        let avatar = footer.writer ? footer.writer.avatar : anonymousAvatar
        let name = footer.writer ? footer.writer.name : "Anonymous";
        let userProfileLink = footer.writer ? `/${footer.writer._id}` : ""

        if (userProfileLink) {
            return (
            <Link to={userProfileLink} className='post-footer__writer-info'>
                <img src={avatar} alt='Writer' className='post-footer__writer-photo'></img>
                <span className='post-footer__writer-name'>{name}</span>
            </Link>
            );
        } else {
            return (
            <div className='post-footer__writer-info'>
                <img src={avatar} alt='Writer' className='post-footer__writer-photo'></img>
                <span className='post-footer__writer-name'>{name}</span>
            </div>
            );
        }
    }
    
    render() {
        let { footer } = this.props;
        let renderLink = this.renderLink()
        let { flowers, rocks } = this.state

        return (
            <div className='post-footer'>
                <div className='post-footer__reaction'>
                    <h4 className='post-footer__title'>Reactions</h4>
                    <div className='post-footer__reaction-content'>
                        <div className={'post-footer__reaction-box ' + flowers}
                        onClick={() => this.react('flowers', footer._id, this.props.currentUser.id)}>
                            <img src={flowerIcon} alt='flower' className='reaction-box__icon'/>
                            <span className='reaction-box__title'>Give a flower</span>
                        </div>
                        <div className={'post-footer__reaction-box ' + rocks}
                        onClick={() => this.react('rocks', footer._id, this.props.currentUser.id)}>
                            <img src={rockIcon} alt='rock' className='reaction-box__icon'/>
                            <span className='reaction-box__title'>Throw a rock</span>
                        </div>
                    </div>
                </div>
                <div className='post-footer__spacer'></div>
                <div className='post-footer__writer'>
                    <h4 className='post-footer__title'>Written by</h4>
                    {renderLink}
                </div>
            </div>
        )
    }
})