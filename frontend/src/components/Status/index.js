import React, { Component } from 'react'

import { Mutation } from 'react-apollo'
import { Icon, Button } from '@blueprintjs/core'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import gql from 'graphql-tag'

import DropboxButton from '../DropboxButton/'

const START_SYNCING = gql`
  mutation startSyncing {
    startSyncing {
      status
      id
    }
  }
`

const PAUSE_SYNCING = gql`
  mutation pauseSyncing {
    pauseSyncing {
      status
      id
    }
  }
`

const StartSyncing = () => (
  <Mutation mutation={START_SYNCING}>
    {startSyncing => (
      <Button intent="success" onClick={startSyncing}>
        Start Syncing
      </Button>
    )}
  </Mutation>
)

const PauseSyncing = () => (
  <Mutation mutation={PAUSE_SYNCING}>
    {pauseSyncing => (
      <Button intent="danger" onClick={pauseSyncing}>
        Pause Syncing
      </Button>
    )}
  </Mutation>
)

class Status extends Component {
  render() {
    const {
      status,
      jobs: { nodes }
    } = this.props
    const [job] = nodes
    const stopped = status === 'error' || status === 'inactive'
    return (
      <div className="Status-wrapper">
        <div>
          <h3 className="b3-heading">Sync Status:</h3>
          {!status && (
            <div>
              <div className="Status-statusWrap">
                <Icon icon="symbol-circle" iconSize={20} color="#C23030" />
                <span className="Status-statusText">No Dropbox linked.</span>
              </div>
              <div className="Status-dboxBtnWrap">
                <DropboxButton width={150} />
              </div>
            </div>
          )}
          {status === 'inactive' && (
            <div className="Status-statusWrap">
              <Icon icon="symbol-circle" iconSize={20} color="#D9822B" />
              <span className="Status-statusText">Syncing paused.</span>
            </div>
          )}
          {status === 'active' && (
            <div className="Status-statusWrap">
              <Icon icon="symbol-circle" iconSize={20} color="#15B371" />
              <span className="Status-statusText">Syncing active.</span>
            </div>
          )}
        </div>
        <div>
          {!job &&
            status === 'active' && (
              <div className="Status-detail">
                Initial sync. This can take a while.
              </div>
            )}
          {job &&
            job.inProgress && (
              <div className="Status-detail">
                Sync in progress. {job.numFiles} files synced.
              </div>
            )}
          {job &&
            !job.inProgress && (
              <div className="Status-detail">
                Last sync of {job.numFiles} files at{' '}
                {moment(job.endAt).format('MMMM Do YYYY, h:mm:ss a')}.
              </div>
            )}
          <div className="Status-syncBtn">{stopped && <StartSyncing />}</div>
          <div className="Status-syncBtn">
            {status && !stopped && <PauseSyncing />}
          </div>
          <Button
            className="Status-viewHistoryBtn"
            onClick={() => this.props.history.push('/jobs')}
          >
            View All Sync History
          </Button>
        </div>
      </div>
    )
  }
}

export default withRouter(Status)
