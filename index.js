import { ApolloServer, gql } from 'apollo-server';
import { ulid } from 'ulid';

let books = [
    {
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
 
  type Query {
    books: [Book!]
  }
`;

const resolvers = {
    Query: {
        books: () => books,
    }
};

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
server.listen(8080);