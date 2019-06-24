/** Basis */
import React from 'react'
import ReactDOM from 'react-dom'

/** Styling */
import 'bootstrap/dist/css/bootstrap.min.css'

/** Apollo */
import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { WebSocketLink } from 'apollo-link-ws'
import { createHttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import { setContext } from 'apollo-link-context'
import { split } from 'apollo-link'
import { ApolloProvider } from 'react-apollo'

/** Local Imports */
import './index.css'
import * as serviceWorker from './serviceWorker'
import App from './containers/App/App'
import { getToken } from './lib/utils'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
  credentials: 'same-origin'
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  new WebSocketLink({
    uri: 'ws://localhost:4000',
    options: {
      reconnect: true
    }
  }),
  httpLink
)

const authLink = setContext((_, { headers }) => {
  const token = getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const apolloClient = new ApolloClient({
  connectToDevTools: process.browser,
  ssrMode: !process.browser,
  ssrForceFetchDelay: 100,
  link: authLink.concat(link),
  cache: new InMemoryCache().restore({})
})

const main = (
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
)

ReactDOM.render(main, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
