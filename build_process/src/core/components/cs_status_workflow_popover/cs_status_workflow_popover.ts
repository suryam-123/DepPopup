/* 
 *   File: cs_status_workflow_popover.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, ApplicationRef, Input, Output, EventEmitter, Inject} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { appUtility } from 'src/core/utils/appUtility';
import { cspfmStatusWorkFlowService } from 'src/core/services/cspfmStatusWorkFlow.service';
import { cspfmExecutionPouchDbConfiguration } from 'src/core/db/cspfmExecutionPouchDbConfiguration';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare const $: any;
declare const window: any;

@Component({
  selector: 'cs-status-workflow-popover',
  templateUrl: './cs_status_workflow_popover.html',
  styleUrls: ['./cs_status_workflow_popover.scss'],
})
export class cs_status_workflow_popover implements OnInit {
 //if u newly added a input add it in construtor
  @Input() displayName;
  @Input() configStyle;
  @Input() entryComments = '';
 
  @Input() objectname = '';
 
  @Input() fieldName = '';
  @Input() popUpType = '';
  @Input() selectedItems;
  @Input() parent;
  @Input() previousStatus;
  @Input() selectedStatus;
  @Input() callingFrom: 'internal' | 'external';
  @Output() popoverStatusChanged: EventEmitter<any> = new EventEmitter();
  @Output() popoverOnSubmit: EventEmitter<any> = new EventEmitter();
  @Input() selectedObject;
  @Input() fieldIdValue;
  @Input() slickgridRowIdentificationValues: Array<string>;
  @Input() dbServiceProvider = '';
  public entryPopUpId;
  public approveRejectComments = '';
  public dynaIdCmt = '';
  public approvRejectPopupId;
  public actionType = '';
  public defaultOptionValue;
  public ispopUploaded;
  public isMultiline;
 
  public processingData = {
    cscomponentactionInfo: {},
    executionInfoDetail: {},
    executionDbConfigObject: {},
    approverType: '',
    selectedStatus: {},
    dbServiceProvider: ''
  };
  isDataFetching = false;

  constructor(public appUtilityConfig: appUtility, private readonly popoverController: PopoverController, public appRef: ApplicationRef,
    private readonly cspfmStatusWorkFlowServiceObject: cspfmStatusWorkFlowService, private readonly executionDbConfigObject: cspfmExecutionPouchDbConfiguration,
    @Inject(MAT_DIALOG_DATA) data, private readonly dialogRef: MatDialogRef<cs_status_workflow_popover>) {
    this.approvRejectPopupId = new Date().getUTCMilliseconds().toString() + 'approvRejectPopupId';
    this.dynaIdCmt = new Date().getUTCMilliseconds().toString() + 'cmt';
    this.entryPopUpId = new Date().getUTCMilliseconds() + "entryPopUpId";
    if (data.hasOwnProperty('displayName')) {
      this.ispopUploaded = true;
      this.displayName = data['displayName'];
      this.configStyle = data['configStyle'];
      this.entryComments = data['entryComments'];
      this.popUpType = data['popUpType'];
      this.selectedItems = data['selectedItems'];
      this.parent = data['parent'];
      this.previousStatus = data['previousStatus'];
      this.selectedStatus = data['selectedStatus'];
      this.callingFrom = data['callingFrom'];
      this.selectedObject = data['selectedObject'];
      this.dbServiceProvider = data['dbServiceProvider'];
      this.fieldName = data['fieldName'];
      this.objectname = data['objectName'];
      this.isMultiline = data['isMultiline'];
    }
  }

  ngOnInit() {
    this.defaultOptionValue = JSON.parse(JSON.stringify(this.selectedStatus))['statusValue'];
    if(this.selectedObject[this.fieldName] &&
      this.selectedObject[this.fieldName]===this.selectedStatus['statusValue']) {
       this.entryComments = '';
      }

      let filteredPreviousStatusValue =[];
      if(this.selectedObject && !this.selectedObject['id']){
        filteredPreviousStatusValue.push(this.previousStatus)
      }else {

        filteredPreviousStatusValue =  this.selectedItems.filter(item => {
          return item['statusValue'].toLowerCase() !==
            this.previousStatus['statusValue'].toLowerCase();
        });
      }
      
      this.selectedItems = this.isMultiline ? this.selectedItems : filteredPreviousStatusValue
      if (this.selectedStatus && this.selectedStatus['statusValue'] !== this.previousStatus['statusValue']) {
        this.defaultOptionValue = JSON.parse(JSON.stringify(this.selectedStatus))['statusValue'];
        if(this.selectedStatus['isCommentValidationNeed']==='Y' && this.selectedStatus['statusType'] !=='Approved' && this.selectedStatus['statusType'] !=='Reject'){
       this.validationNeed = true;
        } 
      }else {
        if(filteredPreviousStatusValue && filteredPreviousStatusValue.length>0) {
          this.defaultOptionValue = JSON.parse(JSON.stringify(filteredPreviousStatusValue[0]))['statusValue']
          if(filteredPreviousStatusValue[0]['isCommentValidationNeed']==='Y' && filteredPreviousStatusValue[0]['statusType'] !=='Approved' && filteredPreviousStatusValue[0]['statusType'] !=='Reject'){
            this.validationNeed = true;
          }
        }
       
      }
 
    let taskList = []; 
    this.isDataFetching = true;
    if (this.callingFrom === 'external') {
      this.processingData['dbServiceProvider'] = this.dbServiceProvider;
      Object.assign(this.processingData, {
        cscomponentactionInfo: {},
        executionInfoDetail: {},
        executionDbConfigObject: this.executionDbConfigObject,
        approverType: '',
        selectedStatus: this.previousStatus
      });
      taskList.push(this.cspfmStatusWorkFlowServiceObject.setExecutionData(this.selectedObject, this.fieldIdValue, this.processingData).then(executionDataResponse => {
        Object.assign(this.processingData, executionDataResponse);
        return this.processingData;
      }));
    }
    if (this.selectedObject['systemAttributes']) {
      taskList.push(this.cspfmStatusWorkFlowServiceObject.fetchLockedUserDetail(this.selectedObject).then(lockedUserDetailResponse => {
        Object.assign(this.processingData, lockedUserDetailResponse)
        this.processingData['lockedUserImg'] = this.appUtilityConfig.getUserImageURL(this.selectedObject['systemAttributes']['lockedBy']);
        return this.processingData;
      }));
    }
    Promise.all(taskList).then(allResponse => {
      this.isDataFetching = false;
      setTimeout(() => {
        window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
      }, 100);
    });
  }
  showCommentViewHideApproveRejectView(actionName) {
    this.actionType = actionName;
    if (this.dynaIdCmt){
      document.getElementById(this.dynaIdCmt).style.display = 'block';
    }
    if (this.approvRejectPopupId){
      document.getElementById(this.approvRejectPopupId).style.display = 'none';
    }

  }
  closePopUp() {
    if (this.callingFrom === 'internal') {
      if (this.ispopUploaded) {
        this.dialogRef.close();
      } else {
        this.popoverController.dismiss();
      }     
    } else {
      this.popoverStatusChanged.emit({
        actionName: 'close',
        selectedObject: this.selectedObject,
        statusWFConfigId: this.selectedStatus['statusWFConfigId'],
        fieldId: this.fieldIdValue
      });
    }
    window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown']);
  }
  approveRejectClickAction(actionName?) {
    if (this.callingFrom === 'internal') {
      this.isCommentsFieldFilled = true;
       if (actionName) {
        var selectedObj = {}
        if (actionName === 'Approve') {
          selectedObj = this.selectedItems.filter(elem => {
            return elem['statusType'].toLowerCase() === 'approved'
          })[0];
        }else {
          selectedObj = this.selectedItems.filter(elem => {
            return elem['statusType'].toLowerCase() === 'reject'
          })[0];
        }

        if (this.entryComments === '' && selectedObj && selectedObj['isCommentValidationNeed'] === 'Y' ) {
          this.validationNeed = true;
          this.isCommentsFieldFilled = false;
          return;
        }
      }
     

      this.closePopUp();
      this.parent.setComments(this.entryComments);
      if (actionName && actionName === 'Approve') {
        this.parent.approveAction(this.previousStatus)
      }else if (actionName && actionName === 'Reject') {
        this.parent.rejectAction(this.previousStatus)
      } else {
        if (this.actionType === 'Approve') {
          this.parent.approveAction(this.previousStatus)
        }
        else if (this.actionType === 'Reject') {
          this.parent.rejectAction(this.previousStatus)
        }

      }
    } else {

     let selectedStatus = '';
      if (actionName && actionName === 'Approve') {
        selectedStatus = this.getApproveRejectStatus('approved');
      }else if (actionName && actionName === 'Reject') {
        selectedStatus = this.getApproveRejectStatus('reject');
      } else {
        if (this.actionType === 'Approve') {
          selectedStatus = this.getApproveRejectStatus('approved');
        }else if (this.actionType === 'Reject') {
          selectedStatus = this.getApproveRejectStatus('reject');
        }
      }
      if (this.entryComments === '' && selectedStatus && selectedStatus['isCommentValidationNeed'] === 'Y') {
        this.validationNeed = true;
        this.isCommentsFieldFilled = false;
        return;
      }
      this.closePopUp();


      this.cspfmStatusWorkFlowServiceObject.setApproveProcessStatus(this.processingData['approverType'], this.processingData['executionInfoDetail'], selectedStatus,this.processingData['approvalType']);
      this.popoverStatusChanged.emit({
        actionName: actionName,
        selectedValue: selectedStatus['statusValue'],
        selectedObject: this.selectedObject,
        statusWFConfigId: this.selectedStatus['statusWFConfigId'],
        fieldId: this.fieldIdValue,
        selectedStatus: selectedStatus,
        workFlowUserApprovalStatusDataObject: this.processingData['WorkFlowUserApprovalStatusDataObject'],
        comments:this.entryComments
      });
    }
  }

 getApproveRejectStatus(approvalStatus: 'approved' | 'reject') {
    let selectedStatus = this.selectedItems.filter(item => {
      return item['statusType'].toLowerCase() === approvalStatus &&
        this.previousStatus['statusValue'] !== item['statusValue'];
    })[0];

    return selectedStatus;
  }

  validationNeed= false;
  isCommentsFieldFilled = true;
  entryClickActions(actionName) {
     this.isCommentsFieldFilled = true;
    if(actionName === 'confirm'){
      let slickGridSelectedObject = this.selectedItems.filter(elem => {
        return elem['statusValue'] === this.defaultOptionValue
      })[0];
      
      if (this.entryComments === ''   && slickGridSelectedObject['isCommentValidationNeed'] === 'Y') {
        this.validationNeed = true;
        this.isCommentsFieldFilled = false;
        return;
      }
    }
      if (this.callingFrom === 'internal') {

        let slickGridSelectedObject = this.selectedItems.filter(elem => {
          return elem['statusValue'] === this.defaultOptionValue;
        })[0];
        
        if (this.entryComments === '' && actionName === 'confirm' && slickGridSelectedObject['isCommentValidationNeed'] === 'Y') {
          this.validationNeed = true;
          this.isCommentsFieldFilled = false;
          return;
        }
        this.closePopUp()
     if (actionName === 'cancel') {
          return;
        }
        this.parent.setComments(this.entryComments);
        this.parent.setSelectedValue(this.defaultOptionValue);

      } else {


        let slickGridSelectedObject = this.selectedItems.filter(selectedItem => {
          if (selectedItem['statusValue'] === this.defaultOptionValue){
            return selectedItem;
          }
        });
        window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown']);
        this.selectedStatus = JSON.parse(JSON.stringify(slickGridSelectedObject[0]));

        this.popoverStatusChanged.emit({
          actionName: actionName,
          selectedValue: this.defaultOptionValue,
          selectedObject: this.selectedObject,
          statusWFConfigId: this.selectedStatus['statusWFConfigId'],
          fieldId: this.fieldIdValue,
          selectedStatus: this.selectedStatus,
          workFlowUserApprovalStatusDataObject: this.processingData['WorkFlowUserApprovalStatusDataObject'],
          comments:this.entryComments
        });
        this.popoverOnSubmit.emit({
          actionName: actionName,
          selectedValue: this.defaultOptionValue,
          selectedObject: this.selectedObject,
          statusWFConfigId: this.selectedStatus['statusWFConfigId'],
          fieldId: this.fieldIdValue,
          selectedStatus: this.selectedStatus,
          workFlowUserApprovalStatusDataObject: this.processingData['WorkFlowUserApprovalStatusDataObject'],
          comments:this.entryComments
        });
      }

  }

  radioButtonClick(value) {
    this.defaultOptionValue = value;
  }
  onSelectionChange(event) {
    this.entryComments = '';
    this.isCommentsFieldFilled = true;
    const selectedObject = this.selectedItems.filter(elem => {
      return elem['statusValue'] === this.defaultOptionValue;
    })[0];
    if (this.entryComments === '' && selectedObject['isCommentValidationNeed'] === 'Y') {
      this.validationNeed = true;
    
    }else{
      this.validationNeed = false;
    }
  }
  clearStatus() {
    this.entryComments = '';
    this.parent.setSelectedValue(this.previousStatus['statusValue']);
    this.parent.setComments(this.entryComments);
    this.closePopUp();

  }
}
