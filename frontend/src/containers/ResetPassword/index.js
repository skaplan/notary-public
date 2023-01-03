import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { FormGroup, InputGroup, Button } from '@blueprintjs/core'
import gql from 'graphql-tag'
import store from 'store'
import MainLayout from '../../components/MainLayout'
import './index.css'

const RESET_PASSWORD = gql`
  mutation resetUserPassword($code: String!, $password: String!) {
    resetUserPassword(code: $code, password: $password) {
      error
      user {
        id
      }
      token
    }
  }
`

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      passwordRepeat: ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleError = () => {
    this.setState({
      error: 'Server error. Try again later.'
    })
  }

  checkValid = () => {
    const { password, passwordRepeat } = this.state

    if (password !== passwordRepeat) {
      this.setState({ error: 'Passwords must match.' })
      return false
    }
    return true
  }

  handleCompleted = data => {
    const { resetUserPassword } = data
    if (resetUserPassword.error) {
      this.setState({ error: resetUserPassword.error })
      return
    }

    const token = resetUserPassword.token
    store.set('user', { token })

    this.props.history.push('/dashboard')
  }

  render() {
    const { error, password, passwordRepeat } = this.state
    const { match } = this.props
    const { code = '' } = match.params
    return (
      <MainLayout loggedIn={false} title="Blocksync - Reset Password">
        <div>
          <h2 className="bp3-heading">Reset Password</h2>
          <div className="ForgotPassword-error">{error}</div>
          <div className="ForgotPassword-inputWrap">
            <FormGroup label="Password" labelFor="password">
              <InputGroup
                type="password"
                id="password"
                onChange={this.handleChange}
                value={password}
              />
            </FormGroup>
            <FormGroup label="Repeat Password" labelFor="passwordRepeat">
              <InputGroup
                type="password"
                id="passwordRepeat"
                onChange={this.handleChange}
                value={passwordRepeat}
              />
            </FormGroup>
          </div>
          <Mutation
            mutation={RESET_PASSWORD}
            onCompleted={this.handleCompleted}
            onError={this.handleError}
            variables={{
              password,
              code
            }}
          >
            {(resetPassword, { loading }) => (
              <Button
                loading={loading}
                onClick={() => {
                  if (!this.checkValid()) return
                  resetPassword()
                }}
              >
                Reset Password
              </Button>
            )}
          </Mutation>
        </div>
      </MainLayout>
    )
  }
}

export default ResetPassword
