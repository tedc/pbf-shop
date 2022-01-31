const Error = ( { errors, fieldName, touched } ) => {
    return(
		errors && ( errors.hasOwnProperty( fieldName ) ) && touched && ( touched.hasOwnProperty( fieldName ) ) ? (
			<div className="form__error">{ errors[fieldName] }</div>
		) : ''
	)
};

export default Error;
