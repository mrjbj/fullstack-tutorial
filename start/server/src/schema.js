const { debugFactory } = require("./debug-util");
const jlog = debugFactory("schema:");
const { gql } = require("apollo-server");

jlog.debug("Loading GQL typeDefs...");

const typeDefs = gql`
    type Query {
        launches( # replace the current launches query with this one.
            pageSize: Int # records/page, default is 20
            after: String # if cursor supplied, will return rows following after
        ): LaunchConnection!
        launch(id: ID!): Launch
        me: User
    }
    type LaunchConnection {
        cursor: String! # pass into Launches query to return next pageSize chunk after this
        hasMore: Boolean!
        launches: [Launch]!
    }
    type Launch {
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
    }
    type Rocket {
        id: ID!
        name: String
        type: String
    }
    type User {
        id: ID!
        email: String!
        trips: [Launch]!
    }
    type Mission {
        name: String
        missionPatch(size: PatchSize): String
    }
    enum PatchSize {
        SMALL
        LARGE
    }
    type Mutation {
        bookTrips(launchIds: [ID]!): TripUpdateResponse!
        cancelTrip(launchId: ID!): TripUpdateResponse!
        login(email: String): String # login token
    }
    type TripUpdateResponse {
        success: Boolean!
        message: String
        launches: [Launch]
    }
`;

module.exports = typeDefs;
