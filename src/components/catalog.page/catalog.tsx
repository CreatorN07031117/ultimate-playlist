import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Dropdown, Space } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface';

import { Card } from '../card/card';
import { Pagination } from '../pagination/pagination';
import { Filters } from '../filters/filters';
import { SearchInput } from '../search-input/search-input';
import { getCurrentPage, getSortingType } from '../../store/site-process/site-process';
import { fetchAlbumsForPage, fetchFilteredAlbums } from '../../store/actions';
import store from '../../store/index';
import type { Album } from '../../types/types';
import type { AppDispatch, State } from '../../types/state';
import s from './catalog.module.css';
import { Loader } from '../loader/loader';

const Catalog = (): JSX.Element => {
  const isAlbumsLoading = useSelector((state: State) => state.SITE_PROCESS.isAlbumsLoading);
  const {isFiltered, filters, albums} = useSelector((state:State) => state.SITE_PROCESS);
  const sortingType = useSelector((state:State) => state.SITE_PROCESS.sortingType);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {

    const page = location.search.replace('?page=', '');
    const pageNumber = Number(page) > 0? Number(page) : 1;

    if(location.search && !location.search.includes('?page=')) {
      const searchParams = new URLSearchParams(location.search);
      const genre = searchParams.get('genre');
      const filterPage = searchParams.get('page');
      const filters = {
        genre: genre ? decodeURIComponent(genre.replace(/\+/g, ' ')) : null,
      };
      dispatch(fetchFilteredAlbums({
        genre: filters.genre as string,
        pageNumber: filterPage? parseInt(filterPage, 10) : 1,
        sortingType,
      }));
    } else if(location.search === ''){
      dispatch(fetchAlbumsForPage({
        pageNumber: 1,
        sortingType,
      }));
    } else {
      dispatch(getCurrentPage(page))
      dispatch(fetchAlbumsForPage({
        pageNumber: pageNumber,
        sortingType
      }));
    }
  },[location.search, sortingType]);



  const handleSortingClick = ({ key }: MenuInfo) => {
    store.dispatch(getSortingType(key));
  }

  const items = [{
      key: 'early',
      label: (<span className={s.sorting}>early → late</span>),
      text: 'early → late'
    }, {
      key: 'late',
      label: (<span className={s.sorting}>late → early</span>),
      text: 'late → early'
    }
  ]

  if (isAlbumsLoading) {
    return <Loader />
  }
  
  return (
  <div className={s.catalogWrapper}>
    <h1 className={s.catalogHeader}>{`Albums${isFiltered ?  `: ${filters.genres}` : ''}`}</h1>
    <div className={s.panelWrapper}>
      <Filters />
      <div className={s.sortingWrapper}>
        <SearchInput />
        <div className={s.dropdownWrapper}>
          <Dropdown
            menu={{
              items,
              onClick: handleSortingClick,
            }}
          >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Sorted {sortingType !== '' && `: ${items[items.findIndex((i) => i.key === sortingType)].text}`}
              <DownOutlined />
            </Space>
          </a>
          </Dropdown>
        </div>
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