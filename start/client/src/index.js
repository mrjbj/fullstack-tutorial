// require("dotenv-safe").config({ allowEmptyValues: true });
// const { debugFactory } = require("./debug-util");
// jlog = debugFactory("index");
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import React from "react";
import { ApolloProvider } from "react-apollo";
import ReactDOM from "react-dom";
import Launches from "./pages/launches";

const cache = new InMemoryCache();
const link = new HttpLink({
    uri: "http://localhost:4000/"
});

const client = new ApolloClient({
    cache,
    link
});

ReactDOM.render(
    <ApolloProvider client={client}>
      <Launches /> 
    </ApolloProvider>,
    document.getElementById("root")
);
