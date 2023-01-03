import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Button } from '@blueprintjs/core'

import gql from 'graphql-tag'

const CREATE_NOTIFICATION = gql`
  mutation createNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id
      viewerSubscribed
    }
  }
`

class ViewerSubscribe extends Component {
  render() {
    const { viewerSubscribed, hash } = this.props

    return (
      <div className="ViewerSubscribe-wrapper">
        {viewerSubscribed && (
          <p>You will be notified when your file is included in a block.</p>
        )}
        {!viewerSubscribed && (
          <Mutation
            mutation={CREATE_NOTIFICATION}
            variables={{ input: { hash } }}
          >
            {createNotification => (
              <Button
                icon="notifications"
                className="ViewerSubscribe-button"
                onClick={createNotification}
                intent="primary"
                large
              >
                Notify me on file sync
              </Button>
            )}
          </Mutation>
        )}
      </div>
    )
  }
}

export default ViewerSubscribe
