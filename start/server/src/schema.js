const gql = require("apollo-server");

export const typeDefs = gql`
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

type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]  // return back mutated object, so ApolloClient can cache it
}

type Query {
    launches: [Launch]!
    launch(id: ID!): Launch
    me: User 
}
type Mutation {
    // if false, then return early with failure condition
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): String 
}`;
