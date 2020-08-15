import React, { Component } from 'react'
import CFooter from '../components/parts/Footer'
import CHeadingPrimary from '../components/pieces/HeadingPrimary'
import CBorderBtn from '../components/pieces/BorderBtn'

export default class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
        <section className="section-home">
            <CHeadingPrimary />
            <CBorderBtn />
            <CFooter />
        </section>
    )
  }
}
