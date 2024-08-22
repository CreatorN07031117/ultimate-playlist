import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import { fetchFilteredAlbums } from '../../store/actions';
import type { AppDispatch, State } from '../../types/state';
import s from './filters.module.css';

export const Filters = () => {
  const [filters, setFilters] = useState({});
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { genres } = useSelector((state: State) => state.SITE_PROCESS);

  const handleFilterChange = (filterName: string, value: string) => {
    const updatedFilters = {
      ...filters,
      [filterName]: value,
    };

    setFilters(updatedFilters);
    dispatch(fetchFilteredAlbums({
      genre: updatedFilters.genre,
      pageNumber: 1
    }));

    const searchParams = new URLSearchParams(updatedFilters).toString();
    navigate(`${location.pathname}?${searchParams}`);
  };

  return (
    <div className={s.filtersWrapper}>
      {genres.map((genre) => (
        <button key={genre} className={s.filterBtn} onClick={() => handleFilterChange('genre', genre)}>
          {genre}
        </button>
      ))}
    </div>
  );
};

