import * as React from 'react';
import { HeartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import s from './options-btn.module.css';

export const OptionsBtn = () => {

  const clickFavoriteBtnHandler = () => {};
  const clickEditAlbumBtnHandler = () => {};
  const clickDeleteAlbumBtnHandler = () => {};


  return (
    <div className={s.options}>
      <button className={s.favoriteBtn} onClick={clickFavoriteBtnHandler}><HeartOutlined className={s.btnIcon} /></button>
      <button className={s.editAlbumBtn} onClick={clickEditAlbumBtnHandler}><EditOutlined className={s.btnIcon} /></button>
      <button className={s.deleteAlbumBtn} onClick={clickDeleteAlbumBtnHandler}><DeleteOutlined className={s.btnIcon} /></button>
    </div>
  )
}