//ts-check
require("dotenv-safe").config({ allowEmptyValues: true });
const { debugFactory } = require("./debug-util");
jlog = debugFactory("index");

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { createStore } = require("./utils");

const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");

// create sequelize connection to SQLite database.  Once, not per request
jlog.info("Creating sqllite database...");
const store = createStore();

// initialized outside of new ApolloServer ?
const dataSources = () => ({
    launchAPI: new LaunchAPI()
});

// dataSources become part of GQL server context available to all resolver functions
jlog.warn("Creating Apollo Server instance...");
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
