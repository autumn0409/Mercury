import React from 'react';
import { Query } from 'react-apollo'

import { ME_QUERY } from '../lib/graphql'

class Profile extends React.Component {

    render() {

        return (
            <div className='d-flex flex-column justify-content-center'>
                <div>
                    <h3>Profile</h3>
                </div>
                <Query query={ME_QUERY}>
                    {({ loading, error, data, subscribeToMore }) => {
                        if (loading) return <p>Loading...</p>;
                        if (error) return <p>Error :(((</p>;

                        const me = data.me;

                        return (
                            <React.Fragment>
                                <div>
                                    <div>Username</div>
                                    <div>{me.username}</div>
                                </div>
                                <div>
                                    <div>Email</div>
                                    <div>{me.email}</div>
                                </div>
                                <div>
                                    <div>Age</div>
                                    <div>{me.age}</div>
                                </div>
                            </React.Fragment>
                        )
                    }}
                </Query>
            </div>
        );
    }
}

export default Profile;