import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Auth from '../Auth/Auth';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchLogin } from '../../store/blogSlice';
import styles from '../Auth/Auth.module.scss';

const Login = () => {
  const { error, loggedIn, loading } = useAppSelector((store) => store.blog);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await dispatch(fetchLogin(values)).unwrap();
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  useEffect(() => {
    if (error?.errors?.['email or password']) {
      const errorMessage = `email or password ${error.errors['email or password']}`;
      ['email', 'password'].forEach((field) => {
        setError(field, { type: 'server', message: errorMessage });
      });
    }
  }, [error, setError]);

  useEffect(() => {
    if (loggedIn) {
      navigate('/articles');
    }
  }, [loggedIn, navigate]);

  return (
    <Auth title="Sign In" text="Don’t have an account?" link="Sign Up.">
      <form className={styles.auth__form} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className={styles.auth__label}>
          Email address
          <input
            type="email"
            placeholder="Email address"
            className={`${styles.auth__input} ${errors.email ? styles.auth__input_error : ''}`}
            id="email"
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
            className={`${styles.auth__input} ${errors.password ? styles.auth__input_error : ''}`}
            id="password"
            {...register('password', {
              required: 'Password is required',
            })}
          />
          {errors.password && <span className={styles.auth__errorMessage}>{errors.password.message}</span>}
        </label>

        <button type="submit" className={styles.auth__submit} disabled={loading}>
          {loading ? 'Login...' : 'Login'}
        </button>
      </form>
    </Auth>
  );
};

export default Login;
