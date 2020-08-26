import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const config = {
    placeholder: 'Write your review',
    toolbar: ['bold', 'italic', 'imageUpload',
    'bulletedList', 'numberedList', 'link'],
    ckfinder: {
        uploadUrl: 'http://localhost:9000/api/upload/ckfinder',
    },
}


export default class TextEditor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            content: ''
        }

        this.ckEditorHandler = this.ckEditorHandler.bind(this)
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        let oldProps = this.props
        if(nextProps.reset && nextProps.reset != oldProps.reset) {
            this.setState({
                content: ''
            })
        }
    }

    ckEditorHandler(event, editor) {
        const data = editor.getData()
        this.setState({ content: data.trim() }, () => {
            if(this.props.onChange) {
                this.props.onChange(this.state)
            }
        })
    }

    render() {
        let { content } = this.state
        if(!this.props.reset) {
            content = this.props.content || this.state.content
        }
        return (
            <CKEditor
            config={config}
            editor={ClassicEditor} 
            data={content}
            disabled= {this.props.disabled}
            onInit= { editor => {
                if(content) {
                    editor.setData(content)
                }
            }}
            onChange={this.ckEditorHandler}
            />
        )
    }
}