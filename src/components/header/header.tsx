import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import {UserOutlined} from '@ant-design/icons';

import { AppRoute } from '../../const';
import type { AppDispatch, State, User } from '../../types/state';
import logo from './logo.png'
import s from './header.module.css';


export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user: User = useSelector((state:State) => state.USER_DATA);

  /* Заменяется на данные */
  const isAuthorized = user.authorizationStatus;

  return (
    <>
      {console.log(user)}
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
              <li className={s.navItem}>
                <Link className={s.navLink} to={AppRoute.Add}>
                  <span>+ New album</span>
                </Link>
              </li>
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
                Log out
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