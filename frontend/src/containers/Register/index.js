import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import store from 'store'
import { FormGroup, InputGroup, Button } from '@blueprintjs/core'
import MainLayout from '../../components/MainLayout'
import DropboxButton from '../../components/DropboxButton'
import './index.css'

const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
      }
      token
      error
    }
  }
`

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      confirmPassword: ''
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
    const { createUser } = data
    if (createUser.error) {
      this.setState({ error: createUser.error })
      return
    }

    const token = createUser.token
    store.set('user', { token })

    this.props.history.push('/dashboard')
  }

  checkValid = () => {
    const { password, confirmPassword } = this.state

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords must match.' })
      return false
    }
    this.setState({ error: '' })

    return true
  }

  render() {
    const { error, email, password, confirmPassword } = this.state
    return (
      <MainLayout loggedIn={false} title="Blocksync - Register">
        <div>
          <h2 className="bp3-heading">Register</h2>
          <div className="Register-error">{error}</div>
          <div className="Register-inputWrap">
            <FormGroup label="Email" labelFor="email">
              <InputGroup
                id="email"
                onChange={this.handleChange}
                value={email}
              />
            </FormGroup>
            <FormGroup label="Password" labelFor="password">
              <InputGroup
                type="password"
                id="password"
                onChange={this.handleChange}
                value={password}
              />
            </FormGroup>
            <FormGroup label="Confirm password" labelFor="confirmPassword">
              <InputGroup
                type="password"
                id="confirmPassword"
                onChange={this.handleChange}
                value={confirmPassword}
              />
            </FormGroup>
          </div>
          <Mutation
            mutation={CREATE_USER}
            onCompleted={this.handleCompleted}
            onError={this.handleError}
            variables={{
              input: {
                email,
                password
              }
            }}
          >
            {registerUser => (
              <Button
                onClick={() => {
                  if (!this.checkValid()) return
                  registerUser()
                }}
              >
                Register
              </Button>
            )}
          </Mutation>
          <div className="Register-DBWrap">
            <DropboxButton />
          </div>
        </div>
      </MainLayout>
    )
  }
}

export default withRouter(Register)
