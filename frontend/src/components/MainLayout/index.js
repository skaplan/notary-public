import React from 'react'

import { Menu } from '@blueprintjs/core'
import { withRouter } from 'react-router-dom'
import Helmet from 'react-helmet'

import Header from '../Header/'
import VerifyFile from './components/VerifyFile'
import './index.css'

const MenuItemHelper = ({ to, history, location, staticContext, ...rest }) => (
  <Menu.Item
    onClick={() => history.push(to)}
    active={location.pathname === to}
    {...rest}
  />
)
const MenuItem = withRouter(MenuItemHelper)

const LoggedInSidebar = () => (
  <Menu large>
    <VerifyFile />
    <Menu.Item icon="folder-new" text="Create new proof ">
      <MenuItem
        icon="document"
        text="New File"
        to="/create/file"
        active={false}
      />
      <MenuItem
        icon="annotation"
        text="New Note"
        to="/create/note"
        active={false}
      />
    </Menu.Item>
    <Menu.Divider />
    <MenuItem icon="dashboard" text="Dashboard" to="/dashboard" />
    <MenuItem icon="star" text="Starred Files" to="/starred" />
    <MenuItem icon="folder-open" text="My files" to="/files" />
    <MenuItem icon="history" text="Sync History" to="/jobs" />
    <Menu.Divider />
    <MenuItem text="Settings..." icon="cog" to="/settings" />
    <MenuItem text="Logout" icon="log-out" to="/logout" />
  </Menu>
)

const LoggedOutSidebar = () => (
  <Menu large>
    <VerifyFile />
    <Menu.Item icon="folder-new" text="Create new proof ">
      <MenuItem
        icon="document"
        text="New File"
        to="/create/file"
        active={false}
      />
      <MenuItem
        icon="annotation"
        text="New Note"
        to="/create/note"
        active={false}
      />
    </Menu.Item>
    <Menu.Divider />
    <MenuItem icon="log-in" text="Login" to="/login" />
    <MenuItem icon="new-person" text="Register" to="/register" />
  </Menu>
)

const MainLayout = ({ children, loggedIn = true, title = 'Blocksync' }) => (
  <div className="MainLayout-wrapper">
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Header />
    <div className="MainLayout-main">
      <div className="MainLayout-sidebar">
        {loggedIn && <LoggedInSidebar />}
        {!loggedIn && <LoggedOutSidebar />}
      </div>
      <div className="MainLayout-content">{children}</div>
    </div>
  </div>
)

export default MainLayout
