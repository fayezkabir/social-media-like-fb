import React, { useState } from 'react';
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "./../utils/hooks";

function Login(props) {
    const [errors, setErrors] = useState({});
    const { onChange, onSubmit, values: value } = useForm(signinUser, {
        username: "",
        password: ""
    });



    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, result) {
            props.history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: value
    })
    function signinUser() {
        loginUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="username.."
                    type="text"
                    name="username"
                    value={value.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password.."
                    type="password"
                    name="password"
                    value={value.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />

                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {
                Object.keys(errors).length > 0 && (
                    <div className="ui error message">
                        <ul className="list">
                            {
                                Object.values(errors).map((value) => (
                                    <li key={value}>{value}</li>
                                ))
                            }
                        </ul>
                    </div>
                )
            }
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username : String!
        $password : String!
    ) {
        login(
                username : $username
                password : $password
        ) {
            id
            email
            token
            username
            createdAt
        }
    }
`

export default Login;
