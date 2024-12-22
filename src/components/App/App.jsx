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
        <Route path="/" element={<CardsList />} />
        <Route path="/articles" element={<CardsList />} />
        <Route path="/articles/:slug" element={<Article />} />
        <Route path="/articles/:slug/edit" element={<PrivateRoute auth={auth} element={<NewArticle edit />} />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute auth={auth} element={<EditProfile />} />} />
        <Route path="/new-article" element={<PrivateRoute auth={auth} element={<NewArticle />} />} />
      </Routes>
    </>
  );
};

export default App;
