import * as React from 'react';

const Favorites = (): JSX.Element => {
  
  retunr (
    <div className={s.catalogWrapper}>
      <h1>Favorites albums</h1>
      <div className={s.catalog}>
      {albums.map((album: Album) => (
        <div key={album.id}>
          <Card album={album} />
        </div>
      ))}
    </div>
    </div>
)}

export default Favorites;