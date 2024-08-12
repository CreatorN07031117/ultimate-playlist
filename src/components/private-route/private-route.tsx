import { Navigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';

type PrivateRouteProps = {
  restrictedFor: AuthorizationStatus;
  redirectTo: AppRoute;
  children: JSX.Element;
}

const PrivateRoute = ({ children, restrictedFor, redirectTo }: PrivateRouteProps): JSX.Element => {
  /* Заменяется на данные */
  const authorizationStatus = null;

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    /* Добавить лоадинг */
    return (<div> Loading... </div>);
  }

  return (
    authorizationStatus !== restrictedFor
      ? children
      : <Navigate to={redirectTo} />
  );
};

export default PrivateRoute;
