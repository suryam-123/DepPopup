/* 
 *   File: cspfmCustomAction.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MdePopoverTrigger } from '@material-extended/mde';
import { cspfmCustomActionUtils } from 'src/core/dynapageutils/cspfmCustomActionUtils';
import _lodash from 'lodash';

@Component({
  selector: 'cspfmCustomAction',
  templateUrl: './cspfmCustomAction.html',
})
export class cspfmCustomAction implements OnInit, OnChanges {

  @ViewChild(MdePopoverTrigger, {}) customActionPopoverTrigger: MdePopoverTrigger;
  isVisible = false;
  isProcessInitiated = false;
  customActionInprogresInfo = {};
  customActionStatus = '';
  public lodash = _lodash;
  @Input() style: string;
  @Input() visiblity: boolean;
  @Input() actionConfig: any;
  @Input() actionStatus: string;
  @Input() labelValue: string;
  @Input() parentContext: any;
  @Input() inititeFunctionName: string;
  @Input() buttonId: string;
  
  constructor(public customActionUtils: cspfmCustomActionUtils) {}

  ngOnInit() {
    this.customActionUtils.isCustomActionInitiated.subscribe(infoValue => {
      if (infoValue['actionId'] === this.actionConfig['actionId']) {
        this.isProcessInitiated = infoValue['isProcessInitiated'];
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visiblity']) {
      this.isVisible = this.visiblity === false ? false : true;
    }
    if (changes['actionStatus']) {
      this.customActionInprogresInfo = this.actionConfig['customActionInprogresInfo'];
      this.customActionStatus = this.actionStatus || '';
      if (this.customActionStatus && this.actionConfig['menuVisible'] === true) {
        this.customActionPopoverTrigger.openPopover();
      }
      if (this.actionConfig['menuVisible'] === false) {
        this.customActionPopoverTrigger.closePopover();
      }
    }
  }

  async initiateCustomAction() {
    this.customActionPopoverTrigger.closePopover();
    for (const actionConfiguration of Object.values(this.parentContext.customActionConfiguration || {})) {
      actionConfiguration['menuVisible'] = false;
    }
    if (this.inititeFunctionName) {
      this.parentContext[this.inititeFunctionName]();
    }
  }

  popoverClosed() {
    this.customActionStatus = '';
  }
}