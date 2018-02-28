import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: {username: string, password: string}) {
    return this.http.post<AuthUser>('/api/authenticate', credentials)
      .map(user => {
        // login successful if there's a token in the response
        if (user && user.token) {
            // store user details and token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return user;
      });
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  get currentUser() {
    let currentUser = null;
    try {
      currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {
      console.error(e);
    }
    return currentUser;
  }

}

export interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  token: string;
}
