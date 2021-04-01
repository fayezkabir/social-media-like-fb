import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks"
import { Button, Card, Icon, Label, Grid, Image, Form } from "semantic-ui-react";
import moment from "moment"

import { AuthContext } from "./../context/auth";
import LikeButton from "./../components/LikeButton"
import DeleteButton from "../components/DeleteButton";
import MyPopup from "../utils/myPopup";


function SinglePost(props) {
    const postId = props.match.params.postId;
    const { user, updateCounter } = useContext(AuthContext);


    const commentInputRef = useRef(null);

    const [commentText, setCommentText] = useState("");

    const { data, refetch } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    });

    const getPost = data?.getPost;



    const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update(cache, result) {
            setCommentText("");
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: commentText
        },
        onError(err) {
            console.log(err)
        }
    })

    function deletePostCallback() {
        console.log("hitting")
        props.history.push("/");
    }

    let postMarkUp;
    if (!getPost) {
        postMarkUp = <p>Loading Post..........</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost;

        postMarkUp = (

            <Grid centered>

                <Grid.Row>
                    <Grid.Column width={2}>

                        <Image
                            floated='right'
                            size='mini'
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>

                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>
                                    {body}
                                </Card.Description>
                            </Card.Content>
                            <hr />

                            <Card.Content extra>
                                <LikeButton user={user} refetch={refetch} updateCounter={updateCounter} post={{ id, likes, likeCount }} />
                                <MyPopup content="comments">
                                    <Button as="div"
                                        labelPosition="right"
                                        onClick={() => console.log("yuppp")}>
                                        <Button basic color="blue">
                                            <Icon name="comments" />
                                        </Button>
                                        <Label basic color="blue" pointing="left">
                                            {commentCount}
                                        </Label>
                                    </Button>
                                </MyPopup>
                                {
                                    user && user.username === username && (
                                        <DeleteButton postId={id} refetch={refetch} callback={deletePostCallback} />
                                    )
                                }

                            </Card.Content>
                        </Card>
                        {
                            user && (
                                <Card fluid>
                                    <Card.Content>
                                        <p>post a comment</p>
                                        <Form>
                                            <div className="ui  action input fluid">
                                                <input type="text"
                                                    placeholder="comment....."
                                                    name="comment"
                                                    value={commentText}
                                                    ref={commentInputRef}
                                                    onChange={(event) => setCommentText(event.target.value)}
                                                />
                                                <button type="submit" className="ui button teal"
                                                    disabled={commentText.trim() === ""} onClick={submitComment}
                                                >
                                                    Submit
                                            </button>
                                            </div>
                                        </Form>
                                    </Card.Content>
                                </Card>
                            )
                        }


                        {
                            comments && comments.map(comment => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {user && user.username === comment.username && (
                                            <DeleteButton postId={id} refetch={refetch} commentId={comment.id} />
                                        )}
                                        <Card.Header>{comment.username}</Card.Header>
                                        <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                        <Card.Description>
                                            {comment.body}
                                        </Card.Description>

                                    </Card.Content>

                                </Card>
                            ))
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkUp;
}

const FETCH_POST_QUERY = gql`
        query($postId : ID!) {
            getPost(postId : $postId) {    
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
                likes {
                    id
                    username
                    createdAt
                }
                likeCount
                commentCount                
            }
        }
`

const CREATE_COMMENT_MUTATION = gql`
    mutation ($postId : ID! , $body : String!) {
        createComment(postId : $postId , body : $body) {
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
            commentCount
        }
    }
`

export default SinglePost;