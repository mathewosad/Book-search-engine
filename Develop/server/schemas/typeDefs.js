const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    me: User
}
type Mutation {
    createUser(body: UserInput): User
    login(body: LoginInput): AuthPayload
    saveBook(body: BookInput): User
    deleteBook(body: BookInput): User
}
type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]
}
type Book {
    bookId: ID!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
}
type AuthPayload {
    token: String!
    user: User!
}

`;
module.exports = typeDefs;


