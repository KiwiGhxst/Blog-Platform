import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { notification } from 'antd';

import Auth from '../Auth/Auth';
import { fetchRegistration } from '../../store/blogSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { registerFields } from '../../constants/formFields';
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
      if (error.errors.username) {
        notification.error({
          message: 'Registration Error',
          description: `Username: ${error.errors.username}`,
        });
      }
      if (error.errors.email) {
        notification.error({
          message: 'Registration Error',
          description: `Email: ${error.errors.email}`,
        });
      }

      // Установка ошибок в форму
      Object.entries(error.errors).forEach(([key, message]) => {
        setError(key, { type: 'server', message });
      });
    }
  }, [error, setError]);

  useEffect(() => {
    if (loggedIn) navigate('/articles');
  }, [loggedIn, navigate]);

  return (
    <Auth title="Create new account" text="Already have an account?" link="Sign In.">
      <form className={styles.auth__form} onSubmit={handleSubmit(onSubmit)}>
        {registerFields.map(({ name, label, placeholder, validation, type = 'text', customLabel }) => (
          <label
            key={name}
            htmlFor={name}
            className={name === 'checkbox' ? styles.auth__checkboxLabel : styles.auth__label}
          >
            {label}
            {type === 'checkbox' ? (
              <>
                <input
                  type={type}
                  id={name}
                  className={styles.auth__checkbox}
                  {...register(name, {
                    ...validation,
                    ...(name === 'repeatPas' && {
                      validate: (value) => {
                        const password = getValues('password');
                        return value === password || 'Passwords must match';
                      },
                    }),
                  })}
                />
                <span className={styles.auth__customCheckbox} /> {customLabel}
              </>
            ) : (
              <>
                <input
                  type={type}
                  placeholder={placeholder}
                  id={name}
                  className={`${styles.auth__input} ${errors[name] ? styles.auth__input_error : ''}`}
                  {...register(name, {
                    ...validation,
                    ...(name === 'repeatPas' && {
                      validate: (value) => {
                        const password = getValues('password');
                        return value === password || 'Passwords must match';
                      },
                    }),
                  })}
                />
                {errors[name] && <span className={styles.auth__errorMessage}>{errors[name].message}</span>}
              </>
            )}
          </label>
        ))}
        <button type="submit" className={styles.auth__submit} disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </Auth>
  );
};

export default Register;
