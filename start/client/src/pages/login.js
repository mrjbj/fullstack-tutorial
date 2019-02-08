import { LoginForm , Loading} from "../components";
import React from "react";
import {Mutation, ApolloConsumer} from "react-apollo";
import gql from "graphql-tag";

export const LOGIN_USER = gql`
    mutation login($email: String!) {
        login(email: $email)
    }
`;

export default function Login() {
    return (
        <ApolloConsumer>
            {client => (
                <Mutation
                    mutation={LOGIN_USER}
                    /* onCompleted called back once mutation completes.
                       will supply return value in shape {data: {login: '}} {login} below is destructured from login mutation's return value 
                       which looks like {data: {login: "amFzb25AYnJ1Y2Vqb25lcy5iaXo="}}
                       the string {login} below is therefore a destructuring of this token from return data
                    */
                    onCompleted={({ login }) => {
                        localStorage.setItem("token", login);
                        client.writeData({ data: { isLoggedIn: true } });
                    }}
                >
                    { /* mutation render prop function
                         supplies mutation function to run, mutation context */}
                    {(login, { loading, error }) => {
                        if (loading) return <Loading />;
                        if (error) return <p>An error occurred.</p>;
                        //success
                        return <LoginForm login={login} />;
                    }}
                </Mutation>
            )}
        </ApolloConsumer>
    );
}
