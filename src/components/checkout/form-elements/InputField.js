import Error from "../Error";
import PropTypes from 'prop-types';
import Abbr from "./Abbr";
import cx from 'classnames';
import { isEmpty, isNull, isUndefined } from 'lodash';

const InputField = ({ handleOnChange, inputValue, name, type, label, errors, placeholder, required, containerClassNames, isShipping, handleErrors, touched }) => {

    const inputId = `${name}-${isShipping ? 'shipping' : ''}`;
    const className = !isNull(containerClassNames) && !isUndefined(containerClassNames) && !isEmpty(containerClassNames) ? containerClassNames : 'column--s6';
    
    return (
        <div className={cx('column', 'column--input', 'column--relative', 'column--grow-30-bottom', className)}>
            <label className="label" htmlFor={inputId}>
                { label || '' }
                <Abbr required={required}/>
            </label>
            <input
                onChange={ handleOnChange }
                onBlur={ handleOnChange }
                value={ inputValue ?? '' }
                placeholder={placeholder}
                type={type}
                name={name}
                id={inputId}
                className={cx({ 'error' : errors && ( errors.hasOwnProperty( name ) ) && touched && ( touched.hasOwnProperty( name ) ) })}
            />
            <Error errors={ errors } fieldName={ name } touched={touched} />
        </div>
    )
}

InputField.propTypes = {
    handleOnChange: PropTypes.func,
    inputValue: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    errors: PropTypes.object,
    touched: PropTypes.object,
    required: PropTypes.bool,
    containerClassNames: PropTypes.string
}

InputField.defaultProps = {
    handleOnChange: () => null,
    inputValue: '',
    name: '',
    type: 'text',
    label: '',
    placeholder: '',
    errors: {},
    touched: {},
    required: false,
    containerClassNames: ''
}

export default InputField;
