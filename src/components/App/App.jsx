import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from '../Header/Header';
import CardsList from '../CardsList/CardsList';
import Article from '../Article/Article';
import Login from '../Login/Login';
import Register from '../Register/Register';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import { fetchGetUserInfo, logOut } from '../../store/blogSlice';
import EditProfile from '../EditProfile/EditProfile';
import NewArticle from '../Article-new/ArticleNew';
import { PATHS } from '../../constants/paths';

const App = () => {
  const auth = useAppSelector((store) => store.blog.loggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      dispatch(fetchGetUserInfo(token));
    } else {
      dispatch(logOut());
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <Routes>
        <Route path={PATHS.HOME} element={<CardsList />} />
        <Route path={PATHS.ARTICLES} element={<CardsList />} />
        <Route path={PATHS.ARTICLE_DETAIL} element={<Article />} />
        <Route path={PATHS.ARTICLE_EDIT} element={<PrivateRoute auth={auth} element={<NewArticle edit />} />} />
        <Route path={PATHS.SIGN_IN} element={<Login />} />
        <Route path={PATHS.SIGN_UP} element={<Register />} />
        <Route path={PATHS.PROFILE} element={<PrivateRoute auth={auth} element={<EditProfile />} />} />
        <Route path={PATHS.NEW_ARTICLE} element={<PrivateRoute auth={auth} element={<NewArticle />} />} />
      </Routes>
    </>
  );
};

export default App;
