import React, { Component } from 'react'
import { Mutation, withApollo } from 'react-apollo'
import { withRouter, Redirect } from 'react-router-dom'
import { Formik } from 'formik'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'

import { REGISTER_MUTATION, REGISTER_SCHEMA } from '../../lib/graphql'
import { setCookie, removeAllCookies } from '../../lib/utils'
import withAuthGuard from '../../hoc/AuthGuard/AuthGuard'
import { Hint } from '../../components/Utils'
import FormWrapper from '../../hoc/FormWrapper/FormWrapper'

class Register extends Component {
	render() {
		const { client, history, isAuth, loading: authHint } = this.props

		if (isAuth) {
			return <Redirect to="/frontPage" />
		}
		return (
			<Mutation
				mutation={REGISTER_MUTATION}
				onCompleted={data => {
					removeAllCookies()

					setCookie(data.createUser.token)

					// Force a reload of all current queries now that user is
					// logged in
					client.cache.reset().then(() => {
						window.location.reload();
					})
				}}
				onError={error => console.error(error)}
			>
				{(register, { error, loading }) =>
					loading || authHint ? (
						<Hint />
					) : (
							<Formik
								initialValues={{ username: '', password: '', email: '', age: '' }}
								validationSchema={REGISTER_SCHEMA}
								onSubmit={
									(values, { setSubmitting }) => {
										register({
											variables: {
												username: values.username.toLowerCase(),
												password: values.password,
												email: values.email,
												age: parseInt(values.age)
											}
										}
										)
										console.log(values)
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
										<FormWrapper>
											<h1>Register</h1>
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
															(error ? 'Unable to register. (contact staff)' : '')}
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

												<FormGroup>
													<Label for="email">Email</Label>
													<Input
														id="email"
														name="email"
														value={values.email}
														type="email"
														autoComplete="current-email"
														label="Email"
														onChange={handleChange}
														onBlur={handleBlur}
														placeholder="Email"
													/>
													<FormText color="danger">
														{errors.email
															? errors.email.replace('email', 'Email')
															: ''}
													</FormText>
												</FormGroup>
												<FormGroup>
													<Label for="age">Age</Label>
													<Input
														id="age"
														name="age"
														value={values.age}
														type="number"
														autoComplete="current-age"
														label="Age"
														onChange={handleChange}
														onBlur={handleBlur}
														placeholder="Age"
													/>
													<FormText color="danger">
														{errors.age
															? errors.age.replace('age', 'Age')
															: ''}
													</FormText>
												</FormGroup>
												<div className="col-sm-12 text-center">
													<Button
														type="submit"
														disabled={
															!values.username ||
															!values.password ||
															!values.email ||
															!values.age ||
															isSubmitting ||
															!!(errors.username && touched.username) ||
															!!(errors.password && touched.password) ||
															!!(errors.email && touched.email) ||
															!!(errors.age && touched.age)
														}
														outline
														style={{ width: '100px', margin: '5px' }}
														color="primary"
													>
														Register
											</Button>
													<Button
														onClick={() => history.push('/login')}
														outline
														style={{ width: '100px', margin: '5px' }}
														color="info"
													>
														Login
											</Button>
												</div>
											</Form>
										</FormWrapper>
									)}
							/>
						)
				}
			</Mutation>
		)
	}
}

export default withAuthGuard(withRouter(withApollo(Register)))
