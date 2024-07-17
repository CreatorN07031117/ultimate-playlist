import * as React from 'react';
import { HeartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import s from './options-btn.module.css';

type Props = {
  option?: 'album'
}

export const OptionsBtn = (props: Props) => {

  const clickFavoriteBtnHandler = () => {};
  const clickEditAlbumBtnHandler = () => {};
  const clickDeleteAlbumBtnHandler = () => {};


  return (
    <div className={s.options} data-custom={props.option}>
      <button className={s.favoriteBtn} onClick={clickFavoriteBtnHandler}><HeartOutlined className={s.btnIcon} /></button>
      <button className={s.editAlbumBtn} onClick={clickEditAlbumBtnHandler}><EditOutlined className={s.btnIcon} /></button>
      <button className={s.deleteAlbumBtn} onClick={clickDeleteAlbumBtnHandler}><DeleteOutlined className={s.btnIcon} /></button>
    </div>
  )
}