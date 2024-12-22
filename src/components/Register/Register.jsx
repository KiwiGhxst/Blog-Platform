import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Auth from '../Auth/Auth';
import { fetchRegistration } from '../../store/blogSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import styles from '../Auth/Auth.module.scss';

const Register = () => {
  const { error, loading, loggedIn } = useAppSelector((store) => store.blog);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
  } = useForm();

  const onSubmit = (values) => {
    dispatch(fetchRegistration(values));
  };

  useEffect(() => {
    if (error?.errors) {
      if (error.errors.username) setError('username', { type: 'server', message: error.errors.username });
      if (error.errors.email) setError('email', { type: 'server', message: error.errors.email });
    }
  }, [error, setError]);

  useEffect(() => {
    if (loggedIn) navigate('/articles');
  }, [loggedIn, navigate]);

  return (
    <Auth title="Create new account" text="Already have an account?" link="Sign In.">
      <form className={styles.auth__form} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username" className={styles.auth__label}>
          Username
          <input
            placeholder="Username"
            id="username"
            className={`${styles.auth__input} ${errors.username ? styles.auth__input_error : ''}`}
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters long',
              },
              maxLength: {
                value: 20,
                message: 'Username cannot exceed 20 characters',
              },
            })}
          />
          {errors.username && <span className={styles.auth__errorMessage}>{errors.username.message}</span>}
        </label>

        <label htmlFor="email" className={styles.auth__label}>
          Email address
          <input
            type="email"
            placeholder="Email address"
            id="email"
            className={`${styles.auth__input} ${errors.email ? styles.auth__input_error : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <span className={styles.auth__errorMessage}>{errors.email.message}</span>}
        </label>

        <label htmlFor="password" className={styles.auth__label}>
          Password
          <input
            type="password"
            placeholder="Password"
            id="password"
            className={`${styles.auth__input} ${errors.password ? styles.auth__input_error : ''}`}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
              maxLength: {
                value: 40,
                message: 'Password cannot exceed 40 characters',
              },
            })}
          />
          {errors.password && <span className={styles.auth__errorMessage}>{errors.password.message}</span>}
        </label>

        <label htmlFor="repeatPas" className={styles.auth__label}>
          Repeat Password
          <input
            type="password"
            placeholder="Repeat Password"
            id="repeatPas"
            className={`${styles.auth__input} ${errors.repeatPas ? styles.auth__input_error : ''}`}
            {...register('repeatPas', {
              required: 'Please repeat your password',
              validate: (value) => {
                const { password } = getValues();
                return value === password || 'Passwords must match';
              },
            })}
          />
          {errors.repeatPas && <span className={styles.auth__errorMessage}>{errors.repeatPas.message}</span>}
        </label>

        <label htmlFor="checkbox" className={styles.auth__checkboxLabel}>
          <input
            className={styles.auth__checkbox}
            type="checkbox"
            id="checkbox"
            aria-label="Agree to terms"
            {...register('checkbox', {
              required: 'You must agree to the processing of personal data',
            })}
          />
          <span className={styles.auth__customCheckbox} /> I agree to the processing of my personal information
        </label>
        {errors.checkbox && <span className={styles.auth__errorMessage}>{errors.checkbox.message}</span>}

        <button type="submit" className={styles.auth__submit} disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </Auth>
  );
};

export default Register;
