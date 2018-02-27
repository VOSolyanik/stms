import { Directive, ElementRef, OnInit, Renderer2, NgZone, Input, Output, EventEmitter } from '@angular/core';

import { fromEvent } from 'rxjs/observable/fromEvent';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {
  @Input() position: Position;
  @Output() dragEnd: EventEmitter<Position> = new EventEmitter();

  private startPosition: Position;
  private tempTrans: Position = {x: 0, y: 0};

  constructor(private elemRef: ElementRef, private renderer: Renderer2, private zone: NgZone) { }

  private onMouseMove;
  private onMouseUp;

  ngOnInit() {
    // add class for cursor: pointer
    this.renderer.addClass(this.elemRef.nativeElement, 'draggable');
    // if initial position x or y not defined, initialize as 0
    if(!this.position) {
      this.position = this.position || {x: 0, y: 0};    
    }
    this.position.x = this.position.x || 0;
    this.position.y = this.position.y || 0;
    // translate is there are some initial position 
    this.checkBounds(this.position);
    this.transalate(this.position);

    fromEvent(this.elemRef.nativeElement, 'mousedown')
      .subscribe((e: MouseEvent) => {
        if (e.button === 2) {
          return;
        }
        event.preventDefault();
        this.startPosition = {x: e.clientX, y: e.clientY};
        this.zone.runOutsideAngular(() => {
          // save function for removeListeners and add listeners
          this.onMouseMove = this.mouseMove.bind(this);
          this.onMouseUp = this.mouseUp.bind(this);
          window.document.addEventListener('mousemove', this.onMouseMove);
          window.document.addEventListener('mouseup', this.onMouseUp);
          window.document.addEventListener('mouseleave', this.onMouseUp);
        });
      });
  }

  mouseMove(e: MouseEvent) {
    // calculate new position 
    this.tempTrans.x = this.position.x - (this.startPosition.x - e.clientX);
    this.tempTrans.y = this.position.y - (this.startPosition.y - e.clientY);
    //check if out of page and if it is - revert position
    this.checkBounds(this.tempTrans);
    // move element
    this.transalate(this.tempTrans);
  }

  mouseUp(event) {
    window.document.removeEventListener('mousemove', this.onMouseMove);
    window.document.removeEventListener('mouseup', this.onMouseUp);
    window.document.removeEventListener('mouseleave', this.onMouseUp);
    this.zone.run(() => {
      this.position = Object.assign({}, this.tempTrans);
      this.tempTrans = {x: 0, y: 0};
      this.startPosition = {x: 0, y: 0};
      this.dragEnd.next(this.position);
    });
  }


  private checkBounds(position: Position) {
    let rect = this.elemRef.nativeElement.getBoundingClientRect();
    let height = Math.max(document.body.clientHeight, window.innerHeight);
    let width = Math.min(document.body.clientWidth, window.innerWidth);
    if(rect.x < 0) {
      position.x -= rect.x;
    }
    if(rect.x + rect.width > width) {
      position.x -= rect.x + rect.width - width;
    }
    if(rect.y < 0) {
      position.y -= rect.y;
    }
    if(rect.y + rect.height > height) {
      position.y -= rect.y + rect.height - height;
    }
  }

  private transalate(point: Position) {
    let value = `translate(${point.x}px, ${point.y}px)`;

    this.renderer.setStyle(this.elemRef.nativeElement, 'transform', value);
    this.renderer.setStyle(this.elemRef.nativeElement, '-webkit-transform', value);
    this.renderer.setStyle(this.elemRef.nativeElement, '-ms-transform', value);
    this.renderer.setStyle(this.elemRef.nativeElement, '-moz-transform', value);
    this.renderer.setStyle(this.elemRef.nativeElement, '-o-transform', value);
  }

}

export class Position {
  x: number;
  y: number;
}
