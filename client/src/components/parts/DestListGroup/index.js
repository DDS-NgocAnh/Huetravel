import React, { Component } from 'react'
import CDestCategories from './DestCategories'
import CSearchForm from './SearchForm'
import CDropdown from './Dropdown'
import CDestList from './DestList'
import CPageControl from './PageControl'


export default class DestListGroup extends Component {
    constructor(props = {title}) {
        super(props)
    }

    render() {
        return (
            <>
                <div className='dest-categories-container u-margin-bottom-medium'>
                    <CDestCategories />
                </div>
                <div className='filter-container u-margin-horizontal-5 u-margin-bottom-medium'>
                    <CSearchForm />
                    <h3 className='heading-secondary'>{this.props.title}</h3>
                    <CDropdown />
                </div>
                <div className='dest-list-container u-margin-horizontal-5 u-margin-bottom-big'>
                    <CDestList/>
                </div>
                <div className='page-control-container u-margin-bottom-huge'>
                    <CPageControl />
                </div>
            </>
        )
    }
}
