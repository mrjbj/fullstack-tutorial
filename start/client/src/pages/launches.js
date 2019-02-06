import gql from "graphql-tag";
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import { Header, LaunchTile, Loading } from "../components";

const GET_LAUNCHES = gql`
    query launchList($after: String) {
        launches(after: $after) {
            cursor
            hasMore
            launches {
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
        }
    }
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
            {({ data, loading, error }) => {
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
                    </Fragment>
                );
            }}
        </Query>
    );
}
