import React, {useEffect} from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Card } from '../card/card';
import { getAlbums } from '../../store/site-data/selectors';
import type { Album, AppDispatch } from '../../types/types';
import type { State } from '../../types/state';
import s from './catalog.module.css';


const Catalog = (): JSX.Element => {
  const useAppSelector: TypedUseSelectorHook<State> = useSelector;
  const isAlbumsLoading = useSelector((state: State) => state.SITE_DATA.isAlbumsLoading);
  const albums = useSelector((state:State) => state.SITE_DATA.albums, shallowEqual);

  if (isAlbumsLoading) {
    return <div>Loading...</div>
  }
  
  return (
  <div className={s.catalogWrapper}>
    <h1>Albums</h1>
    <div className={s.catalog}>
      {albums.map((album: Album) => (
        <div key={album.id}>
          <Card album={album} />
        </div>
      ))}
    </div>
  </div>
)}

export default Catalog;