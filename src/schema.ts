import { gql } from 'apollo-server'

export default gql`
type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
}

type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    updatePost(id: ID!, data: UpdatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
    updateComment(id: ID!, text: String!): Comment!
}

type Subscription {
    comment(postID: ID!): CommentSubscriptionPayload!
    post: PostSubscriptionPayload!
}

input CreateUserInput {
    name: String!
    email: String!
    age: Int
}

input UpdateUserInput {
    name: String
    email: String
    age: Int
}

input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
}

input UpdatePostInput {
    title: String
    body: String
    published: Boolean
}

input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
}

type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
}

type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
}

type Comment {
    id: ID!
    text: String!
    post: Post!
    author: User!
}

enum MutationType {
    CREATED
    UPDATED
    DELETED
}

type PostSubscriptionPayload {
    mutation: MutationType!
    data: Post!
}

type CommentSubscriptionPayload {
    mutation: MutationType!
    data: Comment!
}
`