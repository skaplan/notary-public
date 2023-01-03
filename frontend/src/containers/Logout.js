import React, { Component } from 'react'
import store from 'store'

class Logout extends Component {
  componentDidMount() {
    store.remove('user')
    this.props.history.push(`/`)
  }

  render() {
    return <div />
  }
}

export default Logout
