import React, { Component } from 'react'

import classes from './Layout.module.css'

class Layout extends Component {
	render() {
		return <div className={classes.wrapper}>{this.props.children}</div>
	}
}

export default Layout
