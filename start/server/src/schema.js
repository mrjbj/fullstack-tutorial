const { debugFactory } = require("./debug-util");
const jlog = debugFactory("schema:");
const { gql } = require("apollo-server");

jlog.info("Loading GQL typeDefs...");

const typeDefs = gql`
    type Query {
        launches: [Launch]!
        launch(id: ID!): Launch
        me: User
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
