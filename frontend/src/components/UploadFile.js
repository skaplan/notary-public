import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { sha256 } from 'js-sha256'
import gql from 'graphql-tag'

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

class UploadFile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: ''
    }
  }

  handleFileData = async (fileData, filename) => {
    const hash = sha256(fileData)

    const { data, error: serverError } = await this.props.client.mutate({
      mutation: CREATE_FILE,
      variables: { input: { title: filename, hash } }
    })

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
        <div>{this.state.error}</div>
        <Dropzone onDrop={this.handleDrop} multiple={false} />
      </div>
    )
  }
}

export default withRouter(withApollo(UploadFile))
