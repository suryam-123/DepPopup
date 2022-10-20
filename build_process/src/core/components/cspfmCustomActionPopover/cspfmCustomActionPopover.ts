/* 
 *   File: cspfmCustomActionPopover.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MdePopoverTrigger } from '@material-extended/mde';
import _lodash from 'lodash';
declare var $: any;
declare const window: any;

@Component({
  selector: 'cspfmCustomActionPopover',
  templateUrl: './cspfmCustomActionPopover.html',
})
export class cspfmCustomActionPopover implements OnInit {

  @ViewChild(MdePopoverTrigger, {}) customActionPopoverTrigger: MdePopoverTrigger;
  isVisible = false;
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
  
  constructor() {}

  ngOnInit() {
    if(this['info']){
      this.actionConfig = this['info'];
      this.actionStatus = this['info']['actionStatus']
      this.customActionInprogresInfo = this.actionConfig['customActionInprogresInfo'];

        this.customActionStatus = this.actionStatus || '';
        if (this.customActionStatus && this.actionConfig['menuVisible'] === true) {
          // this.customActionPopoverTrigger.openPopover();
          window.$(".cs-clicked-inp-dropdown").jqDropdown("show", [".cs-dropdown"]);
        }
        if (this.actionConfig['menuVisible'] === false) {
          // this.customActionPopoverTrigger.closePopover();
            $(document).find('.cs-clicked-inp-dropdown').removeAttr('data-cs-dropdown')
            $('.cs-clicked-inp-dropdown').removeClass('cs-clicked-inp-dropdown')
            window.$(".cs-clicked-inp-dropdown").jqDropdown("hide", [".cs-dropdown"]);
            window.$(".cs-clicked-inp-dropdown").jqDropdown("detach", [".cs-dropdown"]);
            $('.cs-dropdown-open').removeClass('cs-dropdown-open')
            $('.cs-dropdown').empty();
        }
    }
  }

 
}