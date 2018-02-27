import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivateComponent } from './private.component';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from '../core/auth.guard';
import { UserResolve } from './home/user.resolve';

const routes: Routes = [
  { path: '', component: PrivateComponent, canActivate: [AuthGuard], children: [
    { path: '', component: HomeComponent, resolve: {
      user: UserResolve
    }}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
