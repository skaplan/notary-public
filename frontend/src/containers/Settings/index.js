import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Spinner, Icon } from '@blueprintjs/core'

import UpdateEmail from './components/UpdateEmail'
import UpdatePassword from './components/UpdatePassword'
import MainLayout from '../../components/MainLayout'

import './index.css'
import RemoveDropbox from './components/RemoveDropbox'

const GET_VIEWER = gql`
  query viewer {
    viewer {
      id
      email
      hasPassword
      status
    }
  }
`

class Settings extends Component {
  render() {
    return (
      <MainLayout title="Blocksync - Settings">
        <div>
          <h2 className="bp3-heading">Settings</h2>
          <Query query={GET_VIEWER}>
            {({ data, loading, error }) => {
              if (loading)
                return (
                  <div className="main-SpinnerWrap">
                    <Spinner size={60} />
                  </div>
                )

              if (error)
                return (
                  <div className="main-SpinnerWrap">
                    <Icon iconSize={60} icon="error" color="#A82A2A" />
                  </div>
                )

              const { email, status, hasPassword } = data.viewer

              return (
                <div className="Settings-wrapper">
                  <div className="bp3-callout .modifier Settings-callout">
                    <h4 className="bp3-heading">Email</h4>
                    {email}
                  </div>
                  <p>
                    <UpdateEmail />
                  </p>
                  <p>
                    <UpdatePassword hasPassword={hasPassword} />
                  </p>
                  <p>{status && <RemoveDropbox />}</p>
                </div>
              )
            }}
          </Query>
        </div>
      </MainLayout>
    )
  }
}

export default Settings
