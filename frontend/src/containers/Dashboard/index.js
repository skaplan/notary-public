import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Spinner, Icon, Button } from '@blueprintjs/core'
import { Link, withRouter } from 'react-router-dom'

import Status from '../../components/Status'
import MainLayout from '../../components/MainLayout'

import './index.css'

const FILE_TYPE_TO_ICON = {
  file: 'document',
  note: 'annotation'
}

const AllFilesSummary = withRouter(({ search: { nodes }, history }) => (
  <div className="StarredFilesSummary-wrapper">
    <h3 className="b3-heading">Recent files:</h3>
    {nodes.map(({ fileType, title, hash }) => (
      <div key={hash} className="StarredFilesSummary-row">
        <Icon icon={FILE_TYPE_TO_ICON[fileType]} />
        <Link to={`/file/${hash}`}>{title}</Link>
      </div>
    ))}
    <Button
      className="StarredFilesSummary-seeMore"
      onClick={() => history.push('/files')}
    >
      View All Files
    </Button>
  </div>
))

const StarredFilesSummary = withRouter(
  ({ starredFiles: { nodes }, history }) => (
    <div className="StarredFilesSummary-wrapper">
      <h3 className="b3-heading">Starred Files:</h3>
      {nodes.map(({ fileType, title, hash }) => (
        <div key={hash} className="StarredFilesSummary-row">
          <Icon icon={FILE_TYPE_TO_ICON[fileType]} />
          <Link to={`/file/${hash}`}>{title}</Link>
        </div>
      ))}
      <Button
        icon="star"
        className="StarredFilesSummary-seeMore"
        onClick={() => history.push('/starred')}
      >
        View All Starred Files
      </Button>
    </div>
  )
)

const GET_DASHBOARD = gql`
  query dashboard {
    viewer {
      id
      status
      jobs(filter: { first: 1, after: 0 }) {
        numCount
        nodes {
          id
          inProgress
          numFiles
          startAt
          endAt
        }
      }
      starredFiles(filter: { first: 5 }) {
        nodes {
          title
          id
          hash
          fileType
        }
      }
      search(filter: { first: 5, query: "" }) {
        nodes {
          id
          title
          hash
          fileType
        }
      }
    }
  }
`

class Dashboard extends Component {
  render() {
    return (
      <MainLayout title="Blocksync - Dashboard">
        <Query query={GET_DASHBOARD}>
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

            const {
              viewer: { status, jobs, starredFiles, search }
            } = data

            return (
              <div className="Dashboard-wrapper">
                <Status status={status} jobs={jobs} />
                <StarredFilesSummary starredFiles={starredFiles} />
                <AllFilesSummary search={search} />
              </div>
            )
          }}
        </Query>
      </MainLayout>
    )
  }
}

export default Dashboard
