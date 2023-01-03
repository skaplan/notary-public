import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'
import store from 'store'

import config from './config'

const httpLink = new HttpLink({
  uri: config.graphqlUrl
})

const authLink = setContext((_, { headers }) => {
  const user = store.get('user')
  if (!user) return {}

  const { token } = user
  return {
    headers: {
      ...headers,
      authorization: token
    }
  }
})

const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache()
})

export default apolloClient
