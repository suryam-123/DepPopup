/* 
 *   File: cspfmBalloonComponent.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

// * @author tami2847 - tamilselvan.k
// * @tag 18JAN2022#tami2847
// * @message CR - Balloon UI implementation for view page

import { OnInit, Component, Input, ViewChild, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { cspfmBalloonDirective } from 'src/core/directive/cspfmBalloon.directive';
declare const $: any;
@Component({
  selector: 'cspfmBalloonComponent',
  templateUrl: './cspfmBalloonComponent.html',
})
export class cspfmBalloonComponent implements OnInit {

  @ViewChild(cspfmBalloonDirective, { static: true })
  childRef!: cspfmBalloonDirective;

  public info: any;
  public balloonPopupInfoFromList: any;
  public balloonPopupInfoFromView: any;
  private balloonComponenetInstance:any
  @Input() set balloonLayoutInfoFromView(balloonLayoutParamsFromView: any) {
    if (balloonLayoutParamsFromView) {
      this.balloonPopupInfoFromView = balloonLayoutParamsFromView;
    }
  }
  @Output() closePopover: EventEmitter<any> = new EventEmitter();
  constructor(public componentFact: ComponentFactoryResolver) {}

  ngOnInit() {
    this.balloonPopupInfoFromList = this.info;
    if (this.balloonPopupInfoFromList && Object.keys(this.balloonPopupInfoFromList) && this.balloonPopupInfoFromList['balloonLayoutInfo']['layoutName'] && this.balloonPopupInfoFromList['balloonLayoutInfo']['id'] && this.balloonPopupInfoFromList['balloonLayoutInfo']['redirectUrlForNav']) {
      this.setLayoutForBalloonUIFromList(this.balloonPopupInfoFromList);
    }
  }

  setLayoutForBalloonUIFromList(balloonInfoFromList: any) {
    this.childRef.viewRef.clear();
    const resolvedFact = this.componentFact.resolveComponentFactory(balloonInfoFromList['balloonLayoutInfo']['layoutName']);
    this.balloonComponenetInstance = this.childRef.viewRef.createComponent(resolvedFact);
    this.balloonComponenetInstance.instance['setIdVal'] = balloonInfoFromList['balloonLayoutInfo'];;
  }

  ngOnChanges() {
    if (this.balloonPopupInfoFromView && this.balloonPopupInfoFromView['layoutName'] && this.balloonPopupInfoFromView['id'] && this.balloonPopupInfoFromView['redirectUrlForNav']) {
      this.childRef.viewRef.clear();
      const resolvedFact = this.componentFact.resolveComponentFactory(this.balloonPopupInfoFromView['layoutName']);
      this.balloonComponenetInstance = this.childRef.viewRef.createComponent(resolvedFact);
      this.balloonComponenetInstance.instance['setIdVal'] = this.balloonPopupInfoFromView;
    }
  }
  ngOnDestory() {
    this.balloonComponenetInstance.instance.ngOnDestroy()
  }

  balloonPopupCloseClick() {
    if (this.balloonPopupInfoFromList && this.balloonPopupInfoFromList['balloonLayoutInfo']['balloonCallFromList']) {
      if ($('.cs-balloon-popup-style:visible')) {
        $('.cs-balloon-popup-style').parents('cspfmballooncomponent').remove();
      }
    } else {
      this.closePopover.emit();
    }
    $('cspfmballooncomponent').fadeOut("slow", "linear")
  }
  
}