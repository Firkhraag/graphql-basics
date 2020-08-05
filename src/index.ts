import { ApolloServer, PubSub } from 'apollo-server'
import typeDefs from './schema'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const pubsub = new PubSub()

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        db,
        pubsub
    }
})
   
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
})
