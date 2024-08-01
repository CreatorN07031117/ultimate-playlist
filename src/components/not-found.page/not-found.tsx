import React from "react";
import img from './404.png';
import s from './not-found.module.css';

const NotFound = (): JSX.Element => (
  <div className={s.root}>
    <img className={s.img} src={img} />
    <h1 className={s.notFound}>Page not found</h1>
  </div>
)

export default NotFound;