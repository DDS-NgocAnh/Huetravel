import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

import CFileUpload from '../components/pieces/FileUpload'
import CNameChangeForm from '../components/pieces/NameChangeForm'
import CAssets from '../components/pieces/Assets'
import CPwdChangeForm from '../components/pieces/PwdChangeForm'

import CSlick from '../components/pieces/Slick'

export default 
withRouter(class Userprofile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: props.match.params.userId,
            user: {},
        }

        this.callApiUser = this.callApiUser.bind(this)
    }

    componentDidMount() {
        let state = this.state
        this.callApiUser(state)
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
        let { user } = this.state
        return (
            <section className='section-user-profile u-margin-horizontal-5'>
                <div className='user__info u-margin-bottom-medium'>
                    <CFileUpload
                    defaultImg={user.avatar}
                    className='user__avatar' 
                    />
                    <CNameChangeForm
                     />
                    <CAssets
                    flowers={user.flowersTotal}
                    rocks={user.rocksTotal}/>
                    <CPwdChangeForm />
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
})