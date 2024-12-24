import { useEffect, useState } from 'react';
import { ConfigProvider, Pagination } from 'antd';

import Card from '../Card/Card';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchArticles } from '../../store/blogSlice';
import { PaginationConfig } from '../../constants/AntdConfig';

import styles from './CardsList.module.scss';

const CardsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articles = useAppSelector((state) => state.blog.list);
  const articlesCount = useAppSelector((state) => state.blog.articlesCount);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem('page') !== null) {
      setCurrentPage(Number(localStorage.getItem('page')));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('page', String(currentPage));
    dispatch(fetchArticles(currentPage));
  }, [currentPage]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className={styles.cardsList}>
      {articles.map((card) => (
        <Card data={card} type="card" key={card.createdAt} />
      ))}
      <ConfigProvider theme={PaginationConfig}>
        <Pagination
          align="center"
          current={currentPage}
          pageSize={5}
          total={articlesCount}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </ConfigProvider>
    </div>
  );
};

export default CardsList;
