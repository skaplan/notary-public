import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { HTMLTable, Icon, Button, Spinner } from '@blueprintjs/core'
import gql from 'graphql-tag'
import moment from 'moment'
import './index.css'
import MainLayout from '../../components/MainLayout'

const RESULTS_PER_PAGE = 20

const FILE_TYPE_TO_ICON = {
  file: 'document',
  note: 'annotation'
}

const FileTable = ({ files }) => (
  <div className="FileTable-wrapper">
    <HTMLTable striped>
      <thead>
        <tr>
          <th className="FileTable-type">Type</th>
          <th className="FileTable-title">Title</th>
          <th className="FileTable-addedAt">Date added</th>
        </tr>
      </thead>
      <tbody>
        {files.map(({ id, title, addedAt, hash, fileType }) => (
          <tr key={id}>
            <td className="FileTable-type">
              <Icon icon={FILE_TYPE_TO_ICON[fileType]} />
            </td>
            <td className="FileTable-title">
              <Link to={`/file/${hash}`}>{title}</Link>
            </td>
            <td className="FileTable-addedAt">
              {moment(addedAt).format('MMMM Do YYYY, h:mm:ss a')}
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  </div>
)

const GET_SEARCH_RESULTS = gql`
  query search($filter: SearchFilterInput!) {
    viewer {
      id
      search(filter: $filter) {
        numCount
        nodes {
          id
          hash
          fileType
          title
          addedAt
        }
      }
    }
  }
`

class AllFiles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      after: 0
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
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
    const { query, after } = this.state
    return (
      <MainLayout title="Blocksync - My Files">
        <div className="AllFiles-wrapper">
          <h2 className="bp3-heading">My Files</h2>
          <div className="AllFiles-inputWrapper">
            <span className="bp3-icon bp3-icon-search AllFiles-searchIcon" />
            <input
              type="text"
              id="query"
              placeholder="Search"
              className="AllFiles-search"
              value={query}
              onChange={this.handleChange}
            />
          </div>
          <Query
            query={GET_SEARCH_RESULTS}
            variables={{
              filter: {
                query,
                first: RESULTS_PER_PAGE,
                after
              }
            }}
          >
            {({ data, error, loading }) => {
              if (loading)
                return (
                  <div className="AllFiles-spinnerWrap">
                    <Spinner size={60} />
                  </div>
                )

              if (error)
                return (
                  <div className="AllFiles-spinnerWrap">
                    <Icon iconSize={60} icon="error" color="#A82A2A" />
                  </div>
                )

              const { search } = data.viewer
              const { nodes, numCount } = search

              const hasPreviousPage = after > 0
              const hasNextPage = after + RESULTS_PER_PAGE < numCount
              const numPages = Math.max(
                Math.ceil(numCount / RESULTS_PER_PAGE),
                1
              )
              const currentPage = Math.floor(after / RESULTS_PER_PAGE) + 1
              return (
                <div>
                  <FileTable files={nodes} />
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
        </div>
      </MainLayout>
    )
  }
}

export default AllFiles
