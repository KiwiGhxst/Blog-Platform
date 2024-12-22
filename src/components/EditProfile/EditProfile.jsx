import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import Auth from '../Auth/Auth';
import { fetchEditProfile } from '../../store/blogSlice';
import styles from '../Auth/Auth.module.scss';

const EditProfile = () => {
  const [submit, setSubmit] = useState(false);
  const { error, user, loading } = useAppSelector((store) => store.blog);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm();

  const onSubmit = useCallback(
    (values) => {
      dispatch(fetchEditProfile(values));
      setSubmit(true);
    },
    [dispatch]
  );

  useEffect(() => {
    if (user?.user) {
      const { username, email } = user.user;
      setValue('username', username);
      setValue('email', email);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (error?.errors) {
      Object.entries(error.errors).forEach(([key, message]) => {
        setError(key, { type: 'server', message });
      });
    } else if (submit && !error) {
      navigate('/articles');
    }
  }, [error, submit, setError, navigate]);

  const fields = [
    {
      name: 'username',
      label: 'Username',
      placeholder: 'Username',
      validation: {
        required: 'Username is required',
        minLength: { value: 3, message: 'Must be at least 3 characters' },
        maxLength: { value: 20, message: 'Cannot exceed 20 characters' },
      },
    },
    {
      name: 'email',
      label: 'Email address',
      placeholder: 'Email address',
      type: 'email',
      validation: {
        required: 'Email is required',
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: 'Invalid email address',
        },
      },
    },
    {
      name: 'password',
      label: 'New password',
      placeholder: 'Password',
      type: 'password',
      validation: {
        validate: (value) => value.length === 0 || value.length >= 6 || 'Password must be at least 6 characters',
        maxLength: { value: 40, message: 'Cannot exceed 40 characters' },
      },
    },
    {
      name: 'image',
      label: 'Avatar image (url)',
      placeholder: 'Avatar image',
      validation: {
        pattern: {
          value: /^(https?:\/\/[^\s]+)$/,
          message: 'Please enter a valid URL',
        },
      },
    },
  ];

  return (
    <Auth title="Edit Profile">
      <form className={styles.auth__form} onSubmit={handleSubmit(onSubmit)}>
        {fields.map(({ name, label, placeholder, validation }) => (
          <label key={name} htmlFor={name} className={styles.auth__label}>
            {label}
            <input
              id={name}
              placeholder={placeholder}
              className={`${styles.auth__input} ${errors[name] ? styles.auth__input_error : ''}`}
              {...register(name, validation)}
            />
            {errors[name] && <span className={styles.auth__errorMessage}>{errors[name].message}</span>}
          </label>
        ))}
        <button type="submit" className={styles.auth__submit} disabled={loading}>
          {loading ? 'Save...' : 'Save'}
        </button>
      </form>
    </Auth>
  );
};

export default EditProfile;
