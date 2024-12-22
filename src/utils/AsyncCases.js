const handleAsyncCase = (builder, actionType) => {
  builder
    .addCase(actionType.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    })
    .addCase(actionType.fulfilled, (state, action) => {
      const newState = {
        loading: false,
        error: null,
        list: 'articles' in action.payload ? action.payload.articles : state.list,
        articlesCount: 'articlesCount' in action.payload ? action.payload.articlesCount : state.articlesCount,
        user: 'user' in action.payload ? action.payload : state.user,
        loggedIn: 'user' in action.payload ? true : state.loggedIn,
      };
      return {
        ...state,
        ...newState,
      };
    })
    .addCase(actionType.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload || null,
      };
    });
};

export default handleAsyncCase;
