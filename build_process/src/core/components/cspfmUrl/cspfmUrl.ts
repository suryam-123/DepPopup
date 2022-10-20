/* 
 *   File: cspfmUrl.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { cspfmUrlPopover } from '../cspfmUrlPopover/cspfmUrlPopover';
import { SlickgridPopoverService } from '../../services/slickgridPopover.service';
import { Subscription } from 'rxjs';
import { cspfm_data_display } from 'src/core/pipes/cspfm_data_display';
import { appUtility } from '../../utils/appUtility';
import { MatMenuTrigger } from '@angular/material/menu';
declare const $: any;
declare const window: any;

@Component({
  selector: 'cspfmUrl',
  templateUrl: './cspfmUrl.html',
  styleUrls: ['./cspfmUrl.scss'],
})
export class cspfmUrl implements OnInit, OnDestroy {
  
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  inputPageName: string;
  dripDownAttribute: any;
  dialogSubscription: Subscription;
  urlArray: any[];
  urlData: any;
  isInvalid: boolean;
  hoverIndex = -1;
  primaryChipInfo: any = [];
  secondaryChipInfo: any = [];
  isDataPopoverEnabled = false;
  fieldId = '';
  actionId = '';
  args = '';
  errorMessage = '';

  @Input() set inputPage(label: string) {
    this.inputPageName = label;
  }
  @Input() formFieldId: string;
  @Input() id: string;
  @Input() fieldName: string;
  @Input() dataObjectPath: string;
  @Input() isMultipleUrlField: string;
  @Input() cloneConfig: any;
  @Input() isCloned:boolean;   
  @Input() dataCloningInfo: Array<any>;
  @Input() label: string;
  @Input() set data(value: any) {
    this.urlData = value || '';
    this.updateUrlArray();
   
  }
  @Input() isRequired: any;
  @Input() fieldData: any;
  @Input() layoutId: any;
  @Input() set isInvalidField(value: boolean) {
    this.isInvalid = value || false;
  }
  @Input() ngClassValue: string;
  @Input() tableName: string;
  @Input() layoutName: string;
  @Output() onCSPFMUrlChanged: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog, public slickgridpopoverservice: SlickgridPopoverService, private cspfm_data_display: cspfm_data_display, private translateService: TranslateService, public appUtilityConfig: appUtility) {
    this.dialogSubscription = this.slickgridpopoverservice._getChangedValue.subscribe(value => {
      if (value['from'] === '' && (this.inputPageName === 'entry' || this.inputPageName === 'lookup_readonly') && value['fieldName'] === this.fieldName && value['dataObjectPath'] === this.dataObjectPath) {
        this.passUrlValueToLayout(value);
      }
    });
  }
  ngOnInit() {
    this.dripDownAttribute = '#cs-dropdown-' + this.layoutId;
    if(this.label) {
    this.translateService.get(this.label).subscribe(res => {
      this.errorMessage = 'Please enter valid ' + res;
    })
  }
  this.fieldId = 'FLD_' + this.layoutName + '$$' + this.dataObjectPath + '$$' + this.fieldName + '_input_';
    this.actionId = 'ACT_' + this.layoutName + '$$' + this.dataObjectPath + '$$' + this.fieldName + '_input_';

  }
  ngOnDestroy() {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
  showEntryPopup() {
    let paramData = [{
      displayValue: '',
      urlValue: ''
    }];
    let inputType = (this.urlData.length === 0) ? 'entry' : 'add-entry';
    this.openSlickGridPopoverService(paramData, inputType, this.urlArray.length);
  }
  getTextToDisplay(data) {
    data = data || '';
    // while saving the record, data comes as empty array 
    if (Array.isArray(data)) {
      data = (data.length === 0) ? '' : data
    }
    let text, url, type;
    data = this.appUtilityConfig.isValidJson(data);
    text = url = data;
    if (typeof data === 'object') {
      type = data['urlType'];
      data = data['urlDBValue'];
      if (type === 'single') {
        text = ((data.displayValue || '') === '') ? data.urlValue : data.displayValue;
        url = data.urlValue;
      } else if (type === 'multiple') {
        text = data.map(a => a.displayValue);
        url = data.map(a => a.urlValue);
        text = text.toString();
        url = url.toString();
      }
    }
    return {
      display: text,
      url: url
    };
  }
  ngAfterViewInit() {
    this.updateUrlArray();
  }
  updateUrlArray() {
    if (this.inputPageName !== 'slickgrid-view') {
      let value;
      if (this.inputPageName === 'entry' || this.inputPageName === 'lookup_readonly') {
        value = this.getTextToDisplay(this.urlData);
      }
      if (this.inputPageName === 'view') {
        value = this.cspfm_data_display.transform(this.urlData, this.fieldData);
      }
      const displayTempArray = (value.display || '').split(',');
      const urlTempArray = (value.url || '').split(',');
      this.urlArray = [];
      let index: number = 0;
      while (index < urlTempArray.length) {
        if (urlTempArray[index]) {
          this.urlArray.push({
            displayValue: displayTempArray[index],
            urlValue: (urlTempArray[index]).trim()
          });
        }
        index++;
      }
      this.displayRecordsInChipStyle();
    }
  }
  openSlickGridPopoverService(paramData, inputType = '', index = 0) {
    let htmlElement: HTMLElement = document.getElementById('cs-dropdown-'+this.layoutId);
    htmlElement.innerHTML = '';

    this.slickgridpopoverservice.appendComponentToElement_View('cs-dropdown-' + this.layoutId , cspfmUrlPopover, {
      isMultipleUrlField: this.isMultipleUrlField,
      fieldName: this.fieldName,
      inputType: inputType,
      selectedRecordIndex: index,
      label: this.label,
      fieldId: this.fieldId,
      actionId: this.actionId,
      urlArray: paramData,
      dataObjectPath: this.dataObjectPath
     })
  }
  editRecord(index, isSecondaryChip, event): void {
    let selectedRecord = [];
    index = isSecondaryChip ? this.primaryChipInfo.length + index : index;
    selectedRecord.push({
      ...this.urlArray[index]
    });
    this.openSlickGridPopoverService(selectedRecord, 'edit', index);
    this.menuTrigger.closeMenu();
    if(this.isMultipleUrlField){
      $(document).find('#' + this.formFieldId).find('.cs-recordassociation-addbtn').trigger('click')
    }else{
      $(document).find('#' + this.formFieldId).find('#url-label').trigger('click')

    } 
  }
  removeRecord(index, isSecondaryChip): void {
    index = isSecondaryChip ? this.primaryChipInfo.length + index : index;
    if (this.urlArray.length) {
      this.urlArray.splice(index, 1);
    }
    this.hoverIndex = -1;
    this.displayRecordsInChipStyle();
    if (this['info']) {
      this.slickgridpopoverservice._getChangedValue.next({
        fieldName: this.fieldName,
        inputType: 'delete',
        selectedRecordIndex: index,
        args: this.args,
        from: 'slickgrid',
        isMultipleUrlField: this.isMultipleUrlField,
        dbData: this.urlArray,
        dataObjectPath: this.dataObjectPath
      });
    } else {
      this.passUrlValueToLayout({
        'dbData': this.urlArray,
        'inputType': 'delete'
      });
    }
  }
  displayRecordsInChipStyle() {
    setTimeout(() => {
      if (this.inputPageName === 'entry' || this.inputPageName === 'view' || this.inputPageName === 'lookup_readonly') {
        let extraPaddingWidth = 50
        let moreButtonWidth = 35
        if (document.getElementById('urlData_'+this.inputPageName)) {
          let fieldWidth = document.getElementById('urlData_'+this.inputPageName).offsetWidth;
          let valueWidth = 0 + moreButtonWidth;
          this.primaryChipInfo = [], this.secondaryChipInfo = [];
          (this.urlArray).forEach((element, index) => {
            let selectedFieldLength = element['displayValue'].length;
            valueWidth = valueWidth + (selectedFieldLength * 8) + extraPaddingWidth
            if (valueWidth < fieldWidth || index === 0) {
              this.primaryChipInfo.push(element);
            } else {
              this.secondaryChipInfo.push(element);
            }
          });
        }
      }
    }, 750);
  }
  passUrlValueToLayout(value) {
    let urlDBValue = value['dbData'];
    let dbData = null;
    if (value['inputType'] === 'edit') {
      urlDBValue = this.urlArray;
      urlDBValue[value['selectedRecordIndex']] = value['dbData'][0];
      if (!this.isMultipleUrlField) {
        urlDBValue = value['dbData'];
      }
    } else if (value['inputType'] === 'add-entry') {
      urlDBValue = this.urlArray;
      urlDBValue.push(...value['dbData']);
      if (!this.isMultipleUrlField) {
        urlDBValue = value['dbData'];
      }
    }
    dbData = {
      urlType: this.isMultipleUrlField ? 'multiple' : 'single',
      urlDBValue: urlDBValue
    }
    dbData = JSON.stringify(dbData);
    if (urlDBValue.length === 0) {
      dbData = null
    }
    this.onCSPFMUrlChanged.emit({
      dataObjectPath: this.dataObjectPath,
      fieldName: this.fieldName,
      label: this.label,
      inputType: 'list',
      tableName: this.tableName,
      dbData: dbData,
      fieldType: this.inputPageName
    });
  }
  labelAction() {
    let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
    if (htmlElement && htmlElement.innerHTML) {
      htmlElement.innerHTML = "";
    }
  }

  zIndexRaised(e) {
    let matChipContent = document.getElementsByClassName('cs-urlMoreView')[0];
    while (!matChipContent.classList.contains('cdk-overlay-container')) {
      matChipContent = matChipContent.parentElement;
    }
    matChipContent.classList.add('cs-userassign-overlay');
    e.stopPropagation();
  }
  
}
