import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './root-reducer';
import { fetchGenres, getAlbumsCount, getUserStatus } from './actions';
import history from '../history';
import { getToken } from '../helpers/token-functions';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        history
      },
    },
  }),
});

const token = getToken();
console.log(token)
store.dispatch(getUserStatus(token));
store.dispatch(getAlbumsCount());
store.dispatch(fetchGenres());
export default store;