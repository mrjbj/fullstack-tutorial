//ts-check
require("dotenv-safe").config({ allowEmptyValues: true });
const { debugFactory } = require("./debug-util");
jlog = debugFactory("index");

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { createStore } = require("./utils");
const isEmail = require("isemail");
const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");

// create sequelize connection to SQLite database.  Once, not per request
jlog.debug("Creating sqllite database...");
const store = createStore();

// initialized outside of new ApolloServer ?
const dataSources = () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({store})
});

// dataSources become part of GQL server context available to all resolver functions
jlog.debug("Creating Apollo Server instance...");
const server = new ApolloServer({
    // simple auth check on each request
    context: async ({req}) => {
        jlog.info("req.headers = %O", req.headers);
         const auth = (req.headers && req.headers.authorization)  || "";
         const email = Buffer.from(auth,'base64').toString('ascii');
        // if email not found, return null
        if (!isEmail.validate(email)) return {user: null};
        const users = await store.users.findOrCreate({where: {email}});
        const user = users && users[0] ? users[0] : null;
        return {user: {...user.dataValues}};
    },
    typeDefs,
    resolvers,
    dataSources
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
