import React, { useState, useContext } from 'react';
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { AuthContext } from "./../context/auth";
import { useForm } from "./../utils/hooks";

function Register(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const { onChange, onSubmit, values: value } = useForm(registerUser, {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
    });


    const [adduser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, result) {
            context.login(result.data.register); //passing the user data to the application context
            props.history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: value
        // variables: {
        //     username : value.username,
        //     email : value.email,
        //     password : value.password,
        //     confirmPassword : value.confirmPassword,
        // }
    })
    function registerUser() {
        adduser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
                <h1>Register</h1>
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
                    label="Email"
                    placeholder="Email.."
                    type="email"
                    name="email"
                    value={value.email}
                    error={errors.email ? true : false}
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
                <Form.Input
                    label="confirm Password"
                    placeholder="confirm Password.."
                    type="password"
                    name="confirmPassword"
                    value={value.confirmPassword}
                    error={errors.confirmPassword ? true : false}
                    onChange={onChange}
                />

                <Button type="submit" primary>
                    Register
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

const REGISTER_USER = gql`
    mutation register(
        $username : String!
        $email : String!
        $password : String!
        $confirmPassword : String!
    ) {
        register(
            registerInput : {
                username : $username
                email : $email
                password : $password
                confirmPassword : $confirmPassword
            }
        ) {
            id
            email
            token
            username
            createdAt
        }
    }
`

export default Register;
