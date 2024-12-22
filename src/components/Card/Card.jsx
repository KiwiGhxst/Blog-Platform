import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, ConfigProvider, Popconfirm } from 'antd';

import { useAppSelector } from '../../hooks/hooks';
import { SugnUpButtonConfig } from '../../utils/AntdConfig';
import ApiService from '../../utils/ApiService';

import styles from './Card.module.scss';

const Card = ({ data, type }) => {
  const navigate = useNavigate();
  const [like, setLike] = useState(data.favorited);
  const [count, setCount] = useState(data.favoritesCount);
  const [avatarUrl, setAvatarUrl] = useState(data.author.image || './img/avatar.png');
  const { loggedIn } = useAppSelector((store) => store.blog);
  const username = useAppSelector((store) => store.blog.user?.user.username);

  const handleShowFullArticle = () => {
    navigate(`/articles/${data.slug}`);
  };

  const handleKeyPress = (e) => {
    if (['Enter', ' '].includes(e.key)) {
      handleShowFullArticle();
    }
  };

  const deleteCard = () => {
    ApiService.deleteArticle(data.slug).then((res) => {
      if (res) navigate('/articles');
    });
  };

  const likeCard = (value) => {
    if (loggedIn) {
      if (value !== like) {
        setLike(value);
        setCount((prevCount) => prevCount + (value ? 1 : -1));
        value ? ApiService.likeCard(data.slug) : ApiService.deleteLikeCard(data.slug);
      }
    }
  };

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={type === 'card' ? handleShowFullArticle : undefined}
      onKeyDown={type === 'card' ? handleKeyPress : undefined}
      style={{ cursor: type === 'card' ? 'pointer' : 'default' }}
    >
      <div className={styles.card__header}>
        <div>
          <div className={styles.card__articleLikeContainer}>
            <p className={styles.card__title}>{data.title}</p>
            <label
              className={styles.card__like}
              htmlFor={data.slug}
              onClick={(e) => e.stopPropagation()} // Предотвращаем всплытие события
            >
              <input
                className={styles.card__checkbox}
                type="checkbox"
                id={data.slug}
                checked={like}
                onChange={(e) => likeCard(e.target.checked)}
              />
              <span className={styles.card__customCheckbox} />
              {count}
            </label>
          </div>
          <div className={styles.card__tagList}>
            {data.tagList.map(
              (tag, index) =>
                tag.trim() && (
                  <span className={styles.card__tag} key={`${tag}-${index}`}>
                    {tag}
                  </span>
                )
            )}
          </div>
        </div>
        <div className={styles.card__userInfo}>
          <p className={styles.card__username}>{data.author.username}</p>
          <p className={styles.card__date}>{format(new Date(parseISO(data.createdAt)), 'MMMM dd, yyyy')}</p>
        </div>
        <Avatar
          size={46}
          src={avatarUrl}
          className={styles.card__avatar}
          alt="avatar"
          onError={() => setAvatarUrl('./img/avatar.png')}
        />
      </div>
      <div className={styles.card__descriptionContainer}>
        <p className={`${styles.card__description} ${type === 'card' ? styles.card__descriptionShort : ''}`}>
          {data.description}
        </p>
        {type !== 'card' && data.author.username === username ? (
          <>
            <Popconfirm
              placement="rightTop"
              title="Are you sure to delete this article?"
              okText="Yes"
              cancelText="No"
              onConfirm={deleteCard}
            >
              <Button className={styles.card__button} danger>
                Delete
              </Button>
            </Popconfirm>
            <ConfigProvider theme={SugnUpButtonConfig}>
              <Button className={styles.card__button} onClick={() => navigate(`/articles/${data.slug}/edit`)}>
                Edit
              </Button>
            </ConfigProvider>
          </>
        ) : null}
      </div>
      {type !== 'card' && (
        <div className={styles.card__body}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.body}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Card;
