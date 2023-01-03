import React, { Component } from 'react'
import { Button, Intent, TextArea } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import _ from 'lodash'

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

class PublicAddNote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hash: ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  render() {
    const { body } = this.state
    return (
      <Mutation mutation={CREATE_NOTE} variables={{ input: { body } }}>
        {(createNote, { loading, error, data }) => {
          const dataError = data && data.createNote && data.createNote.error
          const serverError = error && 'Server error. Try again later.'
          const displayError = serverError || dataError || ''
          const hash = _.get(data, 'createNote.note.hash')
          return (
            <div>
              <div className="FileDrop-error">{displayError}</div>
              <TextArea
                intent={Intent.PRIMARY}
                id="body"
                onChange={this.handleChange}
                value={body}
                placeholder="Save a note"
              />
              <div className="NewNote-bottomRow">
                <Button
                  disabled={!body}
                  onClick={createNote}
                  className="Home-saveBtn"
                  loading={loading}
                  large
                >
                  Save note
                </Button>
                {hash && <Redirect to={`/file/${hash}`} />}
              </div>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

export default PublicAddNote
