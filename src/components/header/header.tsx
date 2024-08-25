import { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { CloseOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import store from '../../store';
import { signOut } from '../../store/actions';
import { AppRoute, DESKTOP_WIDTH } from '../../const';
import { UserType } from '../../types/enums';
import type { State, User } from '../../types/state';
import logo from '../../assets/logo.png';
import s from './header.module.css';

<MenuOutlined />;
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < DESKTOP_WIDTH);
  const user: User = useSelector((state: State) => state.USER_DATA);
  const isAuthorized = user.authorizationStatus;

  useLayoutEffect(() => {
    // Функция для обновления ширины экрана
    const handleResize = () => {
      setIsMobile(window.innerWidth < DESKTOP_WIDTH);
    };

    // Подписываемся на событие изменения размера окна
    window.addEventListener('resize', handleResize);

    // Очищаем подписку при размонтировании компонента
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogOut = () => {
    setIsOpen(false);
    store.dispatch(signOut());
  };

  return (
    <>
      <header className={s.header}>
        <div className={s.headerWrapper}>
          <div className={s.headerLogo}>
            <Link to="/">
              <img src={logo} width="70" />
            </Link>
          </div>
          {isAuthorized === 'AUTH' && isMobile && (
            <div className={s.hamburger}>
              {isOpen ? (
                <CloseOutlined style={{ fontSize: '24px' }} onClick={() => setIsOpen(false)} />
              ) : (
                <MenuOutlined style={{ fontSize: '24px' }} onClick={() => setIsOpen(true)} />
              )}
            </div>
          )}
          {
           isAuthorized === 'NO_AUTH' && isMobile && (
            <div className={s.loginWrapper}>
              <Link to={AppRoute.Login}>Login</Link>
            </div>
           )
          }
        </div>
        <nav className={classNames(s.headerNavWrapper, isMobile && isAuthorized && s.mobileNavWrapper, isMobile && isAuthorized &&!isOpen && s.headerNavHidden)}>
          <ul className={s.headerNavList}>
            {isAuthorized === 'AUTH' ? (
              <>
                {user.user?.type === UserType.editor && (
                  <li className={s.navItem}>
                    <Link className={s.navLink} to={AppRoute.Add}>
                      <span>+ New album</span>
                    </Link>
                  </li>
                )}
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
                  <button className={s.buttonLink} onClick={handleLogOut}>
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <li className={s.navItem}>
                <Link to={AppRoute.Login}>Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <Outlet />
    </>
  );
};
