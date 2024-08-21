import * as React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from "antd";

import { OptionsBtn } from '../options-btn/options-btn';
import type { Album } from '../../types/types';
import s from './card.module.css';
import { useSelector } from 'react-redux';
import type { State } from '../../types/state';

type Props = {
  album: Album;
}

export const Card = ({album}: Props) => {

  return (
    <article className={s.albumCard}>
      <Link to={`/album/${album.id}`}>
        <div className={s.albumCoverWrapper}>
          <OptionsBtn albumId={album.id}/>
          <img className={s.albumCover} src={album.coverImg} alt={`Album's cover "${album.name}"`} width="200" height="200" />
        </div>
      </Link>
      <div className={s.contentWrapper}>
        <div className={s.titleWrapper}>
          <Link to={`/album/${album.id}`}>
            <h1 className={s.title}>{album.name}</h1>
          </Link>
        </div>
        <div className={s.musicianWrapper}>
          {album.musician}
        </div>
        <div className={s.albumInfoWrapper}>
          <div className={s.songsInfo}>{album.qtySongs} songs</div>
          <div className={s.releaseYear}>{new Date(album.releaseDate).getFullYear()}</div>
        </div>
        <div className={s.genresWrapper}>{album.genres.map((genre) => (<Tag color={'rgb(91, 106, 109)'}>{genre}</Tag>))}</div>
      </div>
      
    </article>
  )
}