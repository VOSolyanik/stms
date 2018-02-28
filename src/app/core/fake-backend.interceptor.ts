import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';


let firstUserPositions = null;
try {
  firstUserPositions = JSON.parse(localStorage.getItem('1.userPositions'));
} catch (e) {
  console.error(e);
}

const users: any[] = [
  {
    id: 1,
    username: 'james',
    password: 'bond007',
    firstName: 'James',
    lastName: 'Bond',
    pictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuzQP4Z-EfuWhunwxZ6zbMCDPFFQVyA6bT0eYm53pV40z1w0FY',
    picturePosition: firstUserPositions && firstUserPositions.picturePosition || {x: null, y: null},
    namePosition: firstUserPositions && firstUserPositions.namePosition || {x: null, y: null}
  }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      // wrap in delayed observable to simulate server api call
      return Observable.of(null).mergeMap(() => {
          // authenticate
        if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
          // find if any user matches login credentials
          const authUser = users.find(user => {
              return user.username === request.body.username && user.password === request.body.password;
          });

          if (authUser) {
            // if login details are valid return 200 OK with user details and fake jwt token
            const body = {
              id: authUser.id,
              username: authUser.username,
              firstName: authUser.firstName,
              lastName: authUser.lastName,
              token: 'fake-jwt-token'
            };

            return Observable.of(new HttpResponse({ status: 200, body: body }));
          } else {
            // else return 400 bad request
            return Observable.throw({errorMessage: 'Username or password is incorrect'});
          }
        }

        // get user by id
        if (request.url.match(/\/api\/user\/\d+$/) && request.method === 'GET') {
          // check for fake auth token in header and return user if valid,
          // this security is implemented server side in a real application
          if (request.headers.get('Authorization') === 'fake-jwt-token') {
            // find user by id in users array
            const urlParts = request.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 1], 10);
            const matchedUser = users.find(user => user.id === id);

            return Observable.of(new HttpResponse({ status: 200, body: matchedUser }));
          } else {
            // return 401 not authorised if token is null or invalid
            return Observable.throw({errorMessage: 'Unauthorised'});
          }
        }

        // update user positions by id
        if (request.url.match(/\/api\/user\/\d+\/positions$/) && request.method === 'PUT') {
          // check for fake auth token in header and return user if valid,
          // this security is implemented server side in a real application
          if (request.headers.get('Authorization') === 'fake-jwt-token') {
            // find user by id in users array
            const urlParts = request.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 2], 10);
            const matchedUser = users.find(user => user.id === id);
            // update user positions
            matchedUser.picturePosition = request.body.picturePosition;
            matchedUser.namePosition = request.body.namePosition;
            // additionaly save in LS for restore after reload
            // but even without this will restor positions after Logout/Login
            localStorage.setItem(id + '.userPositions', JSON.stringify(request.body));

            return Observable.of(new HttpResponse({ status: 200, body: matchedUser }));
          } else {
            // return 401 not authorised if token is null or invalid
            return Observable.throw({errorMessage: 'Unauthorised'});
          }
        }

        // pass through any requests not handled above
        return next.handle(request);

      })
      .materialize()
      .delay(500)
      .dematerialize();
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
