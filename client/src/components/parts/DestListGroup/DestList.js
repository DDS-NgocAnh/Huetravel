import React, { Component, Suspense, lazy } from 'react'
import Loading from '../../pieces/Loading'

const CDestBox = lazy(() => import('../../pieces/DestBox'))

export default class Dest extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let posts = this.props.posts
        let haveElement = posts.length > 0 ? true : false
        return (
            <>
            {haveElement && (
                posts.map((post, index) =>
                <Suspense 
                key={index}
                fallback={<Loading/>}>
                    <CDestBox 
                    isUserProfile={false}
                    info={post}/>            
                </Suspense>
                )
            )}
            {!haveElement && (
                <h2 className='u-center-text u-text-bold u-center-el u-color-light'>No post found</h2>
            )}
            </>
        )
    }
}