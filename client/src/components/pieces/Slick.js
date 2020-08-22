import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import CDestBox from './DestBox'

export default 
withRouter(class Slick extends Component {
    constructor(props = { title }) {
        super(props)
        this.state = {
            userId: props.match.params.userId
        }

    }

    render() {
        let { title } = this.props
        let posts = this.props[title]

        let link = `${this.state.userId}/${title}` 

        if(posts && posts.length) {
            let isSeeAll = posts.length > 4 ? true : false
            posts = posts.slice(0,4)
            return (
                <div className='slick'>
                    <div className='slick__title'>
                        <h5 className='heading-tertiary'>{title}</h5>
                        {isSeeAll && (
                            <Link to={link} className='btn-arr btn-arr--right'>See all &rarr;</Link>
                        )}
                    </div>
                    <div className='slick__content'> 
                        {posts.map( post => {
                            return (
                                <CDestBox 
                                isUserProfile={true}
                                key={post._id} 
                                info={post}/>
                            )
                        })
                        }      
                    </div>
                </div>
            )
        } else {
            return (
                <div className='slick'>
                    <div className='slick__title'>
                        <h5 className='heading-tertiary'>{title}</h5>
                    </div>
                    <div className='slick__content'>
                        <h2 className='u-center-text u-text-bold u-center-el u-color-light'>No post found</h2>     
                    </div>
                </div>
            )
        }


    }
})