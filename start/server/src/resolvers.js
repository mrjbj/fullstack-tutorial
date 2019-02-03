//@ts-check
const { debugFactory } = require("./debug-util");
const jlog = debugFactory("resolvers:");

module.exports = {
    Query: {
        launches: async (_, __, { dataSources }) => {
            const launches = await dataSources.launchAPI.getAllLaunches();
            return launches;
        },
        launch: (_, { id }, { dataSources }) => {
            jlog.info(`launch.id = ${id}`);
            const launch = dataSources.launchAPI.getLaunchById({ launchId: id });
            return launch;
        },
        me: async (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    }
};
