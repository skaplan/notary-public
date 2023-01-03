import React, { Component } from 'react'
import { Icon, Spinner } from '@blueprintjs/core'
import { Query } from 'react-apollo'
import moment from 'moment'
import store from 'store'

import gql from 'graphql-tag'
import './index.css'

import ViewerSubscribe from './components/ViewerSubscribe'
import PublicSubscribe from './components/PublicSubscribe'
import Star from './components/Star'
import CreateAlias from './components/CreateAlias'
import MainLayout from '../../components/MainLayout'
import ProofDialog from './components/ProofDialog'
import CompareHashDialog from './components/CompareHashDialog'

const GET_FILE = gql`
  query file($hash: String, $aliasId: ID) {
    file(hash: $hash, aliasId: $aliasId) {
      id
      hash
      transactionId
      blockNumber
      fileType
      title
      body
      addedAt
      proof {
        nodes {
          hash
          left
          right
        }
      }
      viewerIsOwner
      viewerSubscribed
      viewerStarred
    }
    viewer {
      id
    }
  }
`

const FileInfo = ({
  title,
  body,
  hash,
  addedAt,
  transactionId,
  blockNumber,
  fileType,
  proof,
  viewerIsOwner,
  viewerSubscribed,
  viewerStarred,
  viewer
}) => (
  <div>
    <div className="FileInfo-titleWrap">
      <h2 className="FileInfo-titleHeading bp3-heading">{title}</h2>
      <span className="FileInfo-hash">{hash}</span>
      <div className="FileInfo-toolbar">
        {viewerIsOwner && <Star viewerStarred={viewerStarred} hash={hash} />}
        <CreateAlias hash={hash} />
      </div>
    </div>
    <div className="FileInfo-wrapper">
      <div className="FileInfo-leftWrap">
        <p>Added at {moment(addedAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
        <p>Type: {fileType}</p>
        {fileType === 'note' && (
          <div>
            <h4 className="bp3-heading">Contents:</h4>
            <div className="pt-running-text">{body}</div>
          </div>
        )}
      </div>
      <div className="FileInfo-rightWrap">
        {!blockNumber && (
          <div className="FileInfo-syncing">
            <Icon
              className="FileInfo-verifiedIcon"
              icon="refresh"
              color="#FFC940"
              iconSize={70}
            />
            <p className="FileInfo-syncingText">
              Syncing. Not yet included in a block. This may take 4-8 hours.
            </p>
            <div className="FileInfo-subscribe">
              {viewerIsOwner && (
                <ViewerSubscribe
                  viewerSubscribed={viewerSubscribed}
                  hash={hash}
                />
              )}
              {!viewer && <PublicSubscribe hash={hash} />}
            </div>
          </div>
        )}
        {blockNumber && (
          <div>
            <div>
              <h4 className="bp3-heading">
                Block{' '}
                <a
                  href={`https://live.blockcypher.com/btc/tx/${transactionId}`}
                >
                  {blockNumber}
                </a>
              </h4>
            </div>
            <p>
              <Icon
                className="FileInfo-verifiedIcon"
                icon="tick-circle"
                color="#0F9960"
                iconSize={22}
              />
              <span>Verified and included in Bitcoin blockchain.</span>
            </p>
            <div className="FileInfo-proofButtons">
              <ProofDialog proof={proof} />
              <CompareHashDialog hash={hash} />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)

class File extends Component {
  render() {
    const { match } = this.props
    const { hash: inputHash, aliasId } = match.params
    const variables = {
      hash: inputHash,
      aliasId
    }
    return (
      <MainLayout
        loggedIn={!!store.get('user')}
        title="Blocksync - Verify File"
      >
        <Query query={GET_FILE} variables={variables}>
          {({ data, loading, error }) => {
            if (loading)
              return (
                <div className="File-loadWrap">
                  <Spinner />
                </div>
              )

            if (error)
              return (
                <div className="File-loadWrap">
                  <Icon iconSize={40} icon="error" color="#A82A2A" />
                </div>
              )

            if (!data.file)
              return (
                <div className="File-loadWrap">
                  <div className="File-missingWrap">
                    <Icon iconSize={70} icon="help" color="#C23030" />
                    <h4 className="bp3-heading">
                      Sorry, we cannot find that file.
                    </h4>
                  </div>
                </div>
              )

            const { file, viewer } = data

            const {
              id,
              hash,
              title,
              body,
              fileType,
              blockNumber,
              transactionId,
              proof,
              addedAt,
              viewerIsOwner,
              viewerSubscribed,
              viewerStarred
            } = file

            return (
              <FileInfo
                id={id}
                viewer={viewer}
                hash={hash}
                title={title}
                body={body}
                blockNumber={blockNumber}
                transactionId={transactionId}
                proof={proof}
                fileType={fileType}
                addedAt={addedAt}
                viewerIsOwner={viewerIsOwner}
                viewerSubscribed={viewerSubscribed}
                viewerStarred={viewerStarred}
              />
            )
          }}
        </Query>
      </MainLayout>
    )
  }
}

export default File
