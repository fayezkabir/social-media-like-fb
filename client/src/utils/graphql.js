import gql from "graphql-tag";


export const FETCH_POSTS_QUERY = gql`
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