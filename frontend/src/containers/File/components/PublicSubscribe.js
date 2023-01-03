import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Icon, Button, Spinner, Card, Elevation } from '@blueprintjs/core'

import gql from 'graphql-tag'

const CREATE_NOTIFICATION = gql`
  mutation createNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id
      viewerSubscribed
    }
  }
`

class PublicSubscribe extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      completed: false
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleCompleted = () => {
    this.setState({
      completed: true
    })
  }

  render() {
    const { hash } = this.props
    const { email, completed } = this.state
    if (completed)
      return (
        <Card elevation={Elevation.TWO} className="PublicSubscribe-card">
          <div className="PublicSubscribePopover-spinWrap">
            <div className="PublicSubscribePopover-successWrap">
              <Icon
                iconSize={60}
                icon="tick"
                color="#0D8050"
                className="PublicSubscribe-successIcon"
              />
              <h6 className="bp3-heading">
                You will receive an email when your file is included in a block.
              </h6>
            </div>
          </div>
        </Card>
      )

    return (
      <Mutation
        mutation={CREATE_NOTIFICATION}
        onCompleted={this.handleCompleted}
        variables={{ input: { hash, email } }}
      >
        {(createNotification, { loading, error }) => {
          if (loading)
            return (
              <Card elevation={Elevation.TWO} className="PublicSubscribe-card">
                <div className="PublicSubscribePopover-spinWrap">
                  <Spinner />
                </div>
              </Card>
            )

          if (error)
            return (
              <Card elevation={Elevation.TWO} className="PublicSubscribe-card">
                <div className="PublicSubscribePopover-spinWrap">
                  <Icon iconSize={50} icon="error" color="#A82A2A" />
                </div>
              </Card>
            )

          return (
            <Card elevation={Elevation.TWO} className="PublicSubscribe-card">
              <div className="PublicSubscribe-cardBody">
                <h5 className="bp3-heading">
                  Get notified when your file is included in the blockchain.
                </h5>
                <div className="PublicSubscribe-inputWrap">
                  <input
                    type="text"
                    className="bp3-input bp3-large"
                    placeholder="Email Address"
                    value={email}
                    onChange={this.handleChange}
                    id="email"
                  />
                  <Button
                    intent="primary"
                    large
                    className="PublicSubscribePopover-submit"
                    onClick={createNotification}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Card>
          )
        }}
      </Mutation>
    )
  }
}

export default PublicSubscribe
