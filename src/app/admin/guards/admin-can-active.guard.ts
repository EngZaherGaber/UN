import { CanActivateFn, Router } from '@angular/router';

export const adminCanActiveGuard: CanActivateFn = (route, state) => {
  const isThereToken = !localStorage.getItem('token');
  const isAdmin = (localStorage.getItem('role') as string)?.toLowerCase() === 'admin';
  const expired = localStorage.getItem('expired') ?? '';
  const isAuth = new Date(expired) > new Date();
  if (isAdmin && !isThereToken && isAuth) {
    return true;
  } else {
    (new Router()).navigate(['login']);
    return false;
  }
};
