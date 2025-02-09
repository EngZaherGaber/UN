import { HttpInterceptorFn } from '@angular/common/http';

export const generalInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
