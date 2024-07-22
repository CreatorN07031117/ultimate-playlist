import { AuthorizationStatus, StoreSlice } from '../../types/enums';
import type { State } from '../../types/state';
import type { UserData } from '../../types/types';

export const getAuthorizationStatus = ({ [StoreSlice.userData]: USER_DATA }: State): AuthorizationStatus => USER_DATA.authorizationStatus;
export const getIsAuthorized = ({ [StoreSlice.userData]: USER_DATA }: State): boolean => USER_DATA.authorizationStatus === AuthorizationStatus.Auth;
export const getUser = ({ [StoreSlice.userData]: USER_DATA }: State): UserData => USER_DATA.user;
