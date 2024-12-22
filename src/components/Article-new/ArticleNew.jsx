import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchEditArticle, fetchPostArticle } from '../../store/blogSlice';
import ApiService from '../../utils/ApiService';
import stylesAuth from '../Auth/Auth.module.scss';

import styles from './ArticleNew.module.scss';

const NewArticle = ({ edit = false }) => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const username = useAppSelector((store) => store.blog.user?.user.username);
  const loading = useAppSelector((store) => store.blog.loading);
  const [newTag, setNewTag] = useState(''); // Для нового тега
  const [tags, setTags] = useState([]); // Для списка тегов

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (edit) {
      ApiService.getArticle(slug).then((res) => {
        if (res.article.author.username === username) {
          setValue('title', res.article.title);
          setValue('description', res.article.description);
          setValue('body', res.article.body);
          setTags(res.article.tagList);
        } else {
          navigate('/articles');
        }
      });
    } else {
      reset();
      setTags([]);
    }
  }, [edit]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setValue('tagList', tags);

    handleSubmit((values) => {
      const action = edit ? fetchEditArticle({ slug, article: values }) : fetchPostArticle(values);
      dispatch(action).then((res) => {
        if (res.payload) {
          navigate(`/articles/${res.payload.article.slug}`);
        }
      });
    })();
  };

  const handleAddNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewTag();
    }
  };

  const deleteTag = (tag) => {
    setTags(tags.filter((existingTag) => existingTag !== tag));
  };

  return (
    <div className={styles.ArticleNew}>
      <div className={styles.ArticleNew__container}>
        <p className={styles.ArticleNew__title}>{edit ? 'Edit article' : 'Create new article'}</p>
        <form action="" className={styles.ArticleNew__form} onSubmit={handleFormSubmit}>
          <label htmlFor="title" className={styles.ArticleNew__label}>
            Title
            <input
              placeholder="Title"
              type="text"
              id="title"
              className={`${styles.ArticleNew__input} ${errors.title ? styles.ArticleNew__input_error : ''}`}
              {...register('title', {
                required: 'Title is required',
                pattern: {
                  value: /^(?!\s*$).+/,
                  message: 'Title cannot be empty or just spaces',
                },
              })}
            />
            {errors.title && <span className={stylesAuth.auth__errorMessage}>{errors.title.message}</span>}
          </label>

          <label htmlFor="description" className={styles.ArticleNew__label}>
            Short description
            <input
              type="text"
              id="description"
              className={`${styles.ArticleNew__input} ${errors.description ? styles.ArticleNew__input_error : ''}`}
              placeholder="Description"
              {...register('description', {
                required: 'Short description is required',
                pattern: {
                  value: /^(?!\s*$).+/,
                  message: 'Short description cannot be empty or just spaces',
                },
              })}
            />
            {errors.description && <span className={stylesAuth.auth__errorMessage}>{errors.description.message}</span>}
          </label>

          <label htmlFor="text" className={styles.ArticleNew__label}>
            Text
            <textarea
              id="text"
              className={`${styles.ArticleNew__textarea} ${errors.body ? styles.ArticleNew__input_error : ''}`}
              placeholder="Text"
              {...register('body', {
                required: 'Text description is required',
                pattern: {
                  value: /^(?!\s*$).+/,
                  message: 'Text description cannot be empty or just spaces',
                },
              })}
            />
            {errors.body && <span className={stylesAuth.auth__errorMessage}>{errors.body.message}</span>}
          </label>

          <div className={styles.ArticleNew__label}>
            Tags
            {tags.length > 0 &&
              tags.map((tag, index) => (
                <div className={styles.ArticleNew__addTag} key={index}>
                  <input type="text" disabled className={styles.ArticleNew__tagInput} value={tag} placeholder="Tag" />
                  <Button
                    type="default"
                    variant="outlined"
                    color="danger"
                    size="large"
                    className={styles.ArticleNew__button}
                    onClick={() => deleteTag(tag)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            <div className={styles.ArticleNew__addTag}>
              <input
                type="text"
                value={newTag}
                className={styles.ArticleNew__tagInput}
                placeholder="Tag"
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <Button
                type="default"
                variant="outlined"
                color="danger"
                size="large"
                className={styles.ArticleNew__button}
                onClick={() => setNewTag('')}
              >
                Clear
              </Button>
              <Button
                type="default"
                variant="outlined"
                color="primary"
                size="large"
                className={styles.ArticleNew__button}
                onClick={handleAddNewTag}
              >
                Add tag
              </Button>
            </div>
          </div>

          <button type="submit" className={styles.ArticleNew__submit} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewArticle;
