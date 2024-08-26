import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from "antd";

import { OptionsBtn } from '../options-btn/options-btn';
import { Loader } from '../loader/loader';
import { fetchAlbumById } from '../../store/actions';
import { formatDate } from '../../helpers/format-date';
import type { AppDispatch } from '../../types/types';
import type { State } from '../../types/state'
import defaultCover from '../../assets/default-album-cover.jpg'

import s from './album.module.css';
import { AppRoute } from '../../const';
import store from '../../store';




const Album = () => {
  const params = useParams();
  const navigate = useNavigate()
  const isAlbumLoading = useSelector((state: State) => state.SITE_PROCESS.isAlbumLoading)
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const { id } = params;
    if (id) {
      dispatch(fetchAlbumById(String(id)));
    }
  }, [params, dispatch]);

  const album = useSelector((state:State) => state.SITE_PROCESS.album);

  if (isAlbumLoading) {
    return <Loader />
  }

  if (album === undefined) {
    navigate(`${AppRoute.NotFound}`);
  }

  return (
    <article className={s.albumWrapper}>
      <div className={s.wrapper}>
        <div className={s.contentWrapper}>
          <div className={s.musician}>{album?.musician}</div>
          <h1 className={s.albumTitle}>{album?.name}</h1>
          <div className={s.albumInfoWrapper}>
            <div className={s.songsInfo}><b>Duration:</b> {album?.qtySongs} songs</div>
            <div className={s.releaseYear}><b>Release date:</b> {formatDate(new Date(album?.releaseDate))}</div>
          </div>
          <div className={s.albumFormatWrapper}><b>Available formats:</b> {album?.format.map((format) => (<Tag>{format}</Tag>))}</div>
          <div className={s.descriptionWrapper}>
            {album?.description.map((paragraph) => (
              <p>{paragraph}</p>
            ))}
          </div>
          <div className={s.genresWrapper}>{album?.genres.map((genre) => (<Tag color={'rgb(53, 127, 142)'}>{genre}</Tag>))}</div>
        </div>
        <div className={s.albumCoverWrapper}>
          <OptionsBtn option='album' albumId={album?.id as string}/>
          <img
            className={s.albumCover}
            src={album?.coverImg}
            alt={`Album's cover "${album?.name}"`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultCover;
            }}
          />
        </div>
      </div>
    </article>
)}

export default Album;