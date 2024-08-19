import * as React from 'react';
import { useSelector } from 'react-redux';

import type { State, User } from '../../types/state';
import s from './favorites.module.css';

const Favorites = (): JSX.Element => {
  const user: User = useSelector((state:State) => state.USER_DATA);
  
  return (
    <div className={s.catalogWrapper}>
      <h1>Favorites albums</h1>
      <div className={s.catalog}>
      {user.user?.favorites.map((album: Album) => (
        <div key={album.id}>
          <Card album={album} />
        </div>
      ))}
    </div>
    </div>
)}

export default Favorites;