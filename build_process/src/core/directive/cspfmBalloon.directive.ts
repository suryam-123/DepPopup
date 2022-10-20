// * @author tami2847 - tamilselvan.k
// * @tag 18JAN2022#tami2847
// * @message CR - Balloon UI implementation for view page
 
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHost]'
})
export class cspfmBalloonDirective {

  constructor(public viewRef: ViewContainerRef) { }

}
