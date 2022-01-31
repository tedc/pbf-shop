import PropTypes from 'prop-types';
import {memo, useState} from 'react';
import cx from 'classnames';
import { isNull, find } from 'lodash';
import InputField from "./form-elements/InputField";
import Abbr from "./form-elements/Abbr";
import Error from './Error';
import Select from 'react-select';
import ArrowDown from "../icons/ArrowDown";

const StateSelection = ({handleOnChange, input, states, isFetchingStates, isShipping, touched}) => {

    const {state, errors} = input || {};

    const inputId = `state-${isShipping ? 'shipping' : 'billing'}`;
    const [value, setValue] = useState( {
        target: {
            name: 'state',
            value: input?.state
        }
    } );
    const current = find(states, (item) => item.value === state)
    const handleSelect = (newValue)=> {
        const v = isNull(newValue) ? {target: {
                name: 'state',
                value: null
            }} : {
            target: {
                name: 'state',
                value: newValue.value
            }
        };
        setValue( v );
        return v;
    }
    const customStyles = {
        input: (provided, state)=> ({
            ...provided,
            height: 30,
            fontSize: 14,
            paddingLeft: 7,
            paddingRight: 7
        }),
        control: (provided, state)=> {
            return ({
                    ...provided,
                backgroundColor: 'transparent',
                borderColor: errors && ( errors.hasOwnProperty( 'state' ) ) && touched && ( touched.hasOwnProperty( 'state' ) ) ? 'red' : 'black',
                boxShadow: 'none',
                "&:hover" : {
                    borderColor: errors && ( errors.hasOwnProperty( 'state' ) ) && touched && ( touched.hasOwnProperty( 'state' ) ) ? 'red' : 'black'
                }
            })
        },
        singleValue: (provided, state)=> ({
            ...provided,
            fontSize: 14,
            paddingLeft: 7,
            paddingRight: 7
        }),
        placeholder: (provided, state)=> ({
            ...provided,
            fontSize: 14,
            paddingLeft: 7,
            paddingRight: 7
        }),
        option: (provided, state)=> ({
            ...provided,
            cursor: 'pointer',
        })
    }
    if (isFetchingStates) {
        // Show loading component.
        return (
            <div className="column column--input column--relative column--s6-sm column--grow-30-bottom">
                <label className="leading-7 text-sm text-gray-600" htmlFor={inputId}>
                    Provincia
                    <Abbr required/>
                </label>
                <div className="select">
                    <Select 
                        styles={customStyles}
                        className="select__wrapper"
                        id={inputId}
                        isClearable={true}
                        defaultValue={current}
                        onChange={(newValue) => handleOnChange(handleSelect(newValue), isShipping, true)}
                        onBlur={(event) => handleOnChange( value, isShipping, true ) }
                        onKeyDown={(event) => handleOnChange( value, isShipping, true ) }
                        options={states}
                        placeholder="Seleziona un paese..."
                        components={{DownChevron: ArrowDown}}
                        className={cx('select__wrapper', { 'error' : errors && ( errors.hasOwnProperty( 'state' ) ) && touched && ( touched.hasOwnProperty( 'state'  ) ) })}
                        theme={(theme) => {
                            return ({
                                ...theme,
                                borderRadius: 4,
                                colors: {
                                    ...theme.colors,
                                    primary25: '#f0eeea',
                                    // neutral5: 'black',
                                    // neutral10: 'black',
                                    neutral20: 'black',
                                    primary: 'black',
                                    neutral10: 'black'
                                },
                            })
                        }}
                    />
                </div>
            </div>
        )
    }

    return (
        <>
            {
                !states.length ? (
                    <>
                    <InputField
                        name="state"
                        inputValue={input?.state}
                        required
                        handleOnChange={handleOnChange}
                        label="Provincia"
                        errors={errors}
                        isShipping={isShipping}
                    />
                    <Error errors={errors} fieldName={'state'} touched={touched} />
                    </>
                ) : (
                    <div className="column column--input column--relative column--relative column--s6-sm column--grow-30-bottom">
                        <label className="label" htmlFor={inputId}>
                            Provincia
                            <Abbr required/>
                        </label>
                        <div className="select">
                            {/* <select
                                disabled={isFetchingStates}
                                onChange={handleOnChange}
                                value={state}
                                name="state"
                                className={cx(
                                    'bg-gray-100 bg-opacity-50 border border-gray-400 text-gray-500 appearance-none inline-block py-3 pl-3 pr-8 rounded leading-tight w-full',
                                    {'opacity-50': isFetchingStates}
                                )}
                                id={inputId}
                            >
                                <option value="">Select a state...</option>
                                {states.map((state, index) => (
                                    <option key={state?.stateCode ?? index} value={state?.stateName ?? ''}>
                                        {state?.stateName}
                                    </option>
                                ))}
                            </select> */}
                            <Select 
                                styles={customStyles}
                                className="select__wrapper"
                                id={inputId}
                                isClearable={true}
                                defaultValue={states[state]}
                                onChange={(newValue) => handleOnChange(handleSelect(newValue), isShipping, true)}
                                onBlur={(event) => handleOnChange( value, isShipping, true ) }
                                onKeyDown={(event) => handleOnChange( value, isShipping, true ) }
                                options={states}
                                placeholder="Seleziona un paese..."
                                components={{DownChevron: ArrowDown}}
                                className={cx('select__wrapper', { 'error' : errors && ( errors.hasOwnProperty( 'state' ) ) && touched && ( touched.hasOwnProperty( 'state'  ) ) })}
                                theme={(theme) => {
                                    return ({
                                      ...theme,
                                      borderRadius: 4,
                                      colors: {
                                        ...theme.colors,
                                        primary25: '#f0eeea',
                                        // neutral5: 'black',
                                        // neutral10: 'black',
                                        neutral20: 'black',
                                        primary: 'black',
                                        neutral10: 'black'
                                      },
                                    })
                            }}
                            />
                        </div>
                        <Error errors={errors} fieldName={'state'} touched={touched} />
                    </div>
                )
            }
            
           
        </>
    )
}

StateSelection.propTypes = {
    handleOnChange: PropTypes.func,
    input: PropTypes.object,
    states: PropTypes.array,
    isFetchingStates: PropTypes.bool,
    isShipping: PropTypes.bool
}

StateSelection.defaultProps = {
    handleOnChange: () => null,
    input: {},
    states: [],
    isFetchingStates: false,
    isShipping: true
}

export default memo(StateSelection);
