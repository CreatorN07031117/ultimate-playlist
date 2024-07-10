import * as React from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../const';
import type { User } from '../../types/types';
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
      <header className={s.header}>
        <div className={s.headerLogo}>
          Лого
        </div>
        <nav className={s.headerNavWrapper}>
          <ul className={s.headerNavList}>
            {isAuthorized? (
              <>
                {user.type === 'editor' && (
                  <li className={s.navItem}>
                    <Link className={s.navLink} to={AppRoute.Add}>
                      <span>+ New offer</span>
                    </Link>
                  </li>
                )}
              <li className={s.navItem}>
                <Link to={AppRoute.Favorites}>
                  <span>Favorites</span>
                </Link>
              </li>
              <li className={s.navItem}>
                <img className={s.userIcon} src={'./assets/icon.png'} alt={user.name} />
                <span>{user.name}</span>
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
  )
}