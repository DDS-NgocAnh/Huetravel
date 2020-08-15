import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const config = {
    placeholder: 'Write your review',
    toolbar: ['bold', 'italic', 'imageUpload',
    'bulletedList', 'numberedList', 'blockQuote'],
    ckfinder: {
        uploadUrl: 'http://localhost:9000/uploads'
    }
}


export default class TextEditor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            content: ''
        }

        this.ckEditorHandler = this.ckEditorHandler.bind(this)
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
        return (
            <CKEditor
            config={config}
            editor={ClassicEditor} 
            data={this.state.content}
            disabled= {this.props.disabled}
            onInit= { editor => {
            }}
            onChange={this.ckEditorHandler}
            />
        )
    }
}