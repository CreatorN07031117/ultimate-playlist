import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import {UserOutlined} from '@ant-design/icons';

import { logOut } from '../../store/user-data/user-data';
import { dropToken } from '../../helpers/token-functions';
import { UserType } from '../../types/enums';
import { AppRoute } from '../../const';
import type { State, User } from '../../types/state';
import logo from './logo.png'
import s from './header.module.css';
import { signOut } from '../../store/actions';
import store from '../../store';

export const Header = () => {
  const user: User = useSelector((state:State) => state.USER_DATA);
  const isAuthorized = user.authorizationStatus;

  const handleLogOut = () => {
    store.dispatch(signOut());
  }

  return (
    <>
      <header className={s.header}>
        <div className={s.headerLogo}>
          <Link to="/">
            <img src={logo} width="70"/>
          </Link>
        </div>
        <nav className={s.headerNavWrapper}>
          <ul className={s.headerNavList}>
            {isAuthorized === 'AUTH' ? (
              <>
              {user.user?.type === UserType.editor && (<li className={s.navItem}>
                <Link className={s.navLink} to={AppRoute.Add}>
                  <span>+ New album</span>
                </Link>
              </li>)}
              <li className={s.navItem}>
                <Link to={AppRoute.Favorites}>
                  <span>Favorites</span>
                </Link>
              </li>
              <li className={s.navItem}>
                <UserOutlined />
                <span className={s.userName}>{user.user?.name}</span>
              </li>
              <li className={s.navItem}>
                <button className={s.buttonLink} onClick={handleLogOut}>Log out</button>
              </li>
            </>
          ) : (
            <li className={s.navItem}>
               <Link to={AppRoute.Login}>
                  Login
               </Link>
            </li>
          )}
          </ul>
        </nav>
      </header>
      <Outlet />
    </>
  )
}