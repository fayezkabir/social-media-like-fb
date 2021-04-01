import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Icon, Label } from "semantic-ui-react"

import { AuthContext } from "./../context/auth";
import MyPopup from "../utils/myPopup";



function LikeButton({ user, refetch, post: { id, likes, likeCount } }) {
    const { getPostCounter, updateCounter } = useContext(AuthContext);
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true);
        }
        else { setLiked(false) };
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id },
        update(proxy, result) {
            // const { getPosts } = cache.readQuery({ query: FETCH_POSTS_QUERY });
            // console.log({} , result);
            // cache.writeQuery({
            //     query: FETCH_POSTS_QUERY,
            //     data: { getPosts: getPosts },
            //     variables : {id : result.data.likePost.id}
            // });

            // const data = proxy.readQuery(
            //     {
            //         query: FETCH_POSTS_QUERY
            //     }
            // );
            refetch();//this is my research
            // console.log(data.getPosts.filter(id => id.data.likePost.id))

            // data.getPosts = [...data.getPosts];

            // proxy.writeQuery({
            //     query: FETCH_POSTS_QUERY,
            //     data: {
            //       getPosts: [...data.getPosts],
            //     },
            //   });
            // updateCounter(getPostCounter ? getPostCounter+1  : 1)
        },
        onError(err) { },
    })


    const likeButton = user ? (
        liked ? (

            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (

            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )

    ) :
        (

            <Button color='teal' as={Link} to="/login" basic>
                <Icon name='heart' />
            </Button>
        )
    return (

        <Button as='div' labelPosition='right' onClick={likePost}>
            <MyPopup content={liked ? "click to unlike" : "click to like"}>
                {likeButton}
            </MyPopup>
            <Label basic color='teal' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId : ID!) {
        likePost(postId : $postId) {
            id
            username
            likes{
                id
                username
            }
            likeCount
            
        }
    }
`

export default LikeButton;