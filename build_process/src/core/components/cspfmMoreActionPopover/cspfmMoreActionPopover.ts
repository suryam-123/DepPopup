/* 
 *   File: cspfmMoreActionPopover.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { appUtility } from 'src/core/utils/appUtility';
declare const $: any;
declare const window: any;

@Component({
  selector: 'cspfmMoreActionPopover',
  templateUrl: './cspfmMoreActionPopover.html',
  styleUrls: ['./cspfmMoreActionPopover.scss']
})
export class cspfmMoreActionPopover{

  public moreActionItems = [];
  public selectedItem;
  public actionItem;
  public isGoAndSelectActionEnabled = true;
  public actionDisplayType;
  public moreActionDisplayType = '';
  public tempIcon = '';
  public tempValue = '';
  public layoutId = '';
  public dripDownAttribute = '';
  public elementId = '';
  public moreActionInfo = '';
  public isPageHeader = true;
  public selectAndGoValue ='Go';

  @Output() moreActionSelected: EventEmitter<any> = new EventEmitter();
  constructor(public dialog: MatDialog,private appUtility:appUtility) { }


  selectGoDropdownClose() {
    $('.cs-dropdown').removeClass('dontCloseInGloablClick cs-fabDropDown');
    window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown']);
    $('.cs-dropdown').empty();
  }
  

  selectOptionWithIcon(e) {
    this.tempIcon = e['value']['actionIcon'];
    this.tempValue = e['value']['actionLabel'];
    this.actionItem = e['value'];
  }

  @Input() set setElementId(elementId) {
    this.elementId = elementId;
  }

  @Input() set setLayoutId(layoutId) {
    this.layoutId = layoutId;
    this.dripDownAttribute = '#cs-dropdown-' + this.layoutId;
  }
  
  @Input() set setMoreActionInfo(info) {
    if (!info && info === undefined && info === null && info === '') {
      this.appUtility.showAlert(this,'No data found');
      return;
    }

    this.moreActionInfo = info;

    this.moreActionDisplayType = this.moreActionInfo['moreActionDisplayType'];

    if (this.moreActionInfo['isGoAndSelectActionEnabled'] === 'Y') {
      this.selectAndGoValue = this.moreActionInfo['selectAndGoValue'];
      this.isGoAndSelectActionEnabled = true;
    } else {
      this.isGoAndSelectActionEnabled = false;
    }

    this.moreActionItems = this.moreActionInfo['moreActionItems'];

    if (this.moreActionDisplayType === 'fabOption') {
      setTimeout(() => {
        $(document).find('.cs-fab-view-dd').removeClass('cs-fab-view-dd')
        if (this.elementId !== "0") {
          $(document).find('.cs-fab-button-group-slick').addClass('cs-fab-view-dd');
        }

        $(document).find('.cs-fab-list').css({ 'height': (this.moreActionItems.length * 38) });
        $('.cs-fab-list').addClass('fabanimation');
        window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
      }, 150)

      setTimeout(() => {
        window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
      }, 100);
    }    
  }
  //Implement More Action
  itemClick(actionItem,event) {
    if (this.isGoAndSelectActionEnabled) {
      this.actionItem = actionItem;
      return;
    }
    this.moreActionSelected.emit({ 'dataContext': this.selectedItem, 'actionInfo': actionItem });
    event.stopPropagation();
    this.selectGoDropdownClose();
  }

  goAction(event) {
    this.moreActionSelected.emit({ 'dataContext': this.selectedItem, 'actionInfo': this.actionItem });
    event.stopPropagation();
    this.selectGoDropdownClose();
  }

  fabItemClickAction(actionItem,event) {
    this.moreActionSelected.emit({ 'dataContext': this.selectedItem, 'actionInfo': actionItem });
    event.stopPropagation();
    this.selectGoDropdownClose();
  }
}
