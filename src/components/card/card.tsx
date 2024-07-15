import * as React from 'react';
import { Link } from 'react-router-dom';

import { OptionsBtn } from '../options-btn/options-btn';
import type { Album } from '../../types/types';
import s from './card.module.css';

type Props = {
  album: Album;
}

export const Card = ({album}: Props) => {

  return (
    <article className={s.albumCard}>
      <Link to={`/album/${album.id}`}>
      <div className={s.albumCoverWrapper}>
        <OptionsBtn />
        <img className={s.albumCover} src={album.coverImg} alt={`Album's cover "${album.name}"`} width="200" height="200" />
      </div>
      <div className={s.titleWrapper}>
        <h1 className={s.title}>{album.name}</h1>
      </div>
      <div className={s.musicianWrapper}>
        {album.musician}
      </div>
      <div className={s.albumInfoWrapper}>
        <div className={s.songsInfo}>{album.qtySongs} songs</div>
        <div className={s.releaseYear}>{new Date(album.releaseDate).getFullYear()}</div>
      </div>
      </Link>
    </article>
  )
}