import { GraphQLServer, PubSub } from 'graphql-yoga'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import Like from './resolvers/Like'

import mongoose from 'mongoose';

const DB_URL = "mongodb+srv://Adam:type54932468@cluster0-hkucr.mongodb.net/hw3?retryWrites=true&w=majority"

mongoose.connect(DB_URL, {
  useNewUrlParser: true
})
const db = mongoose.connection;

db.on('error', error => {
  console.log(error)
});

db.once('open', () => {
  console.log('MongoDB connected!');
});

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
    Like,
  },
  context: {
    db,
    pubsub
  }
})

server.start({ port: process.env.PORT | 4000 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 4000}!`)
})
