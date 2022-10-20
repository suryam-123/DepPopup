/* 
 *   File: cspfmWebAction.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input } from '@angular/core';
 import { appUtility } from 'src/core/utils/appUtility';
 import { cspfmWebActionService } from 'src/core/services/cspfmWebAction.service';
 import { SlickgridPopoverService } from '../../services/slickgridPopover.service';
 import { cspfmWebPopoverAction } from '../cspfmWebPopoverAction/cspfmWebPopoverAction';
 declare const $: any;
 declare const window: any;
 @Component({
   selector: 'cspfmWebAction',
   templateUrl: './cspfmWebAction.html',
   styleUrls: ['./cspfmWebAction.scss'],
 })
 export class cspfmWebAction implements OnInit {
 
 
   public actionConfig;
   public dataObjectData = ''
   public viewArea = ''
   public dripDownAttribute = '';
   public layoutActionJson = '';
   public layoutId = ''
   public elementId = ''
   public labelElementId='';
   public buttonElementId='';
   public iconElementId = '';
   public iconStyle;
   public buttonStyle;
   public labelStyle;
 
 
   constructor(public appUtilObj: appUtility,
     private cspfmWebActionServiceObj: cspfmWebActionService, private slickgridpopoverservice: SlickgridPopoverService) {
   }
   
 
   @Input() set actionConfigJson(configJson: string) {
     this.layoutActionJson = (configJson !== undefined && configJson !== null) ? configJson : "";
   }
 
 
   @Input() set dataObject(dataSet: string) {
     this.dataObjectData = (dataSet !== undefined && dataSet !== null) ? dataSet : '';
   }
 
   @Input() set setElementId(elementId) {
     this.elementId = elementId
     this.iconElementId = elementId+'_icon';
     this.buttonElementId = elementId+'_button';
     this.labelElementId =  elementId+'_label';
 
   }
   @Input() set setViewArea(viewAreaName) {
     this.viewArea = viewAreaName;
   }
 
   @Input() set LayoutId(layoutId) {
     this.layoutId = layoutId
     this.dripDownAttribute = '#cs-dropdown-' + this.layoutId;
   }
   public styleNumber = 1;
   @Input() set styleData(styleno) {
     this.styleNumber = styleno;
   }
 
   @Input() set setButtonStyle(buttonStyle) {
   
     this.buttonStyle = buttonStyle;
 
   }
   @Input() set setLabelStyle(labelStyle) {
     this.labelStyle = labelStyle;
   }
   @Input() set setIconStyle(iconStyle) {
     this.iconStyle = iconStyle;
   }
 
   handleMailActionClick(event) {
     if (document.getElementById('cs-dropdown-' + this.layoutId)) {
       let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
       htmlElement.innerHTML = '';
     }
 
     if (this.layoutActionJson['multiSelectListOption'] && (!this.dataObjectData || this.dataObjectData && this.dataObjectData.length === 0)) {
       this.appUtilObj.presentToast('Kindly select the records to proceed')
       return;
     }
 
     if (this.layoutActionJson['mailComposeOptions'].length === 1) {
       var composeOptionType = this.layoutActionJson['mailComposeOptions'][0]
       var dataSet = this.cspfmWebActionServiceObj.makeMailActionData(this.layoutActionJson, this.dataObjectData)
 
       if (composeOptionType === 'Gmail') {
         this.cspfmWebActionServiceObj.callEmailComposer(dataSet)
       } else if (composeOptionType === 'OutLook') {
         this.cspfmWebActionServiceObj.callOutLookComposer(dataSet)
       } else {
         this.cspfmWebActionServiceObj.callUserDefaultComposer(dataSet)
       }
 
     }else {
       this.loadPopupComponent(event)
     }
   }
   ngOnInit() {
     setTimeout(() => {
       if(this.buttonStyle){
         document.getElementById(this.buttonElementId).setAttribute('style', this.buttonStyle);
       }
       if(this.iconStyle){
         document.getElementById(this.iconElementId).setAttribute('style', this.iconStyle);
       }
       if(this.labelStyle){
         document.getElementById(this.labelElementId).setAttribute('style', this.labelStyle);  
       }    
     }, 0);
 
    }
   loadPopupComponent(event) {
     let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
     htmlElement.innerHTML = '';
     this.slickgridpopoverservice.appendComponentToElement_View('cs-dropdown-' + this.layoutId, cspfmWebPopoverAction, {
       currrentEvent:event.currentTarget,
       actionConfigJson: this.layoutActionJson,
       dataObject: this.dataObjectData,
       LayoutId: this.layoutId,
       setElementId: this.elementId,
       styleData: this.styleNumber
     })
   }
 }
 