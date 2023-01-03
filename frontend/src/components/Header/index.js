import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'

const Header = () => (
  <div className="Header">
    <div className="Header-logo">
      <Link className="Header-logoLink" to="/">
        Blocksync
      </Link>
    </div>
  </div>
)

export default Header
