/* 
 *   File: cspfmMoreAction.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
declare var $: any;
declare const window: any;
import { SlickgridPopoverService } from "../../services/slickgridPopover.service";
import { cspfmMoreActionPopover } from '../cspfmMoreActionPopover/cspfmMoreActionPopover';
import { appUtility } from 'src/core/utils/appUtility';

@Component({
  selector: 'cspfmMoreAction',
  templateUrl: './cspfmMoreAction.html',
  styleUrls: ['./cspfmMoreAction.scss']
})

export class cspfmMoreAction implements OnInit{

  public moreActionItems = [];
  public selectedItem;
  public actionItem;
  public isGoAndSelectActionEnabled = true;
  public actionDisplayType;
  public moreActionDisplayType = '';
  public tempIcon = '';
  public tempValue = '';
  public layoutId = '';
  public dripDownAttribute='';
  public elementId = '';
  public moreActionInfo = '';
  public isPageHeader = true;

  public isMoreActionPopupShow = false;
  public isFabOptionPopupShow = false;
  public isInlineTypeEnable = false;
  public fabOptionEnable = false;

  public labelElementId='';
  public buttonElementId='';
  public iconElementId = '';
  public iconStyle;
  public buttonStyle;
  public labelStyle;
  @Output() moreActionSelected: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog,private readonly slickgridpopoverservice: SlickgridPopoverService,private appUtility:appUtility) { }

  selectGoDropdownClose() {
    $('.cs-dropdown').removeClass('dontCloseInGloablClick cs-fabDropDown')
    window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown']);
    $('.cs-dropdown').empty();
  }

  fabClickCloseMatMenu(menuCLose){
    menuCLose.closeMenu();
  }

  selectOptionWithIcon(e) {
    this.tempIcon = e['value']['actionIcon'];
    this.tempValue = e['value']['actionLabel'];
    this.actionItem = e['value'];
  }

  fabClickMatMenu(event, len){
    this.isMoreActionPopupShow = false;
    this.isFabOptionPopupShow = !this.isFabOptionPopupShow;

    $(document).find('.mat-menu-content').css({'height':(this.moreActionItems.length * 38) + 15});
    $(document).find('.fabanimation').removeClass('fabanimation');
    setTimeout(()=>{
      $(document).find('cs-fab-list').addClass('fabanimation');
    },300)

    let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
    if (htmlElement && htmlElement.innerHTML && htmlElement.innerHTML != null) {
      htmlElement.innerHTML = '';
    }
    

    window.$('.cs-d-open-temp').jqDropdown('show', ['.cs-dropdown']);
    this.slickgridpopoverservice.appendComponentToElement_View('cs-dropdown-' + this.layoutId,cspfmMoreActionPopover,{
      setElementId:this.elementId,
      setMoreActionInfo:this.moreActionInfo,
      setLayoutId :this.layoutId,
      moreActionSelected:this.moreActionSelected
    });
  }

  moreActionPopupShow(){
    this.isFabOptionPopupShow = false;
    this.isMoreActionPopupShow = !this.isMoreActionPopupShow;

    let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
    if (htmlElement && htmlElement.innerHTML && htmlElement.innerHTML != null) {
      htmlElement.innerHTML = '';
    }
    


    window.$(".cs-d-open-temp").jqDropdown('show', ['.cs-dropdown']);
    this.slickgridpopoverservice.appendComponentToElement_View('cs-dropdown-' + this.layoutId,cspfmMoreActionPopover,{
      setElementId:this.elementId,
      setMoreActionInfo:this.moreActionInfo,
      setLayoutId :this.layoutId,
      moreActionSelected:this.moreActionSelected
    });

  }

  @Input() set setElementId(elementId) {
    this.elementId = elementId;
    this.iconElementId = elementId+"_icon";
    this.buttonElementId = elementId+"_button";
    this.labelElementId =  elementId+"_label";
  }

  @Input() set setLayoutId(layoutId) {
    this.layoutId = layoutId;
    this.dripDownAttribute = '#cs-dropdown-' + this.layoutId;
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

  @Input() set setMoreActionInfo(info) {
    if (!info && info === undefined && info === null && info === '') {
      this.appUtility.showAlert(this,'No data found');
      return;
    }

    this.moreActionInfo = info[this.elementId];
    if (info[this.elementId]['isPageHeader'] === 'Y') {
      this.isPageHeader = true;
    } else {
      this.isPageHeader = false;
    }

    this.actionDisplayType = info[this.elementId]['actionDisplayType'];
    this.moreActionDisplayType = info[this.elementId]['moreActionDisplayType'];

    if (this.moreActionDisplayType === 'inlineSelect' || this.moreActionDisplayType === 'inlineIconSelect') {
      this.isInlineTypeEnable = true;
    }

    if (this.moreActionDisplayType === 'fabOption') {
      this.fabOptionEnable = true;
    }

    if (info[this.elementId]['isGoAndSelectActionEnabled'] === 'Y') {
      this.isGoAndSelectActionEnabled = true;
    } else {
      this.isGoAndSelectActionEnabled = false;
    }

    this.moreActionItems = info[this.elementId]['moreActionItems'];
  
    

    setTimeout(()=>{
      window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
    },100);

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


  itemClick(actionItem) {
    if (this.isGoAndSelectActionEnabled) {
      this.actionItem = actionItem;
      return;
    }
    this.moreActionSelected.emit({ 'dataContext': this.selectedItem, 'actionInfo': actionItem });
    event.stopPropagation();
  }

  goAction() {
    this.moreActionSelected.emit({ 'dataContext': this.selectedItem, 'actionInfo': this.actionItem });
    event.stopPropagation();
    this.selectGoDropdownClose();
  }

  fabItemClickAction(actionItem){
    this.moreActionSelected.emit({ 'dataContext': this.selectedItem, 'actionInfo': actionItem });
    event.stopPropagation();
  }
}
