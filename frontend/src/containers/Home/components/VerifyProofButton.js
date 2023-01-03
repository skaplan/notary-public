import React, { Component } from 'react'
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
        className="VerifyProofButton-dropzone"
        onDrop={this.handleDrop}
        multiple={false}
      >
        <div className="Home-navItem">Verify Proof</div>
      </Dropzone>
    )
  }
}

export default withRouter(VerifyFile)
