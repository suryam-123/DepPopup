/* 
 *   File: cspfmSlickgridPopover.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit } from '@angular/core';
import { Column } from 'angular-slickgrid';
import { FieldInfo } from 'src/core/pipes/cspfm_data_display';
declare const $: any;
declare const window: any;

@Component({
  selector: 'cspfm-slickgrid-popover',
  templateUrl: './cspfmSlickgridPopover.html',
  styleUrls: ['./cspfmSlickgridPopover.scss'],
})
export class cspfmSlickgridPopover implements OnInit {

  parent: any; // parent component context
  row: number;
  dataContext: any;
  dropdownId = 'myDrop';
  dropDownToggleId = 'toggleDrop';
  info: any


  columnDef: Column;
  slickgridRowIdentificationValues;
  popoverClose;
  defaultOptionValue;
  previousStatus;
  selectedItems
  fieldId
  label
  fieldType
  objectId
  swList
  dbservice
  fieldName
  dripDownAttribute;
  cspfmEditorType = '';
  public moreActionInfo = {}
  public layoutId;
  public bulkWorkFlowInfo = {}
  constructor() {

  }
  actionType = ''
  ngOnInit() {

    if (this.columnDef['params']['cspfmEditorType']) {
      this.cspfmEditorType = this.columnDef['params']['cspfmEditorType'];
    } else if (this.info && this.info['actionType'] && this.info['actionType'] === 'ASSOCIATION') {
      this.dripDownAttribute = '#cs-dropdown-' + this.info['layoutId'];
      window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
    } else if (this.columnDef['params']['fieldInfo']) {
      let getFieldInfo = (fieldInfo: FieldInfo | '') => {
        if (fieldInfo['fieldType'] === 'LOOKUP' ||
          fieldInfo['fieldType'] === 'MASTERDETAIL' ||
          fieldInfo['fieldType'] === 'HEADER') {
          return getFieldInfo(fieldInfo['child']);
        } else {
          return fieldInfo;
        }
      }
      let fieldInfo = getFieldInfo(this.columnDef['params']['fieldInfo'])
      let getValue = (data, fieldInfo: FieldInfo | '') => {
        if (data[fieldInfo['fieldName']] && data[fieldInfo['fieldName']] !== '' && fieldInfo['child']) {
          if (fieldInfo['fieldType'] === 'MASTERDETAIL') {
            return getValue(data[fieldInfo['fieldName']][0], fieldInfo['child'])
          }else {
            return getValue(data[fieldInfo['fieldName']], fieldInfo['child'])
          }
       } else {
         return data[fieldInfo['fieldName']]
       }
      }
      let fieldValue = getValue(this.dataContext, this.columnDef['params']['fieldInfo']);
      let value = fieldValue;
      let objectConfig = fieldInfo['statusWorkflow']['objectConfig']
      this.objectId = fieldInfo['statusWorkflow']['objectId']
      this.fieldName = fieldInfo['statusWorkflow']['fieldName']
      this.fieldId = objectConfig[this.objectId]['workflow'][this.fieldName]['fieldId'];
      this.swList = objectConfig[this.objectId]['workflow'][this.fieldName]['configJson'];
      this.fieldType = fieldInfo['fieldType']
      this.label = fieldInfo['statusWorkflow']['label']
      this.dbservice = this.columnDef['params']['dbserviceprovider']
      this.defaultOptionValue = this.swList[value].filter(item => {
        return item['statusValue'] === value
      })[0]['statusValue']
      this.previousStatus = this.swList[value].filter(item => {
        return item['statusValue'] === value
      })[0]
      this.selectedItems = this.swList[value];
      this.actionType =  this.columnDef['params']['actionType']
    }else if(this.info && this.info['actionType'] && this.info['actionType'] === 'WORK FLOW') {
      this.bulkWorkFlowInfo = this.info
      this.layoutId = this.info['layoutId'];
    }else if (this.info && this.info['type'] && this.info['type'] === 'MORE_ACTION') {
      this.moreActionInfo = this.info['moreActionInfo']
      this.layoutId = this.info['layoutId'];
    }
  }

  popoverStatusChanged(event) {
    if (this.columnDef['params']['popoverStatusChanged']) {
      event['columnDef'] = this.columnDef;
      this.columnDef['params']['popoverStatusChanged'](event)
      if (this.popoverClose) {
        this.popoverClose();
      }
    }
  }

  lookupSelected(event){
    if (this.columnDef['params']['lookupSelected']) {
      event['columnDef'] = this.columnDef;
      event['dataContext'] = this.dataContext;
      this.columnDef['params']['lookupSelected'](event)
      if (this.popoverClose) {
        this.popoverClose();
      }
    }
  }

  moreActionSelected(event) {
    if (this.columnDef['params']['moreActionSelected']) {
      event['columnDef'] = this.columnDef;
      event['dataContext'] = this.dataContext;
      this.columnDef['params']['moreActionSelected'](event)
      if (this.popoverClose) {
        this.popoverClose();
      }
    }
  }
}

