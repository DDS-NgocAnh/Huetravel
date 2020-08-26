import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import CFileUpload from '../components/pieces/FileUpload'
import CNameChangeForm from '../components/pieces/NameChangeForm'
import CAssets from '../components/pieces/Assets'
import CPwdChangeForm from '../components/pieces/PwdChangeForm'

import CSlick from '../components/pieces/Slick'
import { updateSocket } from '../utils'
 
const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser.userData,
        socket: state.socket.socket
    }
}


export default connect(mapStateToProps)
(withRouter(class Userprofile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: props.match.params.userId,
            user: {},
        }

        this.updateSocket = updateSocket.bind(this)
        this.updateProfile = this.updateProfile

    }

    componentDidMount() {
        this.props.socket.emit('getUserProfile', this.state.userId)
        this.updateProfile()
    }

    updateProfile() {
        this.props.socket.on(`returnUserProfileOf${this.state.userId}`, data => {
            if(data.error) {
                this.setState({errorMessage: data.error})
            } else {
                this.setState({
                    user: data
                })
            }
        })
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(nextProps.match.params.userId != this.props.match.params.userId) {
            nextProps.socket.emit('getUserProfile', nextProps.match.params.userId)
            this.updateSocket('user', `returnUserProfileOf${nextProps.match.params.userId}`)
        }
    }

    componentWillUnmount() {
        this.props.socket.off(`returnUserProfileOf${this.state.userId}`)
    }

    render() {
        let { user, userId } = this.state
        let isCurrentUser = userId == this.props.currentUser.id ?
        true: false

        return (
            <section className='section-user-profile u-margin-horizontal-5'>
                <div className='user__info u-margin-bottom-medium'>
                    {isCurrentUser && (
                        <CFileUpload
                        socket={this.props.socket}
                        userId={userId}
                        isCurrentUser={isCurrentUser}
                        defaultImg={user.avatar}
                        className='user__avatar' 
                        />
                    )}
                    {!isCurrentUser && (
                    <div className='photo-upload'>
                        <img src={user.avatar} className='photo-upload__photo' alt='Photo'></img> 
                    </div>
                    )}
                    <CNameChangeForm
                    socket={this.props.socket}
                    userId={userId}
                    isCurrentUser={isCurrentUser}
                    userName = {user.name}
                     />
                    <CAssets
                    flowers={user.flowersTotal}
                    rocks={user.rocksTotal}/>
                    {isCurrentUser && (
                        <CPwdChangeForm />
                    )}
                </div>
                <div className='user__posts'>
                    <CSlick 
                    reviews={user.reviews}
                    title='reviews'/>
                    <CSlick 
                    notes={user.notes}
                    title='notes'/>
                </div>
            </section>
        )
    }
}))