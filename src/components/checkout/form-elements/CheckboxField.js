import PropTypes from 'prop-types';
import cx from 'classnames';

const CheckboxField = ({ handleOnChange, checked, name, label, placeholder, className }) => {

    return (
        <label className={cx("label", className )} htmlFor={name}>
            <input
                onChange={ handleOnChange }
                placeholder={placeholder}
                type="checkbox"
                checked={checked}
                name={name}
                id={name}
            />
            <span className="label__check">{ label || '' }</span>
        </label>
    )
}

CheckboxField.propTypes = {
    handleOnChange: PropTypes.func,
    checked: PropTypes.bool,
    name: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string
}

CheckboxField.defaultProps = {
    handleOnChange: () => null,
    checked: false,
    name: '',
    label: '',
    placeholder: '',
    errors: {},
    className: ''
}

export default CheckboxField;
