import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FORM_ERRORS } from '../../tools/constants';

const Input = forwardRef(({
  name, label, error, ...rest
}, ref) => (
  <div className={`input-container ${error ? 'has-error' : ''}`}>
    <label htmlFor={name}>{label}</label>
    <input id={name} name={name} ref={ref} {...rest} />
    {error ? <span>{FORM_ERRORS[error.type]}</span> : null}
  </div>
));

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  error: { type: PropTypes.string },
};
Input.defaultProps = {
  defaultValue: '',
  placeholder: '',
  error: undefined,
};

export default Input;
