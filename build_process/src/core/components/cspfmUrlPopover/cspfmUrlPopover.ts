

/* 
 *   File: cspfmUrlPopover.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SlickgridPopoverService } from '../../services/slickgridPopover.service';
import { appUtility } from "src/core/utils/appUtility";
declare const $: any;
declare const window: any;

@Component({
  selector: 'cspfmUrlPopover',
  templateUrl: './cspfmUrlPopover.html',
  styleUrls: ['./cspfmUrlPopover.scss'],
})
export class cspfmUrlPopover implements OnInit {

  errorMessage: any = [];
  fieldDetails: any;
  hoverIndex = -1;
  enableButton = false;
  args: any = '';
  descriptionEnabled = true;
  previousInputType = '';
  enableCloseButton = false;
  dropdownId = 'myDrop';
  dripDownAttribute = '';
  layoutId = '';
  flexLayoutValue='50%';

  @Input() isMultipleUrlField: boolean;
  @Input() fieldName: string;
  @Input() label: string;
  @Input() inputType: string;
  @Input() selectedRecordIndex = 0;
  @Input() urlArray: any;
  @Input() fieldId: any;
  @Input() actionId: any;
  @Input() isTooltipVisible: boolean;
  @Input() dataObjectPath: string;

  constructor(public dialogRef: MatDialogRef<cspfmUrlPopover>, private slickgridpopoverservice: SlickgridPopoverService,public appUtilityConfig: appUtility) { }
  ngOnInit() {
    this.dripDownAttribute = '#cs-dropdown-' + this.layoutId;
    if (this['info'] && this['info']['cspfmObjectName']) {
      this.fieldName = this['columnDef']['params']['fieldInfo']['fieldName'];
      this.inputType = this['info']['inputType'];
      this.isMultipleUrlField = this['info']['isMultipleUrlField'];
      this.label = this['columnDef']['params']['fieldInfo']['label'];
      this.urlArray = this['info']['urlArray'];
      this.fieldId = this['info']['fieldId'];
      this.actionId = this['info']['actionId'];
      this.args = this['info']['args'];
      this.selectedRecordIndex = this['info']['selectedRecordIndex'];
      this.isTooltipVisible = (this['info']['isTooltipVisible'] === false) ? false : true;
      this.dataObjectPath = this['info']['dataObjectPath'];
    }
    this.isTooltipVisible = (this.isTooltipVisible === false) ? false : true;
    this.urlArray = this.urlArray || [];
    this.fieldDetails = JSON.parse(JSON.stringify(this.urlArray));
    for (let index = 0; index < this.fieldDetails.length; index++) {
      Object.keys(this.fieldDetails[index]).forEach(key => {
        const value = this.fieldDetails[index][key];
        this.fieldDetails[index][key] = {
          value: value,
          isEditable: false,
          errorMessage: ''
        }
      });
    }
    
    setTimeout(() => {
      window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
    }, 100);
  }
  addUrlRow(): void {
    const invalidArrayLen = this.checkOtherFieldIsEditable();
    if (invalidArrayLen > 0) {
      return;
    }
    let invalidArray = this.urlArray.filter(value => {
      return (((value.displayValue || '') === '') || ((value.urlValue || '') === ''))
    })
    if (invalidArray.length) {
      const invalidArrayIndex = this.urlArray.indexOf(invalidArray[0]);
      Object.keys(this.fieldDetails[invalidArrayIndex]).forEach(key => {
        this.fieldDetails[invalidArrayIndex][key]['errorMessage'] = this.urlArray[invalidArrayIndex][key] ? '' : 'Please fill this field';
      });
      return;
    }
    
    this.urlArray.push({
      displayValue: '',
      urlValue: ''
    })
    this.fieldDetails.push({
      displayValue: { isEditable: true, errorMessage: '' },
      urlValue: { isEditable: true, errorMessage: '' },
    })
    this.flexLayoutValue='46%';
    setTimeout(()=>{
      window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
    },1000);
  }
  removeRecord(event: Event, index: number): void {
    if (this.urlArray.length > 1 || this.inputType === 'view') {
      let data = [{...this.urlArray[index]}];
      this.urlArray.splice(index, 1);
      this.fieldDetails.splice(index, 1);
      if (this['info'] && this.inputType !=='add-entry') {
        this.slickgridpopoverservice._getChangedValue.next({
          fieldName: this.fieldName,
          inputType: 'delete',
          selectedRecordIndex: index,
          args: this.args,
          from: 'slickgrid',
          isMultipleUrlField: this.isMultipleUrlField,
          dbData: data,
          dataObjectPath: this.dataObjectPath
        });   
      } 
      // else if (this.inputType !=='add-entry') {
      //   this.initiateSubscription();
      // }
      this.flexLayoutValue=this.urlArray.length===1 ? '50%' :'46%'
      event.stopPropagation();
      this.closePopover(this.urlArray.length === 0);
    }
  }
  editRecord(index: number, isEditIconClicked, event): void {
    const invalidArrayLen = this.checkOtherFieldIsEditable();
    // while click 'done' button editable fields are not exceed more than one
    if (invalidArrayLen > (isEditIconClicked ? 0 : 1)){
      return;
    }

    Object.keys(this.fieldDetails[index]).forEach(key => {
      this.fieldDetails[index][key]['isEditable'] = isEditIconClicked;
      this.fieldDetails[index][key]['errorMessage'] = (isEditIconClicked === false) ? '' : this.fieldDetails[index][key]['errorMessage']
    });
    if (isEditIconClicked === false) {
      this.onOkClick('edit', index);
    }
    if (this['info'] && this.inputType === 'view') {
      this.enableButton = true;
      this.hoverIndex = -1;
      this.previousInputType = this.inputType;
      this.inputType = 'slickgrid-popover-edit';
      event.stopPropagation();
      setTimeout(()=>{
        window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
      },100)
    }
  }

  isValidURLCheck(url) {
    if (url === '') {
      return true;
    }
    var regex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return regex.test(url);
  }

  getURLBaseErrorMessage(url) {
    var message = '';

    if (url === '') {
      message = 'Please enter URL';
    } else if (!this.isValidURLCheck(url)) {
      message = 'Please enter valid URL';
    }

    return message;
  }

  onOkClick(pageType, index: number = 0, event?): void {
    let isInvalid = false, invalidArray = [];
    if (pageType === 'new-entry') {
        invalidArray = this.urlArray.filter(value => {
          return (((value.displayValue || '') === '') || ((value.urlValue || '') === '') || ((this.isValidURLCheck(value.urlValue) || false) === false))
        });
        isInvalid = invalidArray.length ? true : false;
    } else if (pageType === 'edit') {
        isInvalid = (((this.urlArray[index].displayValue || '') === '') || ((this.urlArray[index].urlValue || '') === ''))
      if (!isInvalid) {
        isInvalid = (((this.urlArray[index].displayValue || '') === '') || 
        ((this.urlArray[index].urlValue || '') === ''))
      }
    }

    if (isInvalid) {
      let errorMessage = {}, invalidArrayIndexes = '';
      if (pageType === 'new-entry' && invalidArray.length) {
        for (let tempIndex = 0; tempIndex < invalidArray.length; tempIndex++) {
          invalidArrayIndexes += this.urlArray.indexOf(invalidArray[tempIndex]) + ',';
        }
        invalidArrayIndexes = invalidArrayIndexes.substring(0, invalidArrayIndexes.length - 1);
      }
      if (pageType === 'edit' || pageType === 'new-entry') {
        let indexArray = invalidArrayIndexes.split(',');
        for(let tempIndex of indexArray) {
          errorMessage['displayValue'] = (this.urlArray[tempIndex]['displayValue'] === '') ? 'Please enter display name' : '';
          errorMessage['urlValue'] = this.getURLBaseErrorMessage(this.urlArray[tempIndex]['urlValue']);
          Object.keys(this.fieldDetails[tempIndex]).forEach(key => {
            const value = this.fieldDetails[tempIndex][key];
            this.fieldDetails[tempIndex][key] = {
              value: value,
              isEditable: true,
              errorMessage: errorMessage[key]
            }
          });
        }
      }
      return
    }
    if (this.inputType === 'slickgrid-popover-edit') {
      this.inputType = this.previousInputType;
      this.previousInputType = 'slickgrid-popover-edit';
      this.enableButton = false;
      event.stopPropagation();
    }
    this.initiateSubscription();
    this.closePopover(pageType === 'new-entry');
  }
  get getPopoverStyles() {
    return {
      'width': '400px',
      'max-height': '300px',
      'padding': '15px'
    };
  }
  checkOtherFieldIsEditable() {
    let length = 0;
    for (let index = 0; index < this.fieldDetails.length; index++) {
      if (this.fieldDetails[index]['displayValue']['isEditable'] === true) {
        Object.keys(this.fieldDetails[index]).forEach(key => {
          this.fieldDetails[index][key]['errorMessage'] = this.urlArray[index][key] ? '' : 'Please fill this field';
          if (this.fieldDetails[index][key]['errorMessage']){
            length++;
          }
        });
      }
    }
    return length;
  }
  initiateSubscription() {
    let data: any = this.isMultipleUrlField ? (this.urlArray || []) : ({
      displayValue: (this.urlArray[0].displayValue || '') === '' ? this.urlArray[0].urlValue : this.urlArray[0].displayValue,
      urlValue: this.urlArray[0].urlValue
    } || {});
    let editedObjIndex = 0;
    let inputType=this.inputType;
    if (this['info'] && this.inputType === 'view') {
      editedObjIndex = this.fieldDetails.findIndex(value => {
        return (value['displayValue'] && value['displayValue']['isEditable'] && value['displayValue']['isEditable'] === true)
      });
      editedObjIndex = editedObjIndex === -1 ? 0 : editedObjIndex;
      Object.keys(this.fieldDetails[editedObjIndex]).forEach(key => {
        this.fieldDetails[editedObjIndex][key]['isEditable'] = false;
      });
      data = [{...data[editedObjIndex]}];
      this.selectedRecordIndex = Number(this.selectedRecordIndex) + editedObjIndex;
      inputType='edit';
    }
    let isValidURL = true;
     for (let index = 0; index < data.length; index++) {
       let result = this.isValidURLCheck(data[index]['urlValue'])
       if (!result) {
         isValidURL = false;
         break;
       }
     }
    
    if (isValidURL) {
    this.slickgridpopoverservice._getChangedValue.next({
      fieldName: this.fieldName,
      inputType: inputType,
      selectedRecordIndex: this.selectedRecordIndex,
      args: this.args,
      from: this['info'] ? 'slickgrid' : '',
      isMultipleUrlField: this.isMultipleUrlField,
      dbData: data,
      dataObjectPath: this.dataObjectPath
    });
  }
  }
  closePopover(condition: boolean) {
    if (this.previousInputType !== 'slickgrid-popover-edit') {
      if (this['info'] && this.inputType !=='add-entry') {
        window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown']);
      } else if (condition) {
        $(document).find('.dontCloseInGloablClick').removeClass('dontCloseInGloablClick')
        window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown']);
      }
      if (this.enableCloseButton) {
        let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
        if (htmlElement && htmlElement.innerHTML) {
          htmlElement.innerHTML = '';
        }
      }
    }
  }
  fieldChange(index) {
    if (this.urlArray[index].displayValue) {
      this.fieldDetails[index]['displayValue']['errorMessage'] = '';
    }
    if (this.urlArray[index].urlValue) {
      this.fieldDetails[index]['urlValue']['errorMessage'] = '';
    }
  }
}
