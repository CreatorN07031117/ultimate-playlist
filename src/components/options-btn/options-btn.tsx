import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { deleteAlbum } from '../../store/actions';
import { AppDispatch } from '../../types/state';
import s from './options-btn.module.css';
import { AppRoute } from '../../const';

type Props = {
  option?: 'album'
  albumId: string;
}

export const OptionsBtn = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const clickFavoriteBtnHandler = () => {};
  const clickEditAlbumBtnHandler = () => {navigate(`${AppRoute.Album}/${props.albumId}${AppRoute.Edit}`)};
  async function  clickDeleteAlbumBtnHandler (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) {
    event.preventDefault();
    event.stopPropagation();
    const result = await dispatch(deleteAlbum(id))

      if(result === null) {window.alert('Ошибка при удалении');} else {
        window.alert(`Альбом id ${id} удален`);
      }
  };


  return (
    <div className={s.options} data-custom={props.option}>
      <button className={s.favoriteBtn} onClick={clickFavoriteBtnHandler}><HeartOutlined className={s.btnIcon} /></button>
      <button className={s.editAlbumBtn} onClick={clickEditAlbumBtnHandler}><EditOutlined className={s.btnIcon} /></button>
      <button className={s.deleteAlbumBtn} onClick={(event) => clickDeleteAlbumBtnHandler(event, props.albumId)}><DeleteOutlined className={s.btnIcon} /></button>
    </div>
  )
}