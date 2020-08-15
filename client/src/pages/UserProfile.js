import React, { Component } from 'react'

import CFileUpload from '../components/pieces/FileUpload'
import CNameChangeForm from '../components/pieces/NameChangeForm'
import CAssets from '../components/pieces/Assets'
import CPwdChangeForm from '../components/pieces/PwdChangeForm'


import avatarDefault from '../assets/img/avatar-default.png'
import CSlick from '../components/pieces/Slick'

export default class Userprofile extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <section className='section-user-profile u-margin-horizontal-5'>
                <div className='user__info u-margin-bottom-medium'>
                    <CFileUpload
                    className='user__avatar' 
                    defaultImg = {avatarDefault}/>
                    <CNameChangeForm />
                    <CAssets/>
                    <CPwdChangeForm />
                </div>
                <div className='user__posts'>
                    <CSlick title='reviews'/>
                    <CSlick title='notes'/>
                </div>
            </section>
        )
    }
}