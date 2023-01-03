import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'

const CREATE_NOTE = gql`
  mutation createNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      note {
        hash
      }
      error
    }
  }
`

class UploadFile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: '',
      title: '',
      body: ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleError = () => {
    this.setState({
      error: 'Server error. Try again later.'
    })
  }

  handleCompleted = data => {
    const { createNote } = data
    if (createNote.error) {
      this.setState({ error: createNote.error })
    }

    this.props.history.push(`/file/${createNote.note.hash}`)
  }

  render() {
    const { error, body, title } = this.state
    return (
      <div>
        <div>{error}</div>
        <input
          type="text"
          id="title"
          value={title}
          onChange={this.handleChange}
        />
        <textarea id="body" value={body} onChange={this.handleChange} />
        <Mutation
          mutation={CREATE_NOTE}
          onCompleted={this.handleCompleted}
          onError={this.handleError}
          variables={{
            input: {
              title,
              body
            }
          }}
        >
          {createNote => (
            <button type="button" onClick={createNote}>
              Save
            </button>
          )}
        </Mutation>
      </div>
    )
  }
}

export default withRouter(UploadFile)
