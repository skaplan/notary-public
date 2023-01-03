import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { HTMLTable, Icon, Spinner, Button } from '@blueprintjs/core'
import moment from 'moment'

import MainLayout from '../../components/MainLayout'
import './index.css'

const RESULTS_PER_PAGE = 20

const JobsTable = ({ nodes }) => (
  <HTMLTable striped>
    <thead>
      <tr>
        <th className="JobsTable-type">Status</th>
        <th className="JobsTable-files">Files Synced</th>
        <th className="JobsTable-startAt">Started At</th>
        <th className="JobsTable-endAt">Ended At</th>
      </tr>
    </thead>

    <tbody>
      {nodes.map(({ id, inProgress, startAt, endAt, numFiles }) => (
        <tr key={id}>
          <td className="JobsTable-type">
            <div className="JobsTable-iconWrap">
              {inProgress ? (
                <Icon icon="refresh" iconSize={15} />
              ) : (
                <Icon icon="symbol-circle" iconSize={20} color="#15B371" />
              )}
            </div>
          </td>
          <td className="JobsTable-files">{numFiles}</td>
          <td className="JobsTable-startAt">
            {moment(startAt).format('MMMM Do YYYY, h:mm:ss a')}
          </td>
          <td className="JobsTable-endAt">
            {moment(endAt).format('MMMM Do YYYY, h:mm:ss a')}
          </td>
        </tr>
      ))}
    </tbody>
  </HTMLTable>
)

const GET_JOBS = gql`
  query jobs($filter: JobsFilterInput!) {
    viewer {
      id
      jobs(filter: $filter) {
        numCount
        nodes {
          id
          inProgress
          numFiles
          startAt
          endAt
        }
      }
    }
  }
`

class Jobs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      after: 0
    }
  }

  handlePrevious = () => {
    const { after } = this.state
    const newAfter = Math.max(0, after - RESULTS_PER_PAGE)
    this.setState({ after: newAfter })
  }

  handleNext = numCount => {
    const { after } = this.state
    const newAfter = Math.min(after + RESULTS_PER_PAGE, numCount - 1)
    this.setState({ after: newAfter })
  }

  render() {
    const { after } = this.state

    return (
      <MainLayout title="Blocksync - Sync History">
        <h2 className="bp3-heading">Sync History</h2>
        <Query
          query={GET_JOBS}
          variables={{ filter: { first: RESULTS_PER_PAGE, after } }}
        >
          {({ data, loading, error }) => {
            if (loading)
              return (
                <div className="Jobs-spinnerWrap">
                  <Spinner size={60} />
                </div>
              )

            if (error)
              return (
                <div className="Jobs-spinnerWrap">
                  <Icon iconSize={60} icon="error" color="#A82A2A" />
                </div>
              )
            const {
              jobs: { nodes, numCount }
            } = data.viewer

            const hasPreviousPage = after > 0
            const hasNextPage = after + RESULTS_PER_PAGE < numCount
            const numPages = Math.max(Math.ceil(numCount / RESULTS_PER_PAGE), 1)
            const currentPage = Math.floor(after / RESULTS_PER_PAGE) + 1

            return (
              <div>
                <JobsTable nodes={nodes} />
                <div className="AllFiles-buttons">
                  <Button
                    disabled={!hasPreviousPage}
                    onClick={() => this.handlePrevious(numCount)}
                    className="AllFiles-previous"
                  >
                    Previous Page
                  </Button>
                  <Button
                    disabled={!hasNextPage}
                    onClick={() => this.handleNext(numCount)}
                    className="AllFiles-next"
                  >
                    Next Page
                  </Button>
                  <span className="AllFiles-pageNumber">{`Page ${currentPage} of ${numPages}`}</span>
                </div>
              </div>
            )
          }}
        </Query>
      </MainLayout>
    )
  }
}

export default Jobs
