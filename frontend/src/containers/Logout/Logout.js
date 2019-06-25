import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { Redirect } from 'react-router-dom'

import { signout } from '../../lib/utils'
import withAuthGuard from '../../hoc/AuthGuard/AuthGuard'

class Logout extends Component {
	render() {
		const { isAuth } = this.props;

		return (
			<ApolloConsumer>
				{client => {
					if (process.browser) {
						if (isAuth) {
							signout(client);
							window.location.reload();
						}
					}
					return <Redirect to="/frontPage" />
				}}
			</ApolloConsumer>
		)
	}
}

export default withAuthGuard(Logout)
