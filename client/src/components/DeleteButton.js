import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../utils/graphql";
import MyPopup from "./../utils/myPopup";


function DeleteButton(props) {
    const { postId, commentId, callback, refetch } = props;
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment, loading] = useMutation(mutation, {
        update(cache, result) {
            setConfirmOpen(false);
            console.log(result);


            // const data = proxy.readQuery({
            //     query : FETCH_POSTS_QUERY
            // });
            // data.getPosts = data.getPosts.filter(p => p.id !== postId);
            // proxy.writeQuery({
            //     query: FETCH_POSTS_QUERY,
            //     data: {
            //       getPosts: [...data.getPosts],
            //     },
            //   });
            if (!commentId) {
                const { getPosts } = cache.readQuery({ query: FETCH_POSTS_QUERY });
                cache.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: { getPosts: [...getPosts] },
                    variables: { id: postId }
                });
            }
            refetch();


            if (callback) {
                callback();
            }
        },
        variables: {
            postId: postId,
            commentId
        },
        onError(err) {
            console.log(err);
        }
    })

    return (
        <div className={`$${loading ? "loading" : ""}`}>

            <MyPopup content={commentId && postId ? "click to delete the comment" : "click to delete the post"}>

                <Button color="red"
                    floated="right"
                    onClick={() => setConfirmOpen(true)}
                >
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComment}>

            </Confirm>
        </div>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId : ID!) {
        deletePost(postId : $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($commentId : ID! , $postId : ID!) {
        deleteComment(commentId : $commentId ,postId : $postId ) {
            id
            body
            createdAt
            username
            comments {
                id
                createdAt
                username
                body
            }
            likes{
                id
                username
            }
            likeCount
            commentCount

        }
    }
`

export default DeleteButton