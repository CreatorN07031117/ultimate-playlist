import React, { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Dropdown, Space, Select } from "antd";
import { DownOutlined } from '@ant-design/icons';

import { Card } from '../card/card';
import { Pagination } from '../pagination/pagination';
import { Filters } from '../filters/filters';
import { getCurrentPage, getSortingType } from '../../store/site-process/site-process';
import { fetchAlbumsForPage } from '../../store/actions';
import store from '../../store/index';
import type { Album, AppDispatch } from '../../types/types';
import type { State } from '../../types/state';
import s from './catalog.module.css';

const Catalog = (): JSX.Element => {
  const isAlbumsLoading = useSelector((state: State) => state.SITE_PROCESS.isAlbumsLoading);
  const {isFiltered, filters, albums} = useSelector((state:State) => state.SITE_PROCESS);
  const sortingType = useSelector((state:State) => state.SITE_PROCESS.sortingType);
  const location = useLocation();

  useEffect(() => {
    if(location.pathname === '/'){
      store.dispatch(fetchAlbumsForPage({
        pageNumber: 1,
        sortingType
      }));
    } else {
      const page = location.pathname.replace('/', '');
      store.dispatch(getCurrentPage(page))
      store.dispatch(fetchAlbumsForPage({
        pageNumber: Number(page), 
        sortingType
      }));
    }
  },[location.pathname, sortingType]);



  const handleSortingClick = ({key}) => {
    store.dispatch(getSortingType(key));
  }

  const items = [{
      key: 'early',
      label: (<span className={s.sorting}>early → late</span>),
    }, {
      key: 'late',
      label: (<span className={s.sorting}>late → early</span>),
    }
  ]

  if (isAlbumsLoading) {
    return <div>Loading...</div>
  }
  
  return (
  <div className={s.catalogWrapper}>
    <h1>{`Albums${isFiltered ?  `: ${filters.genres}` : ''}`}</h1>
    <div className={s.panelWrapper}>
      <Filters />
      <div className={s.sortingWrapper}>
        <Dropdown
            menu={{
              items,
              onClick: handleSortingClick,
            }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Sorted
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
    <div className={s.catalog}>
      {albums.map((album: Album) => (
        <div key={album.id}>
          <Card album={album} />
        </div>
      ))}
    </div>
    <div>
      <Pagination />
    </div>
  </div>
)}

export default Catalog;