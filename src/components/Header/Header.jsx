import { Link, useNavigate } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { LogOutButtonConfig, SugnUpButtonConfig } from '../../constants/AntdConfig';
import { logOut } from '../../store/blogSlice';
import avatarFallback from '../../assets/img/avatar.png';

import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loggedIn, user } = useAppSelector((store) => store.blog);

  const handleLogOut = () => {
    dispatch(logOut());
    navigate('/sign-in');
  };

  const userInfo = useMemo(() => {
    if (!user?.user) return { username: '', image: avatarFallback };
    return { username: user.user.username, image: user.user.image || avatarFallback };
  }, [user]);

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link to="/" className={styles.header__link}>
          <p className={styles.header__title}>Blog</p>
        </Link>
        {loggedIn ? (
          <div className={styles.header__userInfo}>
            <ConfigProvider theme={SugnUpButtonConfig}>
              <Button variant="outlined" className={styles.header__button} onClick={() => navigate('/new-article')}>
                Create article
              </Button>
            </ConfigProvider>
            <button type="button" className={styles.header__user} onClick={() => navigate('/profile')}>
              <p className={styles.header__name}>{userInfo.username}</p>
              <img src={userInfo.image} alt="avatar" className={styles.header__avatar} />
            </button>
            <ConfigProvider theme={LogOutButtonConfig}>
              <Button size="large" variant="outlined" className={styles.header__button} onClick={handleLogOut}>
                Log Out
              </Button>
            </ConfigProvider>
          </div>
        ) : (
          <>
            <Button type="text" size="large" className={styles.header__button} onClick={() => navigate('/sign-in')}>
              Sign In
            </Button>
            <ConfigProvider theme={SugnUpButtonConfig}>
              <Button
                size="large"
                variant="outlined"
                className={styles.header__button}
                onClick={() => navigate('/sign-up')}
              >
                Sign Up
              </Button>
            </ConfigProvider>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
