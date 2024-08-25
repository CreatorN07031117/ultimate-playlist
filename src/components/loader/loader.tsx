import loader from '../../assets/loader.png';
import s from './loader.module.css';

export const Loader = () => (
  <div className={s.loaderWrapper}>
    <img className={s.loaderImg} src={loader} width="35" height="35" />
    Loading...
  </div>
)
