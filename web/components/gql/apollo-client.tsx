import { ApolloClient, InMemoryCache } from "@apollo/client";

export function createApolloClient() {
  return new ApolloClient({
    uri: "http://127.0.0.1:8901/gql/v1/graphql",
    cache: new InMemoryCache(),
  });
}
