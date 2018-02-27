import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserDetails } from '../shared/models/user-details';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  get(id: number) {
    return this.http.get<UserDetails>(`/api/user/${id}`);
  }

  updatePositions(id: number, {picturePosition, namePosition}) {
    return this.http.put<UserDetails>(`/api/user/${id}/positions`, {picturePosition, namePosition});
  }

}
