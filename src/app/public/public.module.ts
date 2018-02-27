import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing.module';

import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PublicRoutingModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class PublicModule { }
