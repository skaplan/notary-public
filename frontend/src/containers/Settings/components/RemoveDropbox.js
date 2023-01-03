import React, { Component } from 'react'

import { Alert, Intent, Button } from '@blueprintjs/core'
import { Mutation } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import gql from 'graphql-tag'

const DISASSOCIATE_DROPBOX_ACCOUNT = gql`
  mutation disassociateDropboxAccount {
    disassociateDropboxAccount {
      id
      status
    }
  }
`
// add loading + error states
class RemoveDropbox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  handleClick = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { open } = this.state
    return (
      <Mutation mutation={DISASSOCIATE_DROPBOX_ACCOUNT}>
        {(dissassociateDropbox, { data, error, loading }) => (
          <div className="RemoveDropbox-wrapper">
            <Alert
              cancelButtonText="Cancel"
              confirmButtonText="Disassociate Dropbox"
              icon="disable"
              isOpen={open}
              intent={Intent.DANGER}
              onCancel={this.handleClose}
              onConfirm={() => {
                dissassociateDropbox()
                this.handleClose()
              }}
            >
              <p>
                Are you sure you want to delink your Dropbox? You will still be
                able to access your previously synced files. Your new files will
                no longer be synced. If you do chose to relink your Dropbox, you
                must wait as your account is fully resynced.
              </p>
            </Alert>
            <p>{error && 'Server Error'}</p>
            <Button
              intent="danger"
              onClick={this.handleClick}
              loading={loading}
              large
            >
              Delink Dropbox Account
            </Button>
            {data && <Redirect to="/dashboard" />}
          </div>
        )}
      </Mutation>
    )
  }
}

export default RemoveDropbox
