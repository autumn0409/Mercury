import React from 'react'

import classes from './FormWrapper.module.css'

function FormWrapper(props) {
	return <div className={classes.wrapper}>{props.children}</div>
}

export default FormWrapper
