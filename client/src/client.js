import { ApolloClient } from 'apollo-client'
import { ApolloLink } from "apollo-link"
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

/**
 * Create a new apollo client and export as default
 */
const http = new HttpLink({uri: 'http://localhost:4000/'})
const delay = setContext(() => new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 3000)
}))
const link = ApolloLink.from([
    delay, http
])
const cache = new InMemoryCache();

const client = new ApolloClient({
    cache, link
})

export default client;
