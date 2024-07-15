import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './root-reducer';
import { fetchAlbums } from './actions';
import history from '../history';

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

store.dispatch(fetchAlbums());
export default store;