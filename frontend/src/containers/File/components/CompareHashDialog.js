import React, { Component } from 'react'
import { Icon, Button, Dialog, Card, Elevation } from '@blueprintjs/core'
import Dropzone from 'react-dropzone'
import { sha256 } from 'js-sha256'

class CompareHashDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false,
      match: false,
      failure: false
    }
  }

  handleClick = () => {
    this.setState({ dialogOpen: true })
  }

  handleClose = () => {
    this.setState({ dialogOpen: false })
  }

  handleDrop = files => {
    if (files.length < 1) return
    const [file] = files

    const reader = new FileReader()
    reader.onload = () => this.handleFileData(reader.result, file.name)
    reader.readAsArrayBuffer(file)
  }

  handleFileData = async fileData => {
    const hash = sha256(fileData)

    if (this.props.hash === hash) {
      this.setState({ match: true, failure: false })
    } else {
      this.setState({ failure: true, match: false })
    }
  }

  render() {
    const { dialogOpen, failure, match } = this.state

    return (
      <div>
        <Dialog isOpen={dialogOpen} onClose={this.handleClose}>
          <div className="bp3-dialog-header">
            <Icon icon="endorsed" />
            <h4 className="bp3-heading">Compare file hash</h4>
            <button
              aria-label="Close"
              type="button"
              className="bp3-dialog-close-button bp3-icon-small-cross"
              onClick={this.handleClose}
            />
          </div>
          <div className="bp3-dialog-body">
            <h6 className="bp3-heading">
              Check that the recorded file is the same as the file you expect.
            </h6>
            <Dropzone
              disabled={match}
              onDrop={this.handleDrop}
              multiple={false}
              className="CompareHashDialog-dropzone"
            >
              <Card
                elevation={Elevation.ONE}
                className="CompareHashDialog-card"
              >
                {!(failure || match) && (
                  <div>
                    <h4>Drag and drop a file.</h4>
                    <Button>Upload File</Button>
                  </div>
                )}
                {match && (
                  <div>
                    <Icon icon="tick-circle" iconSize={80} color="#0D8050" />
                    <h4>Success</h4>
                    <p> The provided file matches the recorded file.</p>
                  </div>
                )}
                {failure && (
                  <div>
                    <Icon icon="error" iconSize={80} color="#C23030" />
                    <h4>Failure</h4>
                    <p>The provided file does not match the recorded file.</p>
                    <p>Try again</p>
                    <Button>Upload File</Button>
                  </div>
                )}
              </Card>
            </Dropzone>
          </div>
          <div className="bp3-dialog-footer">
            <div className="bp3-dialog-footer-actions">
              <button
                type="submit"
                className="bp3-button bp3-intent-primary"
                onClick={this.handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
        <Button
          icon="changes"
          large
          className="FileInfo-proofButton"
          onClick={this.handleClick}
        >
          Compare File Hash
        </Button>
      </div>
    )
  }
}

export default CompareHashDialog
