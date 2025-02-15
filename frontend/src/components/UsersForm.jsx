import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Input from './form/Input';
import axios from '../tools/api';

const UsersForm = ({
  editing, setEditing, editUser, addUser,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
  } = useForm({
    defaultValues: editing,
  });

  const handleReset = useCallback(() => {
    setEditing(undefined);
    resetField('first_name');
    resetField('last_name');
    resetField('email');
    resetField('country');
    resetField('city');
    resetField('phone_number');
  }, []);

  const onSubmit = async (data) => {
    try {
      let response;
      if (editing && editing.id) {
        response = await axios.put(`/users/${editing.id}`, data);
      } else {
        response = await axios.post('/users/create', data);
      }

      if (response.status === 200) {
        handleReset();
        if (editing && editing.id) {
          editUser(response.data.data);
        } else {
          addUser(response.data.data);
        }
      }
    } catch (e) {
      console.log(e);
      // Normally we'd log this error internally or through a service like Sentry, LogRocket ...etc
    }
  };

  useEffect(() => {
    if (!editing) return;

    setValue('first_name', editing.first_name);
    setValue('last_name', editing.last_name);
    setValue('email', editing.email);
    setValue('country', editing.country);
    setValue('city', editing.city);
    setValue('phone_number', editing.phone_number);
  }, [editing]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="First name" placeholder="First name" error={errors.first_name} {...register('first_name', { required: true, minLength: 5, maxLength: 100 })} />
      <Input label="Last name" placeholder="Last name" error={errors.last_name} {...register('last_name', { required: true, minLength: 5, maxLength: 100 })} />
      <Input label="Country" placeholder="Country" error={errors.country} {...register('country', { required: true, minLength: 5, maxLength: 100 })} />
      <Input label="City" placeholder="City" error={errors.city} {...register('city', { required: true, minLength: 5, maxLength: 100 })} />
      <Input label="Email" placeholder="Email" error={errors.email} {...register('email', { required: true, minLength: 5, email: true })} />
      <Input label="Phone number" placeholder="Phone number" error={errors.phone_number} {...register('phone_number', { required: true, pattern: /^[+]?[0-9]{10,15}$/ })} />

      <input type="submit" value={editing && editing.id ? 'Update user' : 'Create User'} />
      <button
        type="button"
        style={{
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          paddingRight: '10px',
          paddingLeft: '10px',
          paddingTop: '5px',
          paddingBottom: '5px',
          marginLeft: '10px',
          cursor: 'pointer',
        }}
        onClick={handleReset}
      >
        Cancel
      </button>
    </form>
  );
};

UsersForm.propTypes = {
  editing: {
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    country: PropTypes.string,
    city: PropTypes.string,
    phone_number: PropTypes.string,
  },
  setEditing: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
};

UsersForm.defaultProps = {
  editing: null,
};

export default UsersForm;
