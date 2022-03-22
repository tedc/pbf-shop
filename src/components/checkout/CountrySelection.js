import Error from './Error';
import {isEmpty, isNull, find, debounce} from "lodash";
import Abbr from "./form-elements/Abbr";
import ArrowDown from "../icons/ArrowDown";
import Select from 'react-select';
import cx from 'classnames';
import { useState, useEffect } from 'react';

const CountrySelection = ({input, handleOnChange, countries, isShipping, touched}) => {

    const {country, errors} = input || {};

    const [value, setValue] = useState( {
        target: {
            name: 'country',
            value: ''
        }
    } );

    const [current, setCurrent] = useState( find(countries, (item) => item.value === country) );

    const inputId = `country-${isShipping ? 'shipping' : 'billing'}`;

    const handleSelect = (newValue)=> {
        const v = isNull(newValue) ? {target: {
                name: 'country',
                value: null
            }} : {
            target: {
                name: 'country',
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
                borderColor: errors && ( errors.hasOwnProperty( 'country' ) ) && touched && ( touched.hasOwnProperty( 'country' ) ) ? 'red' : 'black',
                boxShadow: 'none',
                "&:hover" : {
                    borderColor: errors && ( errors.hasOwnProperty( 'country' ) ) && touched && ( touched.hasOwnProperty( 'country' ) ) ? 'red' : 'black'
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

    useEffect(()=> {
        setValue( {
            target: {
                name: 'country',
                value: country
            }
        } );
        setCurrent( find(countries, (item) => item.value === country) );
    }, [country]);
    return (
        <div className="column column--input column--relative column--grow-30-bottom column--s6">
            <label className="label" htmlFor={inputId}>
                Paese/Regione
                <Abbr required/>
            </label>
            <div className="select">
                <Select 
                    styles={customStyles}
                    id={inputId}
                    instanceId={inputId}
                    isClearable={true}
                    //defaultInputValue={country}
                    defaultValue={current}
                    onChange={(newValue) => {  handleOnChange( handleSelect(newValue), isShipping, true)} }
                    onBlur={(event) => debounce( () => handleOnChange( value, isShipping, true ), 20 ) }
                    onFocus={(event) => { handleOnChange( value, isShipping, true ) } }
                    onKeyDown={(event) => handleOnChange( value, isShipping, true ) }
                    options={countries}
                    placeholder="Seleziona un paese..."
                    components={{DownChevron: ArrowDown}}
                    autoComplete="nope"
                    autoCorrect="nope"
                    autoFill="nope"
                    blurInputOnSelect={true}
                    spellCheck="nope"
                    className={cx('select__wrapper', { 'error' : errors && ( errors.hasOwnProperty( 'country' ) ) && touched && ( touched.hasOwnProperty( 'country' ) ) })}
                    theme={(theme) => {
                        return ({
                            ...theme,
                            borderRadius: 4,
                            colors: {
                            ...theme.colors,
                            primary25: '#f0eeea',
                            // neutral0: 'rgb(0,0,0,.4)',
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
            <Error errors={errors} fieldName={'country'} touched={touched} />
        </div>
    );
}

export default CountrySelection;
