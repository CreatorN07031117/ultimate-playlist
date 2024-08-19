import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Input } from 'antd';

import { Card } from '../card/card';
import { searchAlbums } from '../../store/actions';
import type { Album, AppDispatch } from '../../types/types';
import s from './search-result.module.css';

export const SearchResult = () => {
  const { Search } = Input;
  const [searchResult, setSearchResult] = useState<Album[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchText = searchParams.get('search_text');

  useEffect(() => {
    const fetchData = async () => {
      if (searchText !== null) {
        console.log('gdg')
        try {
          const result = await dispatch(searchAlbums(searchText)).unwrap();
          if (result) {
            setSearchResult(result);
          }
        } catch (error) {
          console.error('Ошибка при выполнении поиска:', error);
        }
      }
    };
  
    fetchData();
  }, []);

  const onSearch = async (value: string) => {
    const data = await dispatch(searchAlbums(value));
    console.log(`data: ${data.payload}`)
    setSearchResult(data.payload as unknown as Album[]);
    const searchParams = new URLSearchParams({'search_text': value}).toString();
    navigate(`${location.pathname}?${searchParams}`);
  };

  return (
    <div className={s.searchWrapper}>
      <Search
        placeholder="input search text"
        defaultValue={String(searchText)}
        onSearch={onSearch}
        allowClear
        style={{
          width: 200,
        }}
      />
      <div className={s.resultWrapper}>
        {searchResult.length > 0 ? (
          searchResult.map((album: Album) => <Card album={album} />)
        ) : (
          <div className={s.textResult}>
            {searchText
              ? 'Nothing was found for your request'
              : 'Enter the name of the group or album'}
          </div>
        )}
      </div>
    </div>
  );
};
