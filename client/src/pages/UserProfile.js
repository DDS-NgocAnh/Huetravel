import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import CFileUpload from '../components/pieces/FileUpload'
import CNameChangeForm from '../components/pieces/NameChangeForm'
import CAssets from '../components/pieces/Assets'
import CPwdChangeForm from '../components/pieces/PwdChangeForm'

import CSlick from '../components/pieces/Slick'



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

        this.callApiUser = this.callApiUser.bind(this)
        this.updateSocket = this.updateSocket.bind(this)
    }

    componentDidMount() {
        let state = this.state
        this.callApiUser(state)
    }

    UNSAFE_componentWillUpdate() {
        this.updateSocket('getAvatar', 'avatar')
        this.updateSocket('getNotes', 'notes')
        this.updateSocket('getReviews', 'reviews')
    }

    updateSocket(socketName, updatedField) {
        this.props.socket.on(socketName, data => {
            if(data.error) {
                this.setState({errorMessage: data.error})
            } else {
                this.setState({
                    ...this.state,
                    user: {
                        ...this.state.user,
                        [updatedField]: data[updatedField]
                    }})
            }
        })
    }

    callApiUser(state) {
        let { userId } = state
        axios.request({
            url: `http://localhost:9000/api/user/${userId}`,
            method: 'GET'
        }
        ).then(res => {
            this.setState({
                user: res.data
            })
        })
        .catch(err => {
            console.log(err.message || err.response.data.message);
        })
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