import gql from "graphql-tag";
import { Loading } from "../components";
import { LAUNCH_TILE_DATA } from "./launches";

export const GET_LAUNCH_DETAILS = gql`
    query LaunchDetails($launchId: ID!) {
        launch(id: $launchId) {
            id
            site
            isBooked
            rocket {
                id
                name
                type
            }
            mission {
                name
                missionPatch
            }
            ...LaunchTile
        }
    }
    ${LAUNCH_TILE_DATA}
`;

export default function Launch({ launchId }) {
    return (
        <Query query={GET_LAUNCH_DETAILS} variables={{ launchId }}>
            {({ data, loading, error }) => {
                if (loading) return <Loading />;
                if (error) return <p>ERROR: {error.message}</p>;

                return (
                    <Fragment>
                        <Header image={data.launch.mission.missionPatch}>
                            {data.launch.mission.name}
                        </Header>
                        <LaunchDetail {...data.launch} />
                        <ActionButton {...data.launch} />
                    </Fragment>
                );
            }}
        </Query>
    );
}
