import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { sha256 } from 'js-sha256'
import gql from 'graphql-tag'
import { Button, Card, Elevation } from '@blueprintjs/core'

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

class FileDrop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: '',
      loading: false
    }
  }

  handleFileData = async (fileData, filename) => {
    const hash = sha256(fileData)

    this.setState({ loading: true })
    const { data, error: serverError } = await this.props.client.mutate({
      mutation: CREATE_FILE,
      variables: { input: { title: filename, hash } }
    })
    this.setState({ loading: false })

    if (serverError) {
      this.setState({
        error: `Server error. Try again later.`
      })
      return
    }

    const { error, file } = data.createFile
    if (error) {
      this.setState({ error })
      return
    }

    this.props.history.push(`/file/${file.hash}`)
  }

  handleDrop = files => {
    if (files.length < 1) return
    const [file] = files

    const reader = new FileReader()
    reader.onload = () => this.handleFileData(reader.result, file.name)
    reader.readAsArrayBuffer(file)
  }

  render() {
    return (
      <div>
        <Dropzone
          onDrop={this.handleDrop}
          multiple={false}
          className="UploadDrop-dropzone"
        >
          <Card elevation={Elevation.ONE} className="UploadDrop-card">
            <div>
              <div className="FileDrop-error">{this.state.error}</div>
              <h4>Drag and drop a file.</h4>
              <Button loading={this.state.loading}>Upload File</Button>
            </div>
          </Card>
        </Dropzone>
      </div>
    )
  }
}

export default withRouter(withApollo(FileDrop))
