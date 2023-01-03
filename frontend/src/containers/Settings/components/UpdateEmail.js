import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import {
  FormGroup,
  InputGroup,
  Button,
  Card,
  Elevation
} from '@blueprintjs/core'

const UPDATE_EMAIL = gql`
  mutation updateEmail($newEmail: String!) {
    updateEmail(newEmail: $newEmail) {
      error
      user {
        id
        email
      }
    }
  }
`

class UpdateEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  render() {
    const { email } = this.state
    return (
      <div>
        <Mutation mutation={UPDATE_EMAIL} variables={{ newEmail: email }}>
          {(updateEmail, { loading, error, data }) => {
            const dataError = data && data.updateEmail && data.updateEmail.error
            const serverError = error && 'Server error. Try again later.'
            const displayError = serverError || dataError || ''

            const intent =
              (displayError && 'danger') ||
              (data && data.updateEmail && data.updateEmail.user && 'success')
            const helperText =
              displayError ||
              (intent === 'success' && 'Email successfully updated.')
            return (
              <div className="UpdateEmail-wrapper">
                <Card elevation={Elevation.ONE} className="UpdateEmail-card">
                  <h3>Update Email</h3>
                  <FormGroup
                    label="Email:"
                    labelFor="email"
                    className="UpdateEmail-form"
                    helperText={helperText}
                    intent={intent}
                  >
                    <InputGroup
                      autocomplete="off"
                      value={email}
                      id="email"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <Button
                    disabled={!email}
                    loading={loading}
                    onClick={updateEmail}
                  >
                    Update
                  </Button>
                </Card>
              </div>
            )
          }}
        </Mutation>
      </div>
    )
  }
}

export default UpdateEmail
