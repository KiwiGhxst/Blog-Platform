import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd'; // Импортируем библиотеку для уведомлений

import Auth from '../Auth/Auth';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchLogin } from '../../store/blogSlice';
import { loginFields } from '../../constants/formFields'; // Импортируем поля формы
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
      notification.error({
        message: 'Login Error',
        description: 'Invalid email or password. Please try again.',
      });
    }
  };

  useEffect(() => {
    if (error?.errors?.['email or password']) {
      const errorMessage = `Email or password: ${error.errors['email or password']}`;
      ['email', 'password'].forEach((field) => {
        setError(field, { type: 'server', message: errorMessage });
      });

      notification.error({
        message: 'Login Error',
        description: errorMessage,
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
        {loginFields.map(({ name, label, placeholder, type, validation }) => (
          <label htmlFor={name} className={styles.auth__label} key={name}>
            {label}
            <input
              type={type}
              placeholder={placeholder}
              className={`${styles.auth__input} ${errors[name] ? styles.auth__input_error : ''}`}
              id={name}
              {...register(name, validation)}
            />
            {errors[name] && <span className={styles.auth__errorMessage}>{errors[name]?.message}</span>}
          </label>
        ))}

        <button type="submit" className={styles.auth__submit} disabled={loading}>
          {loading ? 'Login...' : 'Login'}
        </button>
      </form>
    </Auth>
  );
};

export default Login;
