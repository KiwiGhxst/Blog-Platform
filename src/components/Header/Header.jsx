import { Link, useNavigate } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { LogOutButtonConfig, SugnUpButtonConfig } from '../../utils/AntdConfig';
import { logOut } from '../../store/blogSlice';

import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loggedIn, user } = useAppSelector((store) => store.blog);

  const handleLogOut = () => {
    dispatch(logOut());
    navigate('/sign-in');
  };

  const handleCreateArticle = () => navigate('/new-article');
  const handleProfile = () => navigate('/profile');
  const handleSignIn = () => navigate('/sign-in');
  const handleSignUp = () => navigate('/sign-up');

  const userInfo = useMemo(() => {
    if (!user?.user) return { username: '', image: './img/avatar.png' };
    return { username: user.user.username, image: user.user.image || './img/avatar.png' };
  }, [user]);

  const authButtons = loggedIn ? (
    <div className={styles.header__userInfo}>
      <ConfigProvider theme={SugnUpButtonConfig}>
        <Button variant="outlined" className={styles.header__button} onClick={handleCreateArticle}>
          Create article
        </Button>
      </ConfigProvider>
      <button type="button" className={styles.header__user} onClick={handleProfile}>
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
      <Button type="text" size="large" className={styles.header__button} onClick={handleSignIn}>
        Sign In
      </Button>
      <ConfigProvider theme={SugnUpButtonConfig}>
        <Button size="large" variant="outlined" className={styles.header__button} onClick={handleSignUp}>
          Sign Up
        </Button>
      </ConfigProvider>
    </>
  );

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link to="/" className={styles.header__link}>
          <p className={styles.header__title}>Blog</p>
        </Link>
        {authButtons}
      </div>
    </header>
  );
};

export default Header;
