const TOKEN_NAME = 'ultimate-playlist-auth-token';

export function getToken () {
  const token = localStorage.getItem(TOKEN_NAME);

  return token ?? '';
}

export function saveToken (token: string) {
  localStorage.setItem(TOKEN_NAME, token);
}

export function dropToken () {
  localStorage.removeItem(TOKEN_NAME);
  console.log(localStorage.getItem(TOKEN_NAME));
}


