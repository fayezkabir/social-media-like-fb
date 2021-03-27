import React from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid, Image } from 'semantic-ui-react';

import PostCard from "./../components/PostCard"

function Home() {
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);

    const posts = data?.getPosts;

    return (
    <Grid centered>
        <Grid.Row className="page-title">
            <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
            {
                loading ?
                    (
                        <h1>loading posts....</h1>
                    )
                    :
                    (
                        posts && posts.map((post => (
                            <Grid.Column key={post.id} style={{marginBottom: 20}} mobile={16} tablet={8} computer={5}>
                                <PostCard post={post} />
                            </Grid.Column>
                        )))
                    )
            }
        </Grid.Row>
    </Grid>
    )
}

const FETCH_POSTS_QUERY = gql`
    query {
        getPosts{
                id
                body
                createdAt
                username
                likeCount
                commentCount
                comments {
                    id
                    createdAt
                    username
                    body
                }
                likes{
                    id
                    createdAt
                    username
                }
        }
}
`

export default Home;
