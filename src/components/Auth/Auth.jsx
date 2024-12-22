import { useNavigate } from 'react-router-dom';

import styles from './Auth.module.scss';

const Auth = ({ title, text, link, children }) => {
  const navigation = useNavigate();
  const handleLink = () => (link === 'Sign Up.' ? navigation('/sign-up') : navigation('/sign-in'));

  return (
    <div className={styles.auth}>
      <div className={styles.auth__container}>
        <p className={styles.auth__title}>{title}</p>
        {children}
        {text && (
          <p className={styles.auth__text}>
            {text}
            <button type="button" className={styles.auth__link} onClick={() => handleLink()}>
              {link}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
