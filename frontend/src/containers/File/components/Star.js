import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Icon } from '@blueprintjs/core'
import gql from 'graphql-tag'

const CREATE_STARED_FILE = gql`
  mutation createStarredFile($hash: String!) {
    createStarredFile(hash: $hash) {
      file {
        id
        viewerStarred
      }
    }
  }
`

const DELETE_STARED_FILE = gql`
  mutation deleteStarredFile($hash: String!) {
    deleteStarredFile(hash: $hash) {
      id
      viewerStarred
    }
  }
`

class Star extends Component {
  render() {
    const { viewerStarred, hash } = this.props

    if (viewerStarred) {
      return (
        <Mutation mutation={DELETE_STARED_FILE} variables={{ hash }}>
          {deleteStarredFile => (
            <div className="FileInfo-toolbarItem" onClick={deleteStarredFile}>
              <Icon
                className="FileInfo-toolbarIcon"
                icon="star"
                iconSize={25}
              />
              <p>Unstar</p>
            </div>
          )}
        </Mutation>
      )
    }

    return (
      <Mutation mutation={CREATE_STARED_FILE} variables={{ hash }}>
        {createStarredFile => (
          <div className="FileInfo-toolbarItem" onClick={createStarredFile}>
            <Icon
              className="FileInfo-toolbarIcon"
              icon="star-empty"
              iconSize={25}
            />
            <p>Star</p>
          </div>
        )}
      </Mutation>
    )
  }
}

export default Star
