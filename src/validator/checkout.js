import validator from 'validator';
import isEmpty from './isEmpty';


const validateAndSanitizeCheckoutForm = ( data, hasStates = true, hasPassword = false ) => {

	let errors = {};
	let sanitizedData = {};

	/**
	 * Set the firstName value equal to an empty string if user has not entered the firstName, otherwise the Validator.isEmpty() wont work down below.
	 * Note that the isEmpty() here is our custom function defined in is-empty.js and
	 * Validator.isEmpty() down below comes from validator library.
	 * Similarly we do it for for the rest of the fields
	 */
	data.firstName = ( ! isEmpty( data.firstName ) ) ? data.firstName : '';
	data.lastName = ( ! isEmpty( data.lastName ) ) ? data.lastName : '';
	data.company = ( ! isEmpty( data.company ) ) ? data.company : '';
	data.country = ( ! isEmpty( data.country ) ) ? data.country : '';
	data.address1 = ( ! isEmpty( data.address1 ) ) ? data.address1 : '';
	data.address2 = ( ! isEmpty( data.address2 ) ) ? data.address2 : '';
	data.city = ( ! isEmpty( data.city ) ) ? data.city : '';
	data.state = ( ! isEmpty( data.state ) ) ? data.state : '';
	data.postcode = ( ! isEmpty( data.postcode ) ) ? data.postcode : '';
	data.phone = ( ! isEmpty( data.phone ) ) ? data.phone : '';
	data.email = ( ! isEmpty( data.email ) ) ? data.email : '';
	data.createAccount = ( ! isEmpty( data.createAccount ) ) ? data.createAccount : '';
	data.orderNotes = ( ! isEmpty( data.orderNotes ) ) ? data.orderNotes : '';
    data.password = ( ! isEmpty( data.password ) ) ? data.password : '';
    data.passwordConfirm = ( ! isEmpty( data.passwordConfirm ) ) ? data.passwordConfirm : '';
	// data.paymentMethod = ( ! isEmpty( data.paymentMethod ) ) ? data.paymentMethod : '';

	/**
	 * Checks for error if required is true
	 * and adds Error and Sanitized data to the errors and sanitizedData object
	 *
	 * @param {String} fieldName Field name e.g. Nome, Cognome
	 * @param {String} errorContent Error Content to be used in showing error e.g. Nome, Cognome
	 * @param {Integer} min Minimum characters required
	 * @param {Integer} max Maximum characters required
	 * @param {String} type Type e.g. email, phone etc.
	 * @param {boolean} required Required if required is passed as false, it will not validate error and just do sanitization.
	 */
	const addErrorAndSanitizedData = ( fieldName, errorContent, min, max, type = '', required ) => {

		/**
		 * Please note that this isEmpty() belongs to validator and not our custom function defined above.
		 *
		 * Check for error and if there is no error then sanitize data.
		 */
		if ( ! validator.isLength( data[ fieldName ], { min, max } ) ){
			errors[ fieldName ] = `${errorContent} deve avere da ${min} a ${max} caratteri`;
		}

		if ( 'email' === type && ! validator.isEmail( data[ fieldName ] ) ){
			errors[ fieldName ] = `${errorContent} non valida`;
		}

		if ( 'phone' === type && ! validator.isMobilePhone( data[ fieldName ] ) ) {
			errors[ fieldName ] = `${errorContent} non valido`;
		}


        if( 'passwordConfirm' === type && data[ fieldName] !== data.password  && hasPassword ) {
            errors[ fieldName ] = `${errorContent} non corrisponde alla password`;
        }

		if ( required && validator.isEmpty( data[ fieldName ] ) ) {
			errors[ fieldName ] = `${errorContent}: campo richiesto`;
		}

		// If no errors
		if ( ! errors[ fieldName ] ) {
			sanitizedData[ fieldName ] = validator.trim( data[ fieldName ] );
			sanitizedData[ fieldName ] = ( 'email' === type ) ? validator.normalizeEmail( sanitizedData[ fieldName ] ) : sanitizedData[ fieldName ];
			sanitizedData[ fieldName ] = validator.escape( sanitizedData[ fieldName ] );
		}

	};

    console.log( hasPassword )

	addErrorAndSanitizedData( 'firstName', 'Nome', 2, 35, 'string', true );
	addErrorAndSanitizedData( 'lastName', 'Cognome', 2, 35, 'string', true );
	addErrorAndSanitizedData( 'company', 'Azienda', 0, 35, 'string', false );
	addErrorAndSanitizedData( 'country', 'Nazione', 2, 55, 'string', true );
	addErrorAndSanitizedData( 'address1', 'Indirizzo', 12, 100,'string',true );
	addErrorAndSanitizedData( 'address2', '', 0, 254, 'string', false );
	addErrorAndSanitizedData( 'city', 'Città', 3, 25, 'string', true );
	addErrorAndSanitizedData( 'state', 'Provincia', 0, 254, 'string', hasStates );
	addErrorAndSanitizedData( 'postcode', 'CAP', 2, 10, 'postcode', true );
	addErrorAndSanitizedData( 'phone', 'Numero di telefono', 10, 15, 'phone', true );
	addErrorAndSanitizedData( 'email', 'Email', 11, 254, 'email', true );
    addErrorAndSanitizedData( 'password', 'Password', 0, 254, 'string', hasPassword );
    addErrorAndSanitizedData( 'passwordConfirm', 'La conferma', 0, 254, 'passwordConfirm', hasPassword );

	// The data.createAccount is a boolean value.
	sanitizedData.createAccount = data.createAccount;
	addErrorAndSanitizedData( 'orderNotes', '', 0, 254, 'string', false );
	// @TODO Payment mode error to be handled later.
	// addErrorAndSanitizedData( 'paymentMethod', 'Payment mode field', 2, 50, 'string', false );

	return {
		sanitizedData,
		errors,
		isValid: isEmpty( errors )
	}
};

export default validateAndSanitizeCheckoutForm;

