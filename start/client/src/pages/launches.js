import gql from "graphql-tag";
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import { Button, Header, LaunchTile, Loading } from "../components";

export const LAUNCH_TILE_DATA = gql`
    fragment LaunchTile on Launch {
        id
        isBooked
        rocket {
            id
            name
        }
        mission {
            name
            missionPatch
        }
    }
`;

const GET_LAUNCHES = gql`
    query launchList($after: String) {
        launches(after: $after) {
            cursor
            hasMore
            launches {
                ...LaunchTile
            }
        }
    }
    ${LAUNCH_TILE_DATA}
`;

// render prop with render function as props.children
// context for render function is result of query.
// syntax {({data, loading, error})} parses like so:
//  first brace is for JSX to wrap the paren as indicating start of anonmyous function
//  paren is javascript anonymous function definition
//  second brace is destructuring of the this.props that will eventuall get passed
// in by react when calling this function.
export default function Launches() {
    return (
        <Query query={GET_LAUNCHES}>
            {({ data, loading, error, fetchMore }) => {
                // error
                if (loading) return <Loading />;
                if (error) {
                    console.log(error);
                    return <p>ERROR</p>;
                }

                //success
                return (
                    <Fragment>
                        <Header />
                        {data.launches &&
                            data.launches.launches &&
                            data.launches.launches.map(launch => (
                                <LaunchTile key={launch.id} launch={launch} />
                            ))}
                        {/* paginate if needed */}
                        {console.log(data.launches)}
                        {data.launches && data.launches.hasMore && (
                            <Button
                                onClick={() =>
                                    fetchMore({
                                        variables: { after: data.launches.cursor },
                                        updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                                            if (!fetchMoreResult) return prev;
                                            return {
                                                ...fetchMoreResult,
                                                launches: {
                                                    ...fetchMoreResult.launches,
                                                    launches: [
                                                        ...prev.launches.launches,
                                                        ...fetchMoreResult.launches.launches
                                                    ]
                                                }
                                            };
                                        }
                                    })
                                }
                            >
                                Load More
                            </Button>
                        )}
                    </Fragment>
                );
            }}
        </Query>
    );
}
