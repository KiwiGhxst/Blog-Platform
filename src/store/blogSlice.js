import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import ApiService from '../utils/ApiService';
import handleAsyncCase from '../utils/AsyncCases';

export const fetchArticles = createAsyncThunk('blog/fetchArticles', async (page, { rejectWithValue }) => {
  try {
    return await ApiService.getArticles(page);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(JSON.parse(error.message));
    }
    return rejectWithValue({ errors: { general: 'Unknown error occurred' } });
  }
});

export const fetchRegistration = createAsyncThunk('blog/fetchRegistration', async (user, { rejectWithValue }) => {
  try {
    return await ApiService.registration(user);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(JSON.parse(error.message));
    }
    return rejectWithValue({ errors: { general: 'Unknown error occurred' } });
  }
});

export const fetchGetUserInfo = createAsyncThunk('blog/fetchGetUserInfo', async (token, { rejectWithValue }) => {
  try {
    return await ApiService.getUserInfo(token);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(JSON.parse(error.message));
    }
    return rejectWithValue({ errors: { general: 'Unknown error occurred' } });
  }
});

export const fetchLogin = createAsyncThunk('blog/fetchLogin', async (user, { rejectWithValue }) => {
  try {
    return await ApiService.login(user);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(JSON.parse(error.message));
    }
    return rejectWithValue({ errors: { general: 'Unknown error occurred' } });
  }
});

export const fetchEditProfile = createAsyncThunk('blog/fetchEditProfile', async (user, { rejectWithValue }) => {
  try {
    return await ApiService.updateUserInfo(user);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(JSON.parse(error.message));
    }
    return rejectWithValue({ errors: { general: 'Unknown error occurred' } });
  }
});

export const fetchPostArticle = createAsyncThunk('blog/fetchPostArticle', async (article, { rejectWithValue }) => {
  try {
    return await ApiService.newArticle(article);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(JSON.parse(error.message));
    }
    return rejectWithValue({ errors: { general: 'Unknown error occurred' } });
  }
});

export const fetchEditArticle = createAsyncThunk(
  'blog/fetchEditArticle',
  async ({ slug, article }, { rejectWithValue }) => {
    try {
      return await ApiService.editArticle(slug, article);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(JSON.parse(error.message));
      }
      return rejectWithValue({ errors: { general: 'Unknown error occurred' } });
    }
  }
);

const initialState = {
  list: [],
  articlesCount: 0,
  loading: false,
  error: null,
  loggedIn: true,
  user: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    logOut(state) {
      state.loggedIn = false;
      state.user = null;
      localStorage.removeItem('jwt');
    },
  },
  extraReducers: (builder) => {
    handleAsyncCase(builder, fetchEditArticle);
    handleAsyncCase(builder, fetchPostArticle);
    handleAsyncCase(builder, fetchArticles);
    handleAsyncCase(builder, fetchRegistration);
    handleAsyncCase(builder, fetchGetUserInfo);
    handleAsyncCase(builder, fetchLogin);
    handleAsyncCase(builder, fetchEditProfile);
  },
});

export const { logOut } = blogSlice.actions;

export default blogSlice.reducer;
