import React, { Component } from 'react'
import UploadFile from '../components/UploadFile'
import UploadNote from '../components/UploadNote'

class Upload extends Component {
  render() {
    return (
      <div>
        <UploadFile />
        <UploadNote />
      </div>
    )
  }
}

export default Upload
