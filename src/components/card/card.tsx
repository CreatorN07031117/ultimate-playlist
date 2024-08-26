import { Link } from 'react-router-dom';

import { OptionsBtn } from '../options-btn/options-btn';
import type { Album } from '../../types/types';
import defaultCover from '../../assets/default-album-cover.jpg'
import s from './card.module.css';

type Props = {
  album: Album;
}

export const Card = ({album}: Props) => {

  return (
    <article className={s.albumCard}>
      <Link to={`/album/${album.id}`}>
        <div className={s.albumCoverWrapper}>
          <OptionsBtn albumId={album.id}/>
          <img 
            className={s.albumCover}
            src={album.coverImg}
            alt={`Album's cover "${album.name}"`}
            width="200" height="200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultCover;
            }}
          />
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
      </div>
      
    </article>
  )
}