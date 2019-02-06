//@ts-check
const { debugFactory } = require("./debug-util");
const jlog = debugFactory("resolvers:");

const { paginateResults } = require("./utils");

module.exports = {
    Query: {
        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches();
            // sort in reverse chronological order for UI and cursor purposes
            allLaunches.reverse();

            const launches = paginateResults({
                after,
                pageSize,
                results: allLaunches
            });
            return {
                launches,
                cursor: launches.length ? launches[launches.length - 1].cursor : null,
                // if launches.length = allLaunches.length then hasMore is false
                hasMore: launches.length
                    ? launches[launches.length - 1].cursor !==
                      allLaunches[allLaunches.length - 1].cursor
                    : false
            };
        },
        launch: (_, { id }, { dataSources }) => {
            jlog.debug(`launch.id = ${id}`);
            const launch = dataSources.launchAPI.getLaunchById({ launchId: id });
            return launch;
        },
        me: async (_, __, { dataSources }) => {
            jlog.debug("calling me.findOrCreateUser with DataSources = %O", { dataSources });
            dataSources.userAPI.findOrCreateUser();
        }
    },
    Mission: {
        //set default size to 'large' in case not specified.
        missionPatch: (mission, { size } = { size: "LARGE" }) => {
            jlog.debug("missionPatch Resolver. Size = %s", size);
            return size === "SMALL" ? mission.missionPatchSmall : mission.missionPatchLarge;
        }
    },
    Launch: {
        isBooked: async (launch, _, { dataSources }) =>
            dataSources.isBookedOnLaunch({ launchId: launch.id })
    },
    User: {
        trips: async (_, __, { dataSources }) => {
            const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
            if (!launchIds.length) return [];
            return dataSources.launchAPI.getLaunchById({ launchIds }) || [];
        }
    },
    Mutation: {
        login: async (_, { email }, { dataSources }) => {
            const user = await dataSources.userAPI.findOrCreateUser({ email });
            if (user) return Buffer.from(email).toString("base64");
        },
        bookTrips: async (_, {launchIds}, {dataSources}) => {
            const results = await dataSources.userAPI.bookTrips({launchIds});
            const launches = await dataSources.launchAPI.getLaunchesById({launchIds});

            return {
                success: results && results.length === launchIds.length,
                message: results.length === launchIds.length 
                ? "trips booked successfully"
                : `the following trips couldn't be booked: ${launchIds.filter(
                    id => !results.includes(id),
                )}`,
                launches, 
            };
        },
        cancelTrip: async (_,  {launchId}, {dataSources}) =>  {
            const result = dataSources.userAPI.cancelTrip({launchId});

            if (!result) 
            return {
                success: false, 
                message: "failed to cancel trip",
            };

            const launch = await dataSources.launchAPI.getLaunchById({launchId});
            return {
                success: true,
                message: "trip canceled.", 
                launches: [launch],
            };
        },
    },
};
