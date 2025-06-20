import { ApolloClient, InMemoryCache } from "@apollo/client";

export function createApolloClient() {
  return new ApolloClient({
    uri: "https://ficus-phons-gong.txtx.network:8901/gql/v1/graphql",
    cache: new InMemoryCache(),
  });
}
