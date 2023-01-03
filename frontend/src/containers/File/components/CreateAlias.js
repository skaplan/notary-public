import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Popover, Position, Icon } from '@blueprintjs/core'

const CREATE_ALIAS = gql`
  mutation createAlias($hash: String!) {
    createAlias(hash: $hash) {
      id
    }
  }
`
const SharePopoverContent = ({ link }) => (
  <div className="SharePopoverContent-wrapper">
    <h6 className="bp3-heading">Share this link:</h6>
    <input
      type="text"
      className="bp3-input"
      value={`https://blocksync.app/${link}`}
    />
  </div>
)

class CreateAlias extends Component {
  constructor(props) {
    super(props)
    this.state = {
      popoverOpen: true
    }
  }

  render() {
    const { hash } = this.props

    return (
      <Mutation mutation={CREATE_ALIAS} variables={{ hash }}>
        {(createAlias, { data }) => (
          <React.Fragment>
            {!data && (
              <div className="FileInfo-toolbarItem" onClick={createAlias}>
                <Icon
                  className="FileInfo-toolbarIcon"
                  icon="share"
                  iconSize={25}
                />
                <p>Share</p>
              </div>
            )}
            {data && (
              <div className="FileInfo-toolbarItem">
                <Popover
                  content={<SharePopoverContent link={data.createAlias.id} />}
                  isOpen={this.state.popoverOpen}
                  onInteraction={s => this.setState({ popoverOpen: s })}
                  position={Position.BOTTOM}
                >
                  <Icon
                    className="FileInfo-toolbarIcon"
                    icon="share"
                    iconSize={25}
                  />
                </Popover>
                <p>Share</p>
              </div>
            )}
          </React.Fragment>
        )}
      </Mutation>
    )
  }
}

export default CreateAlias
