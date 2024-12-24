import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spin, notification } from 'antd';

import Card from '../Card/Card';
import ApiService from '../../utils/ApiService';

import styles from './Arcticle.module.scss';

const Article = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    const fetchArticle = async () => {
      try {
        const res = await ApiService.getArticle(slug);
        setArticle(res.article);
      } catch {
        notification.error({
          message: 'Article Error',
          description: 'Article not found or an error occurred',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <section className={styles.article}>
        <Spin size="large" />
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.article}>
        <div className={styles.error}>{error}</div>
      </section>
    );
  }

  return (
    <section className={styles.article}>
      {article ? <Card data={article} type="article" /> : <div>Article not found</div>}
    </section>
  );
};

export default Article;
