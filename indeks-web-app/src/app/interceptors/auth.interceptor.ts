import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  catchError,
  switchMap,
  throwError,
  Observable,
  of,
  filter,
  take,
} from 'rxjs';

function addTokenHeader(
  request: HttpRequest<any>,
  token: string
): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
): Observable<any> => {
  const authService = inject(AuthService);

  const refreshTokenEndpoint = `http://localhost:8080/api/v1/auth/refresh`;
  const loginEndpoint = `http://localhost:8080/api/v1/auth/login`;

  if (req.url === refreshTokenEndpoint || req.url === loginEndpoint) {
    return next(req);
  }

  const accessToken = authService.getToken();
  let clonedReq = req;

  if (accessToken) {
    clonedReq = addTokenHeader(req, accessToken);
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        console.warn(
          '403 Forbidden detected (likely expired token). Attempting refresh or waiting...'
        );

        if ((authService as any)['isRefreshing']) {
          console.log('Refresh already in progress. Waiting...');

          return (authService as any)['refreshTokenSubject'].pipe(
            filter((token: string | null) => token !== null),
            take(1),
            switchMap((newAccessToken: string | null) => {
              if (newAccessToken) {
                console.log(
                  'Received new token from refresh. Retrying original request.'
                );
                return next(addTokenHeader(req, newAccessToken));
              } else {
                console.error(
                  'Token refresh failed during wait. Original 403 error will be propagated.'
                );
                return throwError(() => error) as Observable<
                  HttpEvent<unknown>
                >;
              }
            })
          );
        } else {
          console.log('No refresh in progress. Starting refresh...');
          (authService as any)['isRefreshing'] = true;

          return authService.refreshToken().pipe(
            switchMap((authResponse: any) => {
              (authService as any)['isRefreshing'] = false;

              if (authResponse && authResponse.token) {
                console.log(
                  'Token refresh successful. Retrying original request.'
                );
                return next(addTokenHeader(req, authResponse.token));
              } else {
                console.error(
                  'Token refresh failed. Original 403 error will be propagated.'
                );
                return throwError(() => error) as Observable<
                  HttpEvent<unknown>
                >;
              }
            }),
            catchError((refreshError) => {
              console.error(
                'Error during refresh token process. Logout should have occurred.',
                refreshError
              );
              (authService as any)['isRefreshing'] = false;
              (authService as any)['refreshTokenSubject'].next(null);
              return throwError(() => error) as Observable<HttpEvent<unknown>>;
            })
          );
        }
      } else if (error.status === 401) {
        console.error(
          '401 Unauthorized detected (authentication issue other than expiry). Logging out.',
          error.error
        );
        authService.logout();
        return throwError(() => error) as Observable<HttpEvent<unknown>>;
      } else {
        console.error(`HTTP Error ${error.status}:`, error);
        return throwError(() => error) as Observable<HttpEvent<unknown>>;
      }
    })
  );
};
