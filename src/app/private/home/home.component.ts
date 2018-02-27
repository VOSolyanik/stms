import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserDetails } from '../../shared/models/user-details';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  user: UserDetails;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.user = this.route.snapshot.data.user;
  }

  savePosition(point, type) {
    let {picturePosition, namePosition} = this.user;
    if(type === 'name') {
      namePosition = point;
    }
    if(type === 'picture') {
      picturePosition = point;
    }
    this.userService.updatePositions(this.user.id, {namePosition, picturePosition})
      .subscribe();
  }

}
