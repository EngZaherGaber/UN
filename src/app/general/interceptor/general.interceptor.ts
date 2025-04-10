import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';
@Injectable()
export class generalInterceptor implements HttpInterceptor {
  constructor(private msgSrv: ToastService) { }
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    let newReq;
    if (localStorage.getItem('token')) {
      newReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
    } else {
      newReq = req;
    }
    return handler.handle(newReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          let msg = error.error?.errors[0];
          switch (error.status) {
            case 401:
              msg = msg ?? 'Your Credential is Invalid';
              this.msgSrv.showError(msg, 'Unauthorized!');
              break;
            case 404:
              msg = msg ?? 'Your API not found';
              this.msgSrv.showError(msg, '404!');
              break;
            case 400:
              msg = msg ?? 'Bad Request!';
              this.msgSrv.showError(msg, '400!');
              break;
            case 500:
            case 0:
              this.msgSrv.showError('Internal Server Error', '500!');
              break;
            default:
              this.msgSrv.showError('An unexpected error occurred', 'Error!');
              break;
          }
        }
        return throwError(() => error);
      })
    );
  }
}