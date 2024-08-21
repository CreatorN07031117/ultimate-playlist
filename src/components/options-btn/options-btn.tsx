import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, EditOutlined, DeleteOutlined, HeartFilled } from '@ant-design/icons';

import { deleteAlbum, updateUserFavoritesList } from '../../store/actions';
import { UserType } from '../../types/enums';
import { AppRoute } from '../../const';
import { AppDispatch, State, User } from '../../types/state';
import s from './options-btn.module.css';

type Props = {
  option?: 'album';
  albumId: string;
};

export const OptionsBtn = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user: User = useSelector((state: State) => state.USER_DATA);

  async function clickFavoriteBtnHandler (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, userId: string, albumId: string) {
    console.log('ffsdsd')
    event.preventDefault();
    event.stopPropagation();
    await dispatch(updateUserFavoritesList({userId, albumId}))
  };

  function clickEditAlbumBtnHandler (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    event.stopPropagation();
    navigate(`${AppRoute.Album}/${props.albumId}${AppRoute.Edit}`);
  };

  async function clickDeleteAlbumBtnHandler(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) {
    event.preventDefault();
    event.stopPropagation();
    const result = await dispatch(deleteAlbum(id));

    if (result === null) {
      window.alert('Ошибка при удалении');
    } else {
      window.alert(`Альбом id ${id} удален`);
    }
  }

  const isFavorite = user.user?.favorites.includes(String(props.albumId)) ?? false;

  return (
    <div className={s.options} data-custom={props.option}>
      <button className={s.favoriteBtn} onClick={(event) => clickFavoriteBtnHandler(event, 'a9ac38f3-dbc1-46e4-bc06-11c4c3b3528e', props.albumId)}>
        {isFavorite ? <HeartFilled className={s.btnIconFilled} /> 
        : <HeartOutlined className={s.btnIcon} />
        }
      </button>
      {user.user?.type === UserType.editor && (
        <button className={s.editAlbumBtn} onClick={clickEditAlbumBtnHandler}>
          <EditOutlined className={s.btnIcon} />
        </button>
      )}
      {user.user?.type === UserType.editor && (
        <button
          className={s.deleteAlbumBtn}
          onClick={(event) => clickDeleteAlbumBtnHandler(event, props.albumId)}
        >
          <DeleteOutlined className={s.btnIcon} />
        </button>
      )}
    </div>
  );
};
