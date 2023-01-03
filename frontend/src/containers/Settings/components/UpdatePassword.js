import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import {
  FormGroup,
  InputGroup,
  Button,
  Card,
  Elevation,
  Icon
} from '@blueprintjs/core'

const UPDATE_PASSWORD = gql`
  mutation updatePassword($oldPassword: String, $newPassword: String!) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      error
      user {
        id
        hasPassword
      }
    }
  }
`

class UpdatePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldPassword: '',
      newPassword: ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  checkValid = () => {
    const { newPassword, newPasswordRepeat } = this.state

    if (newPassword !== newPasswordRepeat) {
      this.setState({ error: 'Passwords must match.' })
      return false
    }
    this.setState({ error: '' })
    return true
  }

  render() {
    const { hasPassword } = this.props
    const {
      oldPassword,
      newPassword,
      newPasswordRepeat,
      error: stateError
    } = this.state
    return (
      <Mutation
        mutation={UPDATE_PASSWORD}
        variables={{ oldPassword, newPassword }}
      >
        {(updatePassword, { data, error, loading }) => {
          const dataError =
            data && data.updatePassword && data.updatePassword.error
          const serverError = error && 'Server error. Try again later.'
          const displayError = stateError || serverError || dataError || ''
          const enabled = hasPassword
            ? oldPassword && newPassword && newPasswordRepeat
            : newPassword && newPasswordRepeat

          const intent =
            (displayError && 'danger') ||
            (data &&
              data.updatePassword &&
              data.updatePassword.user &&
              'success')
          const helperText =
            displayError ||
            (intent === 'success' && 'Password successfully updated.')

          return (
            <div className="UpdatePassword-wrapper">
              <Card elevation={Elevation.ONE} className="UpdatePassword-card">
                {intent === 'success' && (
                  <div className="UpdatePassword-successWrap">
                    <Icon icon="tick-circle" iconSize={80} color="#0D8050" />
                    <h3>Password updated</h3>
                  </div>
                )}
                {intent !== 'success' && (
                  <div>
                    <div className="UpdatePassword-headerBlock">
                      <h3>
                        {hasPassword ? 'Update password' : 'Create a password'}
                      </h3>
                      {!hasPassword && (
                        <p>
                          A password will allow you to access your account
                          independent of Dropbox.
                        </p>
                      )}
                    </div>
                    {hasPassword && (
                      <FormGroup
                        label="Old Password:"
                        labelFor="oldPassword"
                        className="UpdatePassword-oldP"
                      >
                        <InputGroup
                          autocomplete="off"
                          value={oldPassword}
                          id="oldPassword"
                          type="password"
                          onChange={this.handleChange}
                        />
                      </FormGroup>
                    )}
                    <FormGroup
                      label="New Password:"
                      labelFor="newPassword"
                      className="UpdatePassword-newP"
                    >
                      <InputGroup
                        autocomplete="off"
                        value={newPassword}
                        id="newPassword"
                        type="password"
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                    <FormGroup
                      label="Confirm New Password:"
                      labelFor="newPassword"
                      className="UpdatePassword-newP"
                      helperText={helperText}
                      intent={intent}
                    >
                      <InputGroup
                        autocomplete="off"
                        value={newPasswordRepeat}
                        id="newPasswordRepeat"
                        type="password"
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                    <div>
                      <Button
                        disabled={!enabled}
                        loading={loading}
                        onClick={() => {
                          if (!this.checkValid()) return
                          updatePassword()
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

export default UpdatePassword
