import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

export default new GraphQLObjectType({
  name: 'JSON',
  fields: {
    value: { type: GraphQLJSON },
    object: { type: GraphQLJSONObject },
  },
});