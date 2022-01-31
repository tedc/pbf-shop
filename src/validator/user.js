import validator from 'validator';
import isEmpty from './isEmpty';

export const validateAndSanitizeAccountForm = ( data, hasPassword = false ) => {
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
    data.displayName = ( ! isEmpty( data.displayName ) ) ? data.displayName : '';
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

        if( 'passwordConfirm' === type && data[ fieldName] !== data.password ) {
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

    addErrorAndSanitizedData( 'firstName', 'Nome', 2, 35, 'string', true );
    addErrorAndSanitizedData( 'lastName', 'Cognome', 2, 35, 'string', true );
    addErrorAndSanitizedData( 'displayName', 'Nome da visualizzaer', 0, 35, 'string', false );
    addErrorAndSanitizedData( 'password', 'Password', 6, 254, 'string', hasPassword );
    addErrorAndSanitizedData( 'passwordConfirm', 'La conferma', 6, 254, 'passwordConfirm', hasPassword );


    return {
        sanitizedData,
        errors,
        isValid: isEmpty( errors )
    }
}