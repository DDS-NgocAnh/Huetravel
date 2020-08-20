import React, { Component } from 'react'

export default class PageControl extends Component {
    constructor(props = {count, pageIndex, setPageConfig}) {
        super(props)

        this.state = {
          genPageIndex: 1
        }
    
        this.toPage = this.toPage.bind(this)
      }
    
      genPages(pageIndex, maxPage) {
        let result = [pageIndex]
        for(let i = 1; i < 4; i++) {
          let pageIndexNumber = pageIndex + i
          if(pageIndexNumber > maxPage) {
            break
          } else {
            result.push(pageIndexNumber)
          }
        }
        return result
      }
    
      toPage(newPageIndex, maxPage) {
        if(newPageIndex > 0
          && newPageIndex <= maxPage) {
          
          this.props.setQueryConfig({ pageIndex: newPageIndex })
        }
      }

      genNewPages(genPageIndex, maxGenIndex) {
        if(genPageIndex <= maxGenIndex && genPageIndex > 0) {
          this.props.setQueryConfig({ pageIndex: genPageIndex * 3 - 2 })
          this.setState({genPageIndex: genPageIndex})
        }
      }

    render() {
        let { count, pageIndex } = this.props
        let { genPageIndex } = this.state
        let maxPage = Math.ceil(count / 10)
        let maxGenIndex = Math.ceil(maxPage / 3)
        let pageIndexNumbers = this.genPages(1, maxPage)
        let displayPages = pageIndexNumbers.slice(genPageIndex * 3 - 3, genPageIndex * 3)

        return (
        <>
            <a 
            className='btn-page-control'
            onClick={() => this.genNewPages(genPageIndex - 1, maxGenIndex)}>
                Previous
            </a>
            <div className='page-control__pages'>
                {displayPages.map(number => {
                    let isCurrentPageIndex = number == pageIndex
                    let clickHandler = () => this.toPage(number, maxPage)
                    return isCurrentPageIndex
                        ? (
                        <a className='btn-page btn-page--current'
                        key={number}
                        onClick={clickHandler}
                        >{number}</a>)
                        : (
                        <a className='btn-page'
                        onClick={clickHandler}
                        key={number}
                        >{number}</a>
                        )
                    })}
            </div>    
            <a 
            className='btn-page-control'
            onClick={() => this.genNewPages(genPageIndex + 1, maxGenIndex)}>
                Next
            </a>
        </>
        )
    }
}
