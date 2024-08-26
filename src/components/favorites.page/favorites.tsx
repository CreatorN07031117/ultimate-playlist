import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card } from '../card/card';
import { fetchAlbumById } from '../../store/actions';
import type { AppDispatch, State, User } from '../../types/state';
import type { Album } from '../../types/types';
import s from './favorites.module.css';
import { Loader } from '../loader/loader';

const Favorites = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const user: User = useSelector((state: State) => state.USER_DATA);
  const [favoriteAlbums, setFavoriteAlbums] = useState<Album[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (user.user?.favorites) {
      Promise.all(
        user.user?.favorites.map(async (id) => {
          const response = dispatch(fetchAlbumById(id));
          return (await response).payload;
        })
      ).then((data) => {
        setFavoriteAlbums(data as unknown as Album[]);
        setIsDataLoaded(true);
      });
    }
  }, [user.user?.favorites]);

  if (!isDataLoaded) {
    return <Loader />;
  }

  return (
    <div className={s.catalogWrapper}>
      <h1 className={s.header}>Favorites albums</h1>
      <div className={s.catalogWrapper}>
        {favoriteAlbums.length > 0 ? (
          <div className={s.catalog}>
            {favoriteAlbums.map((album: Album) => (
              <div key={album.id}>
                <Card album={album} />
              </div>
            ))}
          </div>
        ) : (
          <div className={s.text}>No albums have been added to favorites yet</div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
