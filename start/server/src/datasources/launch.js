const { RESTDataSource } = require("apollo-datasource-rest");
const { debugFactory } = require("../debug-util");
jlog = debugFactory("launch");

class LaunchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://api.spacexdata.com/v2/";
    }
    async getAllLaunches() {
        jlog.info("Calling getAllLaunches()");
        const response = await this.get("launches");
        // if array comes back then process each launch
        // if not array, then return empty array
        //
        // iterative call to launchReducer allows shape of GQL schema
        // to be defined independent from shape of data returned by REST endpoint.
        return Array.isArray(response) ? response.map(launch => this.launchReducer(launch)) : [];
    }
    // reformats data from REST to GQL shape
    launchReducer(launch) {
        jlog.info("calling launchReducer with launch id = %d", launch.flight_number || -1);
        return {
            id: launch.flight_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            mission: {
                name: launch.mission_name,
                missionPatchSmall: launch.links.mission_patch_small,
                missionPatchLarge: launch.links.mission_patch_large
            },
            rocket: {
                id: launch.rocket.rocket_id,
                name: launch.rocket.rocket_name,
                type: launch.rocket.rocket_type
            }
        };
    }
    async getLaunchById({ launchId }) {
        jlog.info("getLaunchById.launchId = %o", launchId);
        const response = await this.get("launches", { flight_number: launchId });
        return this.launchReducer(response[0]);
    }
    async getLaunchesById({ launchIds }) {
        jlog.info("getLaunchesById with [ids] = %o", {launchids });
        return Promise.all(launchIds.map(launchId => this.getLaunchById({ launchId })));
    }
}

module.exports = LaunchAPI;
