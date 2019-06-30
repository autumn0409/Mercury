import React from 'react';
import { Query } from 'react-apollo'
import { Jumbotron, Container } from 'reactstrap';
import { ME_QUERY } from '../lib/graphql'
import {Link } from "react-router-dom"

class Profile extends React.Component {

    render() {

        return (
            <div className='d-flex flex-column justify-content-center'>
                <div>
                </div>
                <Query query={ME_QUERY}>
                    {({ loading, error, data, subscribeToMore }) => {
                        if (loading) return <p>Loading...</p>;
                        if (error) return <p>Error :(((</p>;

                        const me = data.me;

                        return (
                            <React.Fragment>

                            <div>
                                <Jumbotron fluid>
                                    <Container fluid>
                                    <h1 className="display-5">{me.username}'s profile</h1>
                                    <hr className="my-2" />
                                    <p>Email :{me.email}</p>
                                    <p>Age : {me.age}</p>
                                    <p>{me.posts.length} posts</p>
                                    <p><Link style={{color:"black"}} to="/myPosts">view my posts</Link>
                                    </p>
                                    <p><Link style={{color:"black"}} to="/favoritePosts">Posts I liked</Link>                                 </p>
                                 
                                     
                                    </Container>
                                </Jumbotron>
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