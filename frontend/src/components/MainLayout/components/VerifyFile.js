import React, { Component } from 'react'
import { Menu } from '@blueprintjs/core'
import Dropzone from 'react-dropzone'
import { sha256 } from 'js-sha256'
import { withRouter } from 'react-router-dom'

class VerifyFile extends Component {
  handleFileData = async fileData => {
    const hash = sha256(fileData)

    this.props.history.push(`/file/${hash}`)
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
      <Dropzone
        className="VerifyFile-dropzone"
        onDrop={this.handleDrop}
        multiple={false}
      >
        <Menu.Item icon="geosearch" text="Verify file" />
      </Dropzone>
    )
  }
}

export default withRouter(VerifyFile)
