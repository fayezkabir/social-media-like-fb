import React, { useContext , useEffect } from 'react';
import { useQuery } from "@apollo/react-hooks";
import { Grid } from 'semantic-ui-react';

import { AuthContext } from "./../context/auth";
import PostCard from "./../components/PostCard";
import PostForm from "./../components/PostForm";
import { FETCH_POSTS_QUERY } from "./../utils/graphql";

function Home() {
    const { user , getPostCounter } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    useEffect(() => {

    }, [getPostCounter]);
    

    const posts = data?.getPosts;

    return (
        <Grid centered>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {
                    user && (
                        <Grid.Column  style={{ marginBottom: 20 }} mobile={16} tablet={8} computer={5}>
                            <PostForm />
                        </Grid.Column>
                    )
                }
                {
                    loading ?
                        (
                            <h1>loading posts....</h1>
                        )
                        :
                        (
                            posts && posts.map((post => (
                                <Grid.Column key={post.id} style={{ marginBottom: 20 }} mobile={16} tablet={8} computer={5}>
                                    <PostCard post={post} />
                                </Grid.Column>
                            )))
                        )
                }
            </Grid.Row>
        </Grid>
    )
}


export default Home;
