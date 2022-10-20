/* 
 *   File: cspfmWebPopoverAction.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input } from '@angular/core';
import { appUtility } from 'src/core/utils/appUtility';
import { cspfmWebActionService } from 'src/core/services/cspfmWebAction.service';
declare const $: any;
declare const window: any;
@Component({
  selector: 'cspfmWebPopoverAction',
  templateUrl: './cspfmWebPopoverAction.html',
  styleUrls: ['./cspfmWebPopoverAction.scss'],
})
export class cspfmWebPopoverAction implements OnInit {


  public actionConfig;
  public dataObjectData = '';
  public viewArea = 'section';
  public dripDownAttribute = '';
  public layoutActionJson = '';
  public layoutId = ''
  public elementId = ''


  constructor(public appUtilObj: appUtility,
    private cspfmWebActionServiceObj: cspfmWebActionService) {
  }
  ngOnInit() {

  }
  @Input() set setElementId(elementId) {
    this.elementId = elementId
  }

  @Input() set actionConfigJson(configJson: string) {
    this.layoutActionJson = (configJson !== undefined && configJson !== null) ? configJson : '';
  }

  public eventGet
  @Input() set currrentEvent(event) {
    this.eventGet = event
  }

  @Input() set dataObject(dataSet: string) {
    this.dataObjectData = (dataSet !== undefined && dataSet !== null) ? dataSet : "";
    setTimeout(()=>{
      if(this.eventGet !== undefined){
        this.eventGet.classList.add('cs-dropdown-open');
      }
      window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
    },100)
  }


  @Input() set setViewArea(viewAreaName) {
    this.viewArea = viewAreaName;
    this.openComposer();
  }
  openComposer() {
    if (this.layoutActionJson['multiSelectListOption'] && (!this.dataObjectData || this.dataObjectData && this.dataObjectData.length === 0)) {
      this.appUtilObj.presentToast("Kindly select the records to proceed")
      return;
    }
    if (this.viewArea && this.viewArea === 'slickgrid' && this.layoutActionJson['mailComposeOptions'].length === 1) {

      let mailComposeOption = this.layoutActionJson['mailComposeOptions'][0];
      let dataSet = this.cspfmWebActionServiceObj.makeMailActionData(this.layoutActionJson, this.dataObjectData);
      if (mailComposeOption === 'Gmail') {
        this.cspfmWebActionServiceObj.callEmailComposer(dataSet)
      }else if (mailComposeOption === 'OutLook') {
        this.cspfmWebActionServiceObj.callOutLookComposer(dataSet)
      }else {
        this.cspfmWebActionServiceObj.callUserDefaultComposer(dataSet)
      }
    }
  }
  @Input() set LayoutId(layoutId) {
    this.layoutId = layoutId
    this.dripDownAttribute = '#cs-dropdown-' + this.layoutId;
  }
  public styleNumber = 1;
  @Input() set styleData(styleno) {
    this.styleNumber = parseInt(styleno);
  }

  handleMailActionClick(composerType) {


    if (this.layoutActionJson['multiSelectListOption'] && (!this.dataObjectData || this.dataObjectData && this.dataObjectData.length === 0)) {
      this.appUtilObj.presentToast('Kindly select the records to proceed')
      return;
    }
    let dataSet = this.cspfmWebActionServiceObj.makeMailActionData(this.layoutActionJson, this.dataObjectData);

    if (composerType === 'Gmail') {
      this.cspfmWebActionServiceObj.callEmailComposer(dataSet)
    }else if (composerType === 'OutLook') {
      this.cspfmWebActionServiceObj.callOutLookComposer(dataSet)
    }else {
      this.cspfmWebActionServiceObj.callUserDefaultComposer(dataSet)
    }

    if (document.getElementById('cs-dropdown-' + this.layoutId)) {
      let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
      htmlElement.innerHTML = '';
    }
  }

}
