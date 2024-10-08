import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { CloseOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import { signOut } from '../../store/actions';
import { AppRoute, DESKTOP_WIDTH } from '../../const';
import { UserType } from '../../types/enums';
import type { AppDispatch, State, User } from '../../types/state';
import logo from '../../assets/logo.png';
import s from './header.module.css';


<MenuOutlined />;
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < DESKTOP_WIDTH);
  const user: User = useSelector((state: State) => state.USER_DATA);
  const isAuthorized = user.authorizationStatus;
  const dispatch = useDispatch<AppDispatch>();

  const navRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < DESKTOP_WIDTH);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleLogOut () {
    setIsOpen(false);
    dispatch(signOut()) ;
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
        <nav 
          ref={navRef}
          className={classNames(
            s.headerNavWrapper,
            isMobile && isAuthorized && s.mobileNavWrapper,
            isMobile && isAuthorized &&!isOpen && s.headerNavHidden
          )}
        >
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
