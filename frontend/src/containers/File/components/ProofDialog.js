import React, { Component } from 'react'
import { Icon, Button, Dialog, TextArea, Intent } from '@blueprintjs/core'
import _ from 'lodash'

class ProofDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false
    }
  }

  handleClick = () => {
    this.setState({ dialogOpen: true })
  }

  handleClose = () => {
    this.setState({ dialogOpen: false })
  }

  render() {
    const { dialogOpen } = this.state

    const { proof } = this.props

    const cleanedNodes = proof.nodes.map(node =>
      _.pick(node, ['left', 'right', 'hash'])
    )
    const proofJson = JSON.stringify(cleanedNodes)

    return (
      <div className="FileInfo-proofButton">
        <Dialog isOpen={dialogOpen} onClose={this.handleClose}>
          <div className="bp3-dialog-header">
            <Icon icon="endorsed" />
            <h4 className="bp3-heading">Proof of existence</h4>
            <button
              aria-label="Close"
              type="button"
              className="bp3-dialog-close-button bp3-icon-small-cross"
              onClick={this.handleClose}
            />
          </div>
          <div className="bp3-dialog-body">
            <h6 className="bp3-heading">
              The following is proof that the hash placed in the blockchain
              included this file.
              <a href="/TODO">
                Click here for more information about the format.
              </a>
            </h6>
            <div className="ProofDialog-TextAreaWrap">
              <TextArea
                readOnly
                className="ProofDialog-TextArea"
                intent={Intent.PRIMARY}
                value={proofJson}
              />
            </div>
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
          icon="endorsed"
          large
          className="FileInfo-proofButton"
          onClick={this.handleClick}
        >
          View Proof
        </Button>
      </div>
    )
  }
}

export default ProofDialog
