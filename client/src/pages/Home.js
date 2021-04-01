import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition, Loader, Image, Segment , Header , Icon } from 'semantic-ui-react';

import { AuthContext } from "./../context/auth";
import PostCard from "./../components/PostCard";
import PostForm from "./../components/PostForm";
import { FETCH_POSTS_QUERY } from "./../utils/graphql";

function Home() {
    const [ internetState , setInternet ] = useState(false);
    const { user, getPostCounter } = useContext(AuthContext);
    const { loading, data, refetch } = useQuery(FETCH_POSTS_QUERY);
    useEffect(() => {
        setInternet(window.navigator.onLine)
        if(window.navigator.onLine)  refetch();
    }, [getPostCounter , window.navigator.onLine]);


    const posts = data?.getPosts;


    return (
        !internetState ?
        <Grid centered className="loading">
            <Header as='h2' icon>
                <Icon name='globe' />
                Your Offline
                <Header.Subheader>
                    connect to internet to enjoy the app. 
                </Header.Subheader>
            </Header>
            </Grid>

            :


            <Grid centered className="loading">
                <Grid.Row className="page-title">
                    <h1>Recent Posts</h1>
                </Grid.Row>
                <Grid.Row>
                    {
                        user && (
                            <Grid.Column style={{ marginBottom: 20 }} mobile={16} tablet={8} computer={5}>
                                <PostForm />
                            </Grid.Column>
                        )
                    }
                    {
                        loading ?
                            (
                                // <h1>loading posts....</h1>
                                <Segment style={{ width: "100%" }}>
                                    <Loader active />

                                    <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                                </Segment>
                            )
                            :
                            (
                                <Transition.Group
                                    animation="jiggle"
                                    duration={500}
                                >
                                    {
                                        posts && posts.map((post => (
                                            <Grid.Column key={post.id} style={{ marginBottom: 20 }} mobile={16} tablet={8} computer={5}>
                                                <PostCard post={post} refetch={refetch} />
                                            </Grid.Column>
                                        )))

                                    }
                                </Transition.Group>
                            )
                    }
                </Grid.Row>
            </Grid>
    )

}


export default Home;
