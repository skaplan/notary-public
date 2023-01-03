import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { FormGroup, InputGroup, Button } from '@blueprintjs/core'
import gql from 'graphql-tag'
import MainLayout from '../../components/MainLayout'
import './index.css'

const FORGOT_PASSWORD = gql`
  mutation sendPasswordReset($email: String!) {
    sendPasswordReset(email: $email)
  }
`

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: '',
      success: ''
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

  handleCompleted = data => {
    const { sendPasswordReset } = data
    if (!sendPasswordReset) {
      this.setState({ error: 'Invalid email address.' })
      return
    }

    this.setState({ success: 'Password reset sent.', error: '' })
  }

  render() {
    const { error, email, success } = this.state
    return (
      <MainLayout loggedIn={false} title="Blocksync - Forgot Password">
        <div>
          <h2 className="bp3-heading">Forgot Password</h2>
          <div className="ForgotPassword-error">{error}</div>
          <div className="ForgotPassword-success">{success}</div>
          <div className="ForgotPassword-inputWrap">
            <FormGroup label="Email" labelFor="email">
              <InputGroup
                id="email"
                onChange={this.handleChange}
                value={email}
              />
            </FormGroup>
          </div>
          <Mutation
            mutation={FORGOT_PASSWORD}
            onCompleted={this.handleCompleted}
            onError={this.handleError}
            variables={{
              email
            }}
          >
            {(forgotPassword, { loading }) => (
              <Button loading={loading} onClick={forgotPassword}>
                Send Password Reset
              </Button>
            )}
          </Mutation>
        </div>
      </MainLayout>
    )
  }
}

export default withRouter(ForgotPassword)
