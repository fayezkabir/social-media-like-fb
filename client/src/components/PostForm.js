import React from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "./../utils/hooks";
import { FETCH_POSTS_QUERY } from "./../utils/graphql";
// import { AuthContext } from "./../context/auth";



function PostForm(props) {
    // const { getPostCounter , updateCounter } = useContext(AuthContext);

    const { onChange, onSubmit, values } = useForm(createPostCallback, {
        body: ""
    });


    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        update(cache, result) {
            // const data = proxy.readQuery(
            //     {
            //         query: FETCH_POSTS_QUERY
            //     }
            // );

            // data.getPosts = [result.data.createPost, ...data.getPosts];

            // proxy.writeQuery({
            //     query: FETCH_POSTS_QUERY,
            //     data: {
            //       getPosts: [result.data.createPost, ...data.getPosts],
            //     },
            //   });





            const { getPosts } = cache.readQuery({ query: FETCH_POSTS_QUERY });

            console.log(getPosts);
            cache.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: { getPosts: [result.data.createPost, ...getPosts] },
                variables : {id : result.data.createPost.id}
            });

            // updateCounter(getPostCounter ? getPostCounter+1  : 1); //this is just for an my context practice


            values.body = ""
        },
        onError(err) {
            // setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },

        variables: values
    });

    function createPostCallback() {
        createPost();
    };
    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create Post</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hello buddies"
                        name="body"
                        value={values.body}
                        onChange={onChange}
                        error={error ? true : false}
                    />
                    <Button type="submit" disabled={!values.body} color="teal">
                        submit
            </Button>
                </Form.Field>
            </Form>
            {
                error && (
                    <div className="ui error message" style={{ marginBottom: 20 }}>
                        <ul className="list">
                            <li>{error.graphQLErrors[0].message}</li>
                        </ul>
                    </div>
                )
            }
        </>
    )
}


const CREATE_POST_MUTATION = gql`
    mutation createPost($body : String!) {
        createPost(body : $body ) {
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

export default PostForm;