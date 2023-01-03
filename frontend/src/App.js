import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import store from 'store'

import Home from './containers/Home/'
import DropboxOauth from './containers/DropboxOauth/'
import Dashboard from './containers/Dashboard/'
import File from './containers/File/'
import Upload from './containers/Upload'
import Jobs from './containers/Jobs/'
import StarredFiles from './containers/StarredFiles/'
import Settings from './containers/Settings'
import Register from './containers/Register/'
import Login from './containers/Login/'
import Logout from './containers/Logout'
import AllFiles from './containers/AllFiles'
import NewFile from './containers/NewFile'
import NewNote from './containers/NewNote'
import ForgotPassword from './containers/ForgotPassword'
import ResetPassword from './containers/ResetPassword'

import apolloClient from './apolloClient'
import './App.css'

const PrivateRoute = ({ component: RouteComponent, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      store.get('user') ? (
        <RouteComponent {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login'
          }}
        />
      )
    }
  />
)

class App extends Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/dropbox_oauth_redirect" component={DropboxOauth} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <Route path="/file/:hash" component={File} />
            <Route path="/shared/:aliasId" component={File} />
            <Route path="/upload" component={Upload} />
            <PrivateRoute path="/jobs" component={Jobs} />
            <PrivateRoute path="/starredFiles" component={StarredFiles} />
            <PrivateRoute path="/settings" component={Settings} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/forgot" component={ForgotPassword} />
            <Route path="/reset/:code" component={ResetPassword} />
            <PrivateRoute path="/files" component={AllFiles} />
            <PrivateRoute path="/starred" component={StarredFiles} />
            <Route path="/create/file" component={NewFile} />
            <Route path="/create/note" component={NewNote} />
          </Switch>
        </Router>
      </ApolloProvider>
    )
  }
}

export default App
