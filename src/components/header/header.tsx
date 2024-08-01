import * as React from 'react';
import { Link, Outlet } from 'react-router-dom';
import {UserOutlined} from '@ant-design/icons';
import { AppRoute } from '../const';
import type { User } from '../../types/types';
import logo from './logo.png'
import s from './header.module.css';

export const Header = () => {

  /* Заменяется на данные */
  const user: User = {
    name: "John Doe",
    type: 'user',
    favorites: [],
  }

  /* Заменяется на данные */
  const isAuthorized = true;

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
            {isAuthorized? (
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
                <span className={s.userName}>{user.name}</span>
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