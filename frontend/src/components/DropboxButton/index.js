import React, { Component } from 'react'
import qs from 'qs'

import config from '../../config'
import button from './button.svg'
import './index.css'

class DropboxButton extends Component {
  render() {
    const query = qs.stringify({
      response_type: 'code',
      client_id: config.dropboxClientId,
      redirect_uri: config.dropboxRedirectUrl
    })
    const url = `${config.dropboxAuthorizeUrl}?${query}`

    const { width } = this.props
    return (
      <div className="DropboxButton-container" style={{ width }}>
        <a href={url}>
          <img src={button} alt="" />
        </a>
      </div>
    )
  }
}

export default DropboxButton
