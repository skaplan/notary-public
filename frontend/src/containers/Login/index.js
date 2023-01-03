import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { withRouter, Link } from 'react-router-dom'
import { FormGroup, InputGroup, Button } from '@blueprintjs/core'
import gql from 'graphql-tag'
import store from 'store'
import MainLayout from '../../components/MainLayout'
import DropboxButton from '../../components/DropboxButton'

import './index.css'

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        id
      }
      token
      error
    }
  }
`

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  componentDidMount() {
    const user = store.get('user')
    if (user && user.token) {
      this.props.history.push('/dashboard')
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
    const { loginUser } = data
    if (loginUser.error) {
      this.setState({ error: loginUser.error })
      return
    }

    const token = loginUser.token
    store.set('user', { token })

    this.props.history.push('/dashboard')
  }

  render() {
    const { error, email, password } = this.state
    return (
      <MainLayout loggedIn={false} title="Blocksync - Login">
        <div>
          <h2 className="bp3-heading">Login</h2>
          <div className="Login-error">{error}</div>
          <div className="Login-inputWrap">
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
          </div>
          <Mutation
            mutation={LOGIN_USER}
            onCompleted={this.handleCompleted}
            onError={this.handleError}
            variables={{
              email,
              password
            }}
          >
            {loginUser => <Button onClick={loginUser}>Login</Button>}
          </Mutation>
          <Link to="/forgot" className="Login-forgotLink">
            Forgot password
          </Link>
          <div className="Login-DBWrap">
            <DropboxButton />
          </div>
        </div>
      </MainLayout>
    )
  }
}

export default withRouter(Login)
