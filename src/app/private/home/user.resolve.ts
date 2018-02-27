import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../core/auth.service';
import { UserService } from '../../core/user.service';
import { UserDetails } from '../../shared/models/user-details';


@Injectable()
export class UserResolve implements Resolve<UserDetails> {
  constructor(private authService: AuthService, private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<UserDetails> {
    return this.userService.get(<number>this.authService.currentUser.id);
  }
}
