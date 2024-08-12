import * as React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Catalog from '../catalog.page/catalog';
import NewAlbum from '../new-album.page/new-album';
import Login from '../login.page/login';
import Register from '../register.page/register';
import Favorites from '../favorites.page/favorites';
import Album from '../album.page/album';
import EditAlbum from '../edit-album.page/edit-album';
import NotFound from '../not-found.page/not-found';
import { Header } from '../header/header';
import PrivateRoute from '../private-route/private-route';
import { AppRoute, AuthorizationStatus } from '../../const';

import './app.module.css'

const App = (): JSX.Element => {

  return (
  <BrowserRouter>
    <Routes>
      <Route element={<Header />}>
        <Route index element={<Catalog />} />
        <Route path='/:id' element={<Catalog />} />
        <Route path={`${AppRoute.Album}/:id`} element={<Album />} />
        <Route
          path={`${AppRoute.Album}/:id${AppRoute.Edit}`}
          element={
            <PrivateRoute restrictedFor={AuthorizationStatus.NoAuth} redirectTo={AppRoute.Login}>
              <EditAlbum />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Add}
          element={<NewAlbum />}
        />
        <Route
          path={AppRoute.Favorites}
          element={
            <PrivateRoute restrictedFor={AuthorizationStatus.NoAuth} redirectTo={AppRoute.Login}>
              <Favorites />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Login}
          element={
              <Login />
          }
        />
        <Route
          path={AppRoute.Register}
          element={<Register />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
)};

export default App;