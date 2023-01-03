import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import qs from 'qs'
import store from 'store'
import MainLayout from '../../components/MainLayout'

import './index.css'

const LOGIN_USER = gql`
  mutation loginUserOauth($oauthCode: String!) {
    loginUserOauth(oauthCode: $oauthCode) {
      token
      error
    }
  }
`

const ADD_DROPBOX_ACCOUNT = gql`
  mutation addDropboxAccount($oauthCode: String!) {
    addDropboxAccount(oauthCode: $oauthCode) {
      error
    }
  }
`

class DropboxOauth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: ''
    }
  }

  componentDidMount() {
    const user = store.get('user')
    if (user) {
      this.addDropboxAccount()
    } else {
      this.loginUser()
    }
  }

  loginUser() {
    const { client, location, history } = this.props

    const params = qs.parse(location.search, { ignoreQueryPrefix: true })

    client
      .mutate({
        mutation: LOGIN_USER,
        variables: { oauthCode: params.code }
      })
      .then(result => {
        if (result.data.loginUserOauth.error) {
          this.setState({
            error: result.data.loginUserOauth.error
          })
          return
        }
        const token = result.data.loginUserOauth.token
        store.set('user', { token })

        history.push('/dashboard')
      })
      .catch(() => this.setState({ error: 'Authentication Error.' }))
  }

  addDropboxAccount() {
    const { client, location, history } = this.props

    const params = qs.parse(location.search, { ignoreQueryPrefix: true })

    client
      .mutate({
        mutation: ADD_DROPBOX_ACCOUNT,
        variables: { oauthCode: params.code }
      })
      .then(() => {
        // this should more gracefully "remove your current dropbox before adding a new one"
        history.push('/dashboard')
      })
      .catch(() => this.setState({ error: 'Authentication Error.' }))
  }

  render() {
    const { error } = this.state

    return (
      <MainLayout loggedIn={false} title="Blocksync - Authenticate">
        <div>
          <h2 className="DropboxOauth-error">{error}</h2>
        </div>
      </MainLayout>
    )
  }
}

export default withApollo(DropboxOauth)
