import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { SharedModule } from '../shared/shared.module';

import { PrivateComponent } from './private.component';
import { HomeComponent } from './home/home.component';

import { UserResolve } from './home/user.resolve';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PrivateRoutingModule
  ],
  declarations: [PrivateComponent, HomeComponent],
  providers: [UserResolve]
})
export class PrivateModule { }
