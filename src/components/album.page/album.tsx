import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Tag } from "antd";
import { HeartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { OptionsBtn } from '../options-btn/options-btn';
import { getAlbum } from '../../store/site-data/selectors';
import { fetchAlbumById } from '../../store/actions';
import { formatDate } from '../../helpers/format-date';

import type { Album as AlbumType, AppDispatch } from '../../types/types';
import type { State } from '../../types/state'
import s from './album.module.css';



const Album = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const { id } = params;
    if (id) {
      dispatch(fetchAlbumById(id));
    }
  }, [params, dispatch]);

  const album = useSelector((state:State) => state.SITE_DATA.album);

  const clickFavoriteBtnHandler = () => {};
  const clickEditAlbumBtnHandler = () => {};
  const clickDeleteAlbumBtnHandler = () => {};

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
          <div className={s.descriptionWrapper}>
            {album?.description.map((paragraph) => (
              <p>{paragraph}</p>
            ))}
          </div>
          <div className={s.genresWrapper}>{album?.genres.map((genre) => (<Tag color={'rgb(91, 106, 109)'}>{genre}</Tag>))}</div>
        </div>
        <div className={s.albumCoverWrapper}>
          <OptionsBtn option='album' />
          <img className={s.albumCover} src={album?.coverImg} alt={`Album's cover "${album?.name}"`} />
        </div>
      </div>
    </article>
)}

export default Album;