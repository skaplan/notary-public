import React, { Component } from 'react'
import { Button, Spinner, Intent, TextArea } from '@blueprintjs/core'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import _ from 'lodash'
import store from 'store'

import MainLayout from '../../components/MainLayout'
import './index.css'

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

class NewNote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hash: '',
      title: '',
      error: ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  render() {
    const { body, title } = this.state
    return (
      <MainLayout loggedIn={!!store.get('user')} title="Blocksync - New Note">
        <Mutation mutation={CREATE_NOTE} variables={{ input: { body, title } }}>
          {(createNote, { loading, error, data }) => {
            const dataError = data && data.createNote && data.createNote.error
            const serverError = error && 'Server error. Try again later.'
            const displayError = serverError || dataError || ''
            const hash = _.get(data, 'createNote.note.hash')
            return (
              <div className="NewNote-container">
                <h2 className="bp3-heading">Create new note proof</h2>
                <div className="NewNote-error">{displayError}</div>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={this.handleChange}
                  className="bp3-input NewNote-titleInput"
                  placeholder="Title"
                  autoComplete="off"
                />
                <TextArea
                  id="body"
                  onChange={this.handleChange}
                  value={body}
                  placeholder="Body"
                  className="NewNote-textArea"
                />
                <div className="NewNote-bottomRow">
                  <Button
                    disabled={!(body && title)}
                    onClick={createNote}
                    className="NewNote-createProof"
                    intent={Intent.PRIMARY}
                  >
                    Create Proof
                  </Button>
                  {loading && <Spinner size={20} className="NewNote-spinner" />}
                  {hash && <Redirect to={`/file/${hash}`} />}
                </div>
              </div>
            )
          }}
        </Mutation>
      </MainLayout>
    )
  }
}

export default NewNote
