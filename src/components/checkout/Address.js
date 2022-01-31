import PropTypes from 'prop-types';
import CountrySelection from "./CountrySelection";
import StateSelection from "./StatesSelection";
import InputField from "./form-elements/InputField";

const Address = ({input, countries, states, handleOnChange, isFetchingStates, isShipping, handleErrors}) => {

    const {errors, touched} = input || {};

    return (
        <>
            <InputField
                name="firstName"
                inputValue={input?.firstName}
                required
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                label="Nome"
                errors={errors}
                touched={touched}
                isShipping={isShipping}
            />
            <InputField
                name="lastName"
                inputValue={input?.lastName}
                required
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                label="Cognome"
                errors={errors}
                touched={touched}
                isShipping={isShipping}
            />
            {/* Country Selection*/}
            <CountrySelection
                input={input}
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                countries={countries}
                touched={touched}
                errors={errors}
                isShipping={isShipping}
            />
            <InputField
                name="address1"
                inputValue={input?.address1}
                required
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                label="Indirizzo"
                placeholder="Via e numero civico"
                errors={errors}
                touched={touched}
                isShipping={isShipping}
            />
            <InputField
                name="address2"
                inputValue={input?.address2}
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                label="Abitazione (opzionale)"
                placeholder="Appartamento, Suite, Unità, Ufficio, piano, ecc..."
                errors={errors}
                touched={touched}
                isShipping={isShipping}
            />
            {/* State */}
            <StateSelection
                input={input}
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                states={states}
                isShipping={isShipping}
                touched={touched}
                errors={errors}
                isFetchingStates={isFetchingStates}
            />
            <InputField
                name="city"
                required
                inputValue={input?.city}
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                label="Città"
                errors={errors}
                touched={touched}
                isShipping={isShipping}
                containerClassNames="mb-4"
            />
            <InputField
                name="postcode"
                inputValue={input?.postcode}
                required
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                label="CAP"
                errors={errors}
                touched={touched}
                isShipping={isShipping}
            />
            <InputField
                name="phone"
                inputValue={input?.phone}
                required
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                label="Telefono"
                errors={errors}
                touched={touched}
                isShipping={isShipping}
            />
            { !isShipping && 
            <InputField
                name="email"
                type="email"
                inputValue={input?.email}
                required
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                label="Email"
                errors={errors}
                isShipping={isShipping}
                containerClassNames="mb-4"
            />}
            { !isShipping && <InputField
                name="company"
                inputValue={input?.company}
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                label="Nome della società (opzionale)"
                errors={errors}
                isShipping={isShipping}
            /> }
            { !isShipping && 
            <InputField
                name="vat"
                inputValue={input?.vat}
                handleOnChange={handleOnChange}
                handleErrors={handleErrors}
                label="CF/P.Iva (opzionale)"
                errors={errors}
                isShipping={isShipping}
            /> }
            {/*	@TODO Create an Account */}
            {/*<div className="form-check">*/}
            {/*	<label className="leading-7 text-sm text-gray-600" className="form-check-label">*/}
            {/*		<input onChange={ handleOnChange } className="form-check-input" name="createAccount" type="checkbox"/>*/}
            {/*			Create an account?*/}
            {/*	</label>*/}
            {/*</div>*/}
            {/*<h2 className="mt-4 mb-4">Additional Information</h2>*/}
            {/* @TODO Order Notes */}
            {/*<div className="form-group mb-3">*/}
            {/*	<label className="leading-7 text-sm text-gray-600" htmlFor="order-notes">Order Notes</label>*/}
            {/*	<textarea onChange={ handleOnChange } defaultValue={ input.orderNotes } name="orderNotes" className="form-control woo-next-checkout-textarea" id="order-notes" rows="4"/>*/}
            {/*	<Error errors={ input.errors } fieldName={ 'orderNotes' }/>*/}
            {/*</div>*/}
        </>
    );
};

Address.propTypes = {
    input: PropTypes.object,
    countries: PropTypes.array,
    handleOnChange: PropTypes.func,
    isFetchingStates: PropTypes.bool,
    isShipping: PropTypes.bool
}

Address.defaultProps = {
    input: {},
    countries: [],
    handleOnChange: () => null,
    isFetchingStates: false,
    isShipping: false
}

export default Address;
