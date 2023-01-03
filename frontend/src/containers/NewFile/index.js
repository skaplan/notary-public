import React, { Component } from 'react'
import { Button, Spinner, Card, Elevation, Intent } from '@blueprintjs/core'
import { Redirect } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { sha256 } from 'js-sha256'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import _ from 'lodash'
import store from 'store'

import MainLayout from '../../components/MainLayout'
import './index.css'

const CREATE_FILE = gql`
  mutation createFile($input: CreateFileInput!) {
    createFile(input: $input) {
      file {
        hash
      }
      error
    }
  }
`

class NewFile extends Component {
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

  handleDrop = files => {
    if (files.length < 1) return
    const [file] = files

    const reader = new FileReader()
    reader.onload = () => this.handleFileData(reader.result, file.name)
    reader.readAsArrayBuffer(file)
  }

  handleFileData = async (fileData, filename) => {
    const hash = sha256(fileData)
    const currentTitle = this.state.title

    this.setState({ hash, title: currentTitle || filename })
  }

  render() {
    const { hash, title } = this.state
    return (
      <MainLayout loggedIn={!!store.get('user')} title="Blocksync - New File">
        <Mutation mutation={CREATE_FILE} variables={{ input: { hash, title } }}>
          {(createFile, { loading, error, data }) => {
            const dataError = data && data.createFile && data.createFile.error
            const serverError = error && 'Server error. Try again later.'
            const displayError = serverError || dataError || ''
            const serverHash = _.get(data, 'createFile.file.hash')

            return (
              <div className="NewFile-container">
                <h2 className="bp3-heading">Create new file proof</h2>
                <div className="NewFile-error">{displayError}</div>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={this.handleChange}
                  className="bp3-input NewFile-titleInput"
                  placeholder="Title"
                />
                <h5 className="bp3-heading">File:</h5>
                <div className="NewFile-hashDisplay">{hash}</div>
                <Dropzone
                  onDrop={this.handleDrop}
                  multiple={false}
                  className="NewFile-dropzone"
                >
                  <Card elevation={Elevation.ONE} className="NewFile-card">
                    <h4>Drag and drop a file.</h4>
                    <Button className="NewFile-uploadButton">
                      Upload File
                    </Button>
                  </Card>
                </Dropzone>
                <div className="NewFile-bottomRow">
                  <Button
                    disabled={!hash}
                    onClick={createFile}
                    className="NewFile-createProof"
                    intent={Intent.PRIMARY}
                  >
                    Create Proof
                  </Button>
                  {loading && <Spinner size={20} className="NewFile-spinner" />}
                  {serverHash && <Redirect to={`/file/${hash}`} />}
                </div>
              </div>
            )
          }}
        </Mutation>
      </MainLayout>
    )
  }
}

export default NewFile
