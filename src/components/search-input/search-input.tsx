import { useNavigate } from 'react-router-dom';
import { Input} from 'antd';

import { AppRoute } from '../../const';
import s from './search-input.module.css';

export const SearchInput = () => {
  const { Search } = Input;
  const navigate = useNavigate();

  const onSearch = (value) => {
    const searchParams = new URLSearchParams({"search_text" : value}).toString();
    console.log(searchParams)
    navigate(`${AppRoute.Search}?${searchParams}`);
  };
  
  return (
    <div className={s.searchWrapper}>
      <Search
        placeholder="input search text"
        onSearch={onSearch}
        allowClear
      />
    </div>
  );
};
