import { ApolloServer, gql } from 'apollo-server';
import { ulid } from 'ulid';

const typeDefs = gql`
type Tag {
  id: ID!
  displayName: String!
  content: String!
}

type Topic {
  id: ID!
  name: String!
  description: String!
  tags: [Tag!]
}

input CreateTagInput {
  displayName: String!
  content: String!
}

input CreateTopicInput {
  name: String!
  description: String!
  tagIds: [ID!]
}

type Query {
  tags: [Tag!]
  topics: [Topic!]
}

type Mutation {
  createTag(input: CreateTagInput!): Tag!
  createTopic(input: CreateTopicInput!): Topic!
}
`;

const resolvers = {
    Query: {
        tags: async (_, __, { containers }) => {
            try {
                const { resources: tags } = await containers.tagContainer.items
                    .query('SELECT * from c WHERE c.PK = "TAG"')
                    .fetchAll();
                return tags;
            } catch (error) {
                console.error("Error querying tags:", error);
                return [];
            }
        },
        topics: async (_, __, { containers }) => {
            try {
                const { resources: topics } = await containers.topicContainer.items
                    .query('SELECT * from c WHERE c.PK = "TOPIC"')
                    .fetchAll();
                return topics;
            } catch (error) {
                console.error("Error querying topics:", error);
                return [];
            }
        }
    },
    Mutation: {
        createTag: async (_, { input }, { containers }) => {
            try {
                const newTag = { ...input, id: ulid(), PK: "TAG", SK: `TAG#${ulid()}` };
                await containers.tagContainer.items.create(newTag);
                return newTag;
            } catch (error) {
                console.error("Error creating tag:", error);
                throw new Error("Failed to create tag");
            }
        },
        createTopic: async (_, { input }, { containers }) => {
            try {
                const newTopic = { ...input, id: ulid(), PK: "TOPIC", SK: `TOPIC#${ulid()}` };
                await containers.topicContainer.items.create(newTopic);
                return newTopic;
            } catch (error) {
                console.error("Error creating topic:", error);
                throw new Error("Failed to create topic");
            }
        }
    },
    Topic: {
        tags: async (parent, _, { containers }) => {
            try {
                const { resources: tags } = await containers.tagContainer.items
                    .query({
                        query: 'SELECT * from c WHERE ARRAY_CONTAINS(@tagIds, c.id)',
                        parameters: [{ name: '@tagIds', value: parent.tagIds }]
                    })
                    .fetchAll();
                return tags;
            } catch (error) {
                console.error("Error querying tags for topic:", error);
                return [];
            }
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ containers })
});

server.listen(8080).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});