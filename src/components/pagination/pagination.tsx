import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { getCurrentPage } from '../../store/site-process/site-process';
import type { AppDispatch, State } from '../../types/state';
import s from './pagination.module.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import classNames from 'classnames';

export const Pagination = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { pages, currentPage, isFiltered } = useSelector(
    (state: State) => state.SITE_PROCESS
  );

  const pre = isFiltered? `/${location.search.replace(`&page=${currentPage}`, '')}&page=` : `/?page=`

  const pageNumbers: number[] = [];

  for (let i = 0; i < pages; i = i + 1) {
    pageNumbers.push(i + 1);
  }

  const handleClick = (item: number) => {
    dispatch(getCurrentPage(item));
  };

  return (
    pages > 1 && (
      <div className={s.pagination}>
        <ul className={s.paginationList}>
          {currentPage > 1 && (
            <li className={s.paginationPrev} id="prev">
              <Link
                to={`${pre}${currentPage - 1}`}
                className={classNames(s.paginationLink, s.paginationLinkNoBorder)}
              >
                <LeftOutlined />
              </Link>
            </li>
          )}
          {pageNumbers.map((item) => (
            <li
              className={
                item === Number(currentPage) ? s.paginationPageActive : s.paginationPage
              }
              key={item}
              onClick={(evt) => {
                evt.preventDefault();
                handleClick(item);
              }}
            >
              <Link
                to={
                  item === 1 && location.search === ''
                    ? '/'
                    : `${pre}${item}`
                }
                className={s.paginationLink}
              >
                {item}
              </Link>
            </li>
          ))}
          {currentPage < pages && (
            <li className={s.paginationNext} id="next">
              <Link
                to={`${pre}${currentPage + 1}`}
                className={classNames(s.paginationLink, s.paginationLinkNoBorder)}
              >
                <RightOutlined />
              </Link>
            </li>
          )}
        </ul>
      </div>
    )
  );
};
