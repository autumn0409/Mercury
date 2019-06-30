import React, { Component } from 'react'
import { Mutation, withApollo } from 'react-apollo'
import { withRouter, Redirect } from 'react-router-dom'
import { Formik } from 'formik'
import { Col,Jumbotron,Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap'

import { LOGIN_MUTATION, LOGIN_SCHEMA } from '../../lib/graphql'
import { setCookie, removeAllCookies } from '../../lib/utils'
import withAuthGuard from '../../hoc/AuthGuard/AuthGuard'
import { Hint } from '../../components/Utils'
import FormWrapper from '../../hoc/FormWrapper/FormWrapper'

// TODO Componentize login form

class Login extends Component {
    render() {
        const { client, history, isAuth, loading: authHint } = this.props

        if (isAuth) {
            return <Redirect to="/frontPage" />
        }
        return (
            <Mutation
                mutation={LOGIN_MUTATION}
                onCompleted={data => {
                    removeAllCookies()

                    setCookie(data.login.token)

                    // Force a reload of all current queries now that user is
                    // logged in
                    client.cache.reset().then(() => {
                        window.location.reload();
                        window.history.push('/frontPage')
                    })
                }}
                onError={error => console.error(error)}
            >
                {(login, { error, loading }) => {
                    return loading || authHint ? (
                        <Hint />
                    ) : (
                            <Formik
                                initialValues={{ username: '', password: '' }}
                                validationSchema={LOGIN_SCHEMA}
                                onSubmit={(values, { setSubmitting }) => {
                                    login({
                                        variables: {
                                            username: values.username.toLowerCase(),
                                            password: values.password
                                        }
                                    })
                                    setSubmitting(false)
                                }}
                                render={({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    isSubmitting
                                }) => (
                                    <Jumbotron style={{padding:"20px 10px", background:"white"}}>
                                        <h5>Login</h5>
                                        <Col sm = {8}>
                                            
                                            <Form onSubmit={handleSubmit}>
                                                <FormGroup>
                                                    <Label for="username">Username</Label>
                                                    <Input
                                                        id="username"
                                                        name="username"
                                                        value={values.username}
                                                        label="username"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        placeholder="Username"
                                                    />
                                                    <FormText color="danger">
                                                        {(errors.username
                                                            ? errors.username.replace('username', 'Username')
                                                            : '') ||
                                                            (error ? 'Unable to login. (check credentials)' : '')}
                                                    </FormText>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="password">Password</Label>
                                                    <Input
                                                        id="password"
                                                        name="password"
                                                        value={values.password}
                                                        type="password"
                                                        autoComplete="current-password"
                                                        label="Password"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        placeholder="Password"
                                                    />
                                                    <FormText color="danger">
                                                        {errors.password
                                                            ? errors.password.replace('password', 'Password')
                                                            : ''}
                                                    </FormText>
                                                </FormGroup>
                                               
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            !values.username ||
                                                            !values.password ||
                                                            isSubmitting ||
                                                            !!(errors.username && touched.username) ||
                                                            !!(errors.password && touched.password)
                                                        }
                                                        outline
                                                        style={{ width: '120px', margin: '5px',padding:"3px" }}
                                                        color="primary"
                                                    >
                                                        Login
											</Button>
                                                    
                                                <small>Don't have an account? <a href="/register">register</a>!</small>
                                            </Form>
                                        </Col>
                                    </Jumbotron>
                                    )}
                            />
                        )
                }}
            </Mutation>
        )
    }
}

export default withAuthGuard(withRouter(withApollo(Login)))
