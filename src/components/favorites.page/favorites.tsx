import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card } from '../card/card';
import { fetchAlbumById } from '../../store/actions';
import type { AppDispatch, State, User } from '../../types/state'
import type { Album } from '../../types/types';
import s from './favorites.module.css';

const Favorites = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const user: User = useSelector((state:State) => state.USER_DATA);
  const [favoriteAlbums, setFavoriteAlbums] = useState<Album[]>([]);

  useEffect(() => {
    if(user.user?.favorites){
      Promise.all(
        user.user?.favorites.map(async (id) => {
          const response = dispatch(fetchAlbumById(id));
          console.log(response)
          return (await response).payload;
        })
    ).then((data) => {
      setFavoriteAlbums(data as unknown as Album[])
    })}   
  }, [user.user?.favorites])
  
  return (
    <div className={s.catalogWrapper}>
      <h1>Favorites albums</h1>
      <div className={s.catalog}>
      {favoriteAlbums.length > 0 ? favoriteAlbums.map((album: Album) => (
        <div key={album.id}>
          <Card album={album} />
        </div>
      )): "No albums have been added to favorites yet"}
    </div>
    </div>
)}

export default Favorites;