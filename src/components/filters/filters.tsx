import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import { fetchFilteredAlbums } from '../../store/actions';
import type { AppDispatch, State } from '../../types/state';
import s from './filters.module.css';

export const Filters = () => {
  const [filters, setFilters] = useState({});
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { genres } = useSelector((state:State) => state.SITE_PROCESS);

  useEffect(() => {
    const searchParams = new URLSearchParams(filters).toString();
    navigate(`${location.pathname}?${searchParams}`);
  }, [filters, navigate, location.pathname]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialFilters = {};
    searchParams.forEach((value, key) => {
      initialFilters[key] = value;
    });
    setFilters(initialFilters);

    if (initialFilters?.genre) {
      dispatch(fetchFilteredAlbums(initialFilters.genre));
    }
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
    dispatch(fetchFilteredAlbums(value));
  };
  
  return (
    <div className={s.filtersWrapper}>
      {genres.map((genre) => (<button onClick={() => handleFilterChange('genre', genre)}>{genre}</button>))}
    </div>
  )
}

