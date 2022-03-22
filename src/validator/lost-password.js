import validator from 'validator';
import { isEmpty, isNull } from 'lodash';

export const validateAndSanitizeLostForm = ( data ) => {
    let errors = {};
    let sanitizedData = {};
    data.email = ( ! isEmpty( data.email ) ) ? data.email : '';
    const addErrorAndSanitizedData = ( fieldName, errorContent, min, max, type = '', required ) => {

        /**
         * Please note that this isEmpty() belongs to validator and not our custom function defined above.
         *
         * Check for error and if there is no error then sanitize data.
         */
        if ( ! validator.isLength( data[fieldName], { min, max } ) ) {
            errors[ fieldName ] = `${errorContent} deva avere da ${min} a ${max} caratteri`;
        }

        if ( ! validator.isEmail( data[fieldName] ) ) {
            errors[ fieldName ] = `${errorContent} non valida`;
        }


        // If no errors
        if ( ! errors[ fieldName ] ) {
            sanitizedData[ fieldName ] = validator.trim( data[ fieldName ] );
            sanitizedData[ fieldName ] = validator.normalizeEmail( sanitizedData[ fieldName ] );
            sanitizedData[ fieldName ] = validator.escape( sanitizedData[ fieldName ] );
        }

    };

    addErrorAndSanitizedData( 'email', 'Email', 2, 255, 'string', true );

    return {
        sanitizedData,
        errors,
        isValid: isEmpty( errors )
    }
}

export const validateAndSanitizeResetForm = ( data ) => {
    let errors = {};
    let sanitizedData = {};
    data.password = ( ! isEmpty( data.password ) ) ? data.password : '';
    data.passwordConfirm = ( ! isEmpty( data.passwordConfirm ) ) ? data.passwordConfirm : '';
    const addErrorAndSanitizedData = ( fieldName, errorContent, min, max, type = '', required ) => {

        /**
         * Please note that this isEmpty() belongs to validator and not our custom function defined above.
         *
         * Check for error and if there is no error then sanitize data.
         */

        if ( ! validator.isLength( data[ fieldName ], { min, max } ) ){
            errors[ fieldName ] = `${errorContent} deve avere da ${min} a ${max} caratteri`;
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
            sanitizedData[ fieldName ] = validator.escape( sanitizedData[ fieldName ] );
        }

    };

    addErrorAndSanitizedData( 'password', 'Password', 6, 254, 'string', true );
    addErrorAndSanitizedData( 'passwordConfirm', 'La conferma', 6, 254, 'passwordConfirm', true );

    return {
        sanitizedData,
        errors,
        isValid: isEmpty( errors )
    }
}