import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './directives/draggable.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [DraggableDirective],
  declarations: [DraggableDirective]
})
export class SharedModule { }
