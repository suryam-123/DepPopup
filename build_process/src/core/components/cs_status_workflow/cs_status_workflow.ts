

/* 
 *   File: cs_status_workflow.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { cs_status_workflow_popover } from '../cs_status_workflow_popover/cs_status_workflow_popover';
import { appUtility } from 'src/core/utils/appUtility';
import { cspfmExecutionPouchDbProvider } from 'src/core/db/cspfmExecutionPouchDbProvider';
import { cspfmExecutionPouchDbConfiguration } from 'src/core/db/cspfmExecutionPouchDbConfiguration';
import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
import { metaDataDbProvider } from 'src/core/db/metaDataDbProvider';
import { TranslateService } from '@ngx-translate/core';
import { cspfmStatusWorkFlowService } from 'src/core/services/cspfmStatusWorkFlow.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { cs_status_workflow_history } from '../cs_status_workflow_history/cs_status_workflow_history';
import { SlickgridPopoverService } from '../../services/slickgridPopover.service';
import {
  objectTableMapping
} from 'src/core/pfmmapping/objectTableMapping';
declare const $: any;
declare const window: any;


export interface StatusOptions {
  statusLabel: string;
  statusValue: string;
  statusType: string;
}

@Component({
  selector: 'cs-status-workflow',
  templateUrl: './cs_status_workflow.html',
  styleUrls: ['./cs_status_workflow.scss']
})
export class cs_status_workflow implements OnInit {

  isValidData = (input: any): input is StatusOptions => {

    const schema: Record<keyof StatusOptions, string> = {
      statusValue: 'string',
      statusLabel: 'string',
      statusType: 'string'
    };

    const missingProperties = Object.keys(schema)
      .filter(key => input[key] === undefined)
      .map(key => key as keyof StatusOptions)
      .map(key => new Error(`Document is missing ${key} ${schema[key]}`));

    // throw the errors if you choose

    return missingProperties.length === 0;
  }
  items;
  selectedStatus: StatusOptions;
  previousStatus: StatusOptions;
  labelValue: string;
  approveActionMessage = '';
  statusWorkFlowFieldId;
  approvalType = '';
  objectname='';
  layoutId = '';
  dripDownAttribute='';

  public configStyle = '3';
  public entryActionComments: string = ''
  allowApproveAction: boolean = false;
  public entryPopUpId;
  public entryComments = '';
  public selectedOptionValue;
  @Input() set data(data) {
    if (data !== undefined && data !== null) {
      let keys = Object.keys(data);
      let keyMatched = keys.filter(keyItem => {
        let arrayValue = data[keyItem];
        if (arrayValue.constructor === Array) {
          let matchedRecord = arrayValue.filter(item => {
            return this.isValidData(item);
          });
          return arrayValue.length === matchedRecord.length;
        } else {
          return false;
        }
      })
      if (keys.length === keyMatched.length) {
        this.items = data;
        this.approverType = '';
      } else {
        throw new Error('Required value is missing.');
      }
    } else {
      throw new Error('Required value is missing.');
    }

  }
  historyEnabled = false;
  @Input() set enableHistory(enableHistory: boolean) {
    if (enableHistory !== undefined && enableHistory !== null && enableHistory) {
      this.historyEnabled = enableHistory;
    }
  }
  isIcon=false;
  isHistoryIcon='icon-mat-update';
  isButton=false;
  historyLabel='';
  actionType='';
  @Input() set displayAction(displayInfo){
    if(displayInfo !== undefined && displayInfo !== null){
      const displayObject=displayInfo[0];
      this.actionType = displayObject['actionType'];
      this.isHistoryIcon=displayObject['actionIcon']!==''?displayObject['actionIcon']:'icon-mat-update';
      this.isIcon=displayObject['actionDisplayType']=='Icon'||displayObject['actionDisplayType']==='IconandButton'?true:false;
      this.isButton=displayObject['actionDisplayType']=='Button'||displayObject['actionDisplayType']==='IconandButton'?true:false;
      this.historyLabel=this.isButton?displayObject['actionLabel']:'';
    }
    
  }
  @Input() set currentStatus(selectedValue: StatusOptions) {

    if (selectedValue !== undefined && selectedValue !== null && this.isValidData(selectedValue)) {
      this.selectedStatus = selectedValue;
      this.previousStatus = selectedValue;

      const input = this.items;
      this.selectedOptionValue = this.selectedStatus.statusValue;
      this.selectedItems = input[this.previousStatus.statusValue];
      this.getComments();

    }
  }

  @Input() set label(label: string) {
    this.labelValue = (label !== undefined && label !== null) ? label : "Status";
    this.translate.get(this.labelValue).subscribe(res => {
      this.labelValue = res;
    });
  }
 
 
 
  @Input() set objectName(name: string) {
    this.objectname = (name !== undefined && name !== null) ? name : '';
  }
  executionInfoDetail = {};


  selectedObject = {};
  @Input() set cscomponentSelectedObject(label: string) {
    this.selectedObject = (label !== undefined && label !== null) ? label : "";
    this.setExecutionData();
    if(this.selectedObject && this.selectedObject['type']&& this.inputPageName && this.inputPageName==='view'){
      let objectNameList= Object.keys(this.objectTableMapping['mappingDetail']);
      let workflowObjectIndex = Object.values(this.objectTableMapping['mappingDetail']).indexOf(this.selectedObject['type'])
      this.objectname = objectNameList[workflowObjectIndex];
    }
  }
  @Input() set cscomponentField(label: string) {
    this.statusWorkFlowFieldId = label;
  }

  statusworkflow_fieldId = {}
  @Input() set csstatusworkflow_fieldId(label: string) {
    this.statusworkflow_fieldId = (label !== undefined && label !== null) ? label : "";
  }
  workFlowHistoryDataObject;
  @Input() set workflowHistoryObject(label) {
    this.workFlowHistoryDataObject = (label !== undefined && label !== null) ? label : "";
    this.getComments()
  }
  getComments() {

    if (!this.workFlowHistoryDataObject || !this.previousStatus) {
      return;
    }
    if(Object.keys(this.workFlowHistoryDataObject).length===0){
      this.entryComments='';
     return;
    }

   let currentStausCommentValue = this.workFlowHistoryDataObject['workFlowHistory'].filter(elem => {
      return elem['statusValue'] === this.previousStatus['statusValue']
    })[0];
    if(currentStausCommentValue){
     this.entryComments = currentStausCommentValue['comments'];
    }
  }
  fieldIdValue;
  @Input() set fieldId(label: string) {
    this.fieldIdValue = (label !== undefined && label !== null) ? label : "";
    this.setExecutionData();
  }

  inputPageName = '';
  @Input() set inputPage(label: string) {
    this.inputPageName = (label !== undefined && label !== null) ? label : "";

    if(this.selectedObject && this.selectedObject['type'] && this.inputPageName && this.inputPageName==='view' ){
      let objectNameList= Object.keys(this.objectTableMapping['mappingDetail']);
      let workflowObjectIndex = Object.values(this.objectTableMapping['mappingDetail']).indexOf(this.selectedObject['type']);
      this.objectname = objectNameList[workflowObjectIndex];
    }

  }
  @Input() set configVersion(label: string) {
    this.configStyle = (label !== undefined && label !== null) ? label : "1";

  }
  workflowFieldName = '';
  @Input() set fieldName(label: string) {
    this.workflowFieldName = (label !== undefined && label !== null) ? label : "";

  }
  
  @Input() set setLayoutId(layoutId){
    this.layoutId = layoutId;
    this.dripDownAttribute = '#cs-dropdown-' + this.layoutId;
  }

  @Output() onStatusChanged: EventEmitter<any> = new EventEmitter();
  @Output() getApprovalState: EventEmitter<any> = new EventEmitter();
  
  constructor(public popoverController: PopoverController,
    private translate: TranslateService,
    public appUtilityConfig: appUtility,
    public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider,
    public executionDbConfigObject: cspfmExecutionPouchDbConfiguration,
    public metaDbConfigurationObj: metaDbConfiguration,
    private cdr: ChangeDetectorRef,
    public metaDbProvider: metaDataDbProvider,
    private cspfmStatusWorkFlowServiceObject: cspfmStatusWorkFlowService,
    public dialog: MatDialog,
    private slickgridpopoverservice: SlickgridPopoverService,
    public objectTableMapping: objectTableMapping) {
    this.entryPopUpId = new Date().getUTCMilliseconds() + 'entryPopUpId';


  }
  ngOnInit() {

  }

  setComments(entryComments) {
    this.entryComments = entryComments;
  }

  selectedItems;
  WorkFlowUserApprovalStatusDataObject = {};
  approverType;
  cscomponentactionInfo = {};


  async presentPopover(popUpType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      parent: this,
      input: this.items,
      displayName: this.labelValue,
      configStyle: this.configStyle,
      selectedStatus: this.selectedStatus,
      previousStatus: this.previousStatus,
      popUpType: popUpType,
      selectedItems: this.selectedItems,
      entryComments: this.entryComments,
      callingFrom: 'internal',
      fieldName: this.workflowFieldName,
      selectedObject: this.selectedObject,
      dbServiceProvider: this.dbServiceProvider,
      objectName:this.objectname,
      buttonInfo: [
        {
          'name': 'OK'
        }
      ],
      parentContext: this,
      type: 'Alert'
    };
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'cs-status-popover-box';
    this.dialog.open(cs_status_workflow_popover, dialogConfig);
  }
  @Input() set actionInfo(label: string) {
    let actionInfoValue = (label !== undefined && label !== null) ? label : "";

    if (actionInfoValue === '') {
      this.allowApproveAction = false;
      this.approveActionMessage = 'Workflow process initiated';

    }else {

      this.approveActionMessage = '';
      this.allowApproveAction = true;
    }
  }

  dbServiceProvider = '';
  @Input() set csComponentDBServiceProvider(label: string) {
    this.dbServiceProvider = (label !== undefined && label !== null) ? label : "";
    this.setExecutionData();
  }
  selectedStateAction(selectedStatus) {
    this.onStatusChanged.emit({
      'selectedStatus': this.selectedStatus,
      'workFlowUserApprovalStatusDataObject': this.WorkFlowUserApprovalStatusDataObject,
      'comments': this.entryComments
    });

    this.setApproveProcessStatus();
  }
  approveAction(previousStatus) {
    this.selectedStatus = this.items[previousStatus['statusValue']].filter(item => {
      return item['statusType'].toLowerCase() === 'approved' &&
        previousStatus['statusValue'] !== item['statusValue']
    })[0];
    this.selectedStateAction(this.selectedStatus);
  }

  rejectAction(previousStatus) {
    this.selectedStatus = this.items[previousStatus['statusValue']].filter(item => {
      return item['statusType'].toLowerCase() === 'reject' &&
        previousStatus['statusValue'] !== item['statusValue'];
    })[0];
    this.selectedStateAction(this.selectedStatus);
  }



  popoverItemSelected(data) {
    this.selectedStatus = JSON.parse(JSON.stringify(data));
    this.onStatusChanged.emit({
      'selectedStatus': data,
      'workFlowUserApprovalStatusDataObject': this.WorkFlowUserApprovalStatusDataObject,
      'comments': this.entryComments
    });
  }


  setApproveProcessStatus() {
    if (this.approverType === 'non approver' && this.executionInfoDetail['workflowApproveStatusObject'] === '') {
      if (this.selectedStatus && this.selectedStatus['statusType'].toLowerCase() === 'approved'){
        this.approveActionMessage = 'Next workflow process initiated'
      }else{
        this.approveActionMessage = 'Workflow process initiated'
        }
    }else if (this.executionInfoDetail['executionId'] === '') {
      this.allowApproveAction = false;
      this.approveActionMessage = 'Workflow process initiated';
    }else if (this.approvalType === 'hierarchical' && this.approverType === 'non approver' && this.executionInfoDetail['workflowApproveStatusObject'] && 
      this.executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === '') {

      this.approveActionMessage = 'Workflow process initiated';
    }else if (this.executionInfoDetail['executionId'] !== ''

      && this.executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === '') {
      this.allowApproveAction = true;
      this.approveActionMessage = '';
    }else if (this.executionInfoDetail['executionId'] !== ''

      && this.executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === 'INPROGRESS') {
      this.allowApproveAction = false;
      this.approveActionMessage = 'Approve inprogress';
    }else if (this.executionInfoDetail['executionId'] !== ''

      && this.executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === 'ERROR') {
      this.allowApproveAction = true;
      alert(this.executionInfoDetail['workflowApproveStatusObject']['comment']);
      this.approveActionMessage = '';
    }else if ((this.executionInfoDetail['executionId'] !== ''

      && this.executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === 'APPROVED') || (this.executionInfoDetail['executionId'] !== ''

        && this.executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === 'REJECT')) {
      this.allowApproveAction = false;

      this.approveActionMessage = this.executionInfoDetail['workflowApproveStatusObject']['comment'];
    }


    if (this.cdr && !this.cdr['destroyed']) {

      this.cdr.detectChanges();
    }

  }

  checkLoggedUserIsApprover() {
    return this.cspfmStatusWorkFlowServiceObject.checkLoggedUserIsApprover(this.selectedObject, this.fieldIdValue).then(res => {
      this.approverType = res['approverType'];
      this.getApprovalState.emit({ 'approverType': res['approverType'], 'fieldId': res['fieldId'] });
      return res;
    });
  }

  private setExecutionData() {
    if (!this.selectedObject || !this.fieldIdValue || this.dbServiceProvider === '') {
      return;
    }
    
    if( (this.selectedStatus && 
      this.selectedObject && 
      this.selectedObject[this.workflowFieldName]!==this.selectedStatus['statusValue']) &&
      this.selectedObject['systemAttributes'] &&
      this.selectedObject['systemAttributes']['fieldId']===this.fieldIdValue){
        this.approverType = '';
        this.getApprovalState.emit({ 'approverType': '', 'fieldId': this.fieldIdValue });
        return;
      }

    if (this.selectedObject['systemAttributes']
      && this.selectedObject['systemAttributes']['lockedStatus'] === 'INPROGRESS') {

      const obj = this.selectedObject['systemAttributes'];
      if (obj['fieldId'] !== this.fieldIdValue) {
        this.getApprovalState.emit({ 'approverType': '', 'fieldId': this.fieldIdValue });
        this.approverType = '';
        return;
      }
      this.cscomponentactionInfo['executionId'] = this.selectedObject['systemAttributes']['workFlowExecID'];

      if (this.selectedObject['systemAttributes']['workFlowExecID'] !== "") {
        this.fetchWorkFlowUserApprovalStatus();
      } else {
        this.executionInfoDetail = (this.cscomponentactionInfo !== undefined
          && this.cscomponentactionInfo !== null) ? this.cscomponentactionInfo : "";

        this.approverType = 'non approver';
        this.setApproveProcessStatus();
      }
    }else {
      this.approverType = '';
      this.getApprovalState.emit({ 'approverType': '', 'fieldId': this.fieldIdValue });
    }
  }

  fetchWorkFlowUserApprovalStatus() {
    return this.cspfmStatusWorkFlowServiceObject.fetchWorkFlowUserApprovalStatus(this.selectedObject, this.executionDbConfigObject, 
      this.WorkFlowUserApprovalStatusDataObject, this.cscomponentactionInfo, this.executionInfoDetail, this.selectedStatus,
      this.approverType, this.dbServiceProvider).then(res => {
        this.approverType = res['approverType'];
        this.getApprovalState.emit({ 'approverType': res['approverType'], 'fieldId': this.fieldIdValue });

        this.WorkFlowUserApprovalStatusDataObject = res['WorkFlowUserApprovalStatusDataObject'];
        this.cscomponentactionInfo['workflowApproveStatusObject'] = res['cscomponentactionInfo']['workflowApproveStatusObject'];
        this.executionInfoDetail = res['executionInfoDetail'];
        this.approvalType = res['approvalType'];
        this.setApproveProcessStatus();
        return res;
      });
  }



  showApproveRejectModel() {

    if (this.allowApproveAction){
      this.presentPopover("approve");
    }

  }

  showEntryPopup() {
    if (this.selectedStatus['statusType'] === 'Start' && this.selectedStatus['isApproveInitiateEnabled'] === 'Y'){
      return;
    }  
if( this.selectedObject[this.workflowFieldName] && this.selectedItems && this.selectedItems.length>0){
  let filteredPreviousStatusValue = this.selectedItems.filter(item => {
    return item['statusValue'].toLowerCase() !==
      this.selectedObject[this.workflowFieldName].toLowerCase();
  });

  if(filteredPreviousStatusValue && filteredPreviousStatusValue.length===0){
    this.appUtilityConfig.
    presentToast("Workflow process completed");
    return;
  }
}
      
     
    this.presentPopover("entry");
  }

  setSelectedValue(selectedValue) {

    let selectedObject = this.selectedItems.filter(selectedItem => {
      if (selectedItem['statusValue'] === selectedValue){
        return selectedItem
      }
    });
    this.selectedStatus = selectedObject[0];

    this.popoverItemSelected(selectedObject[0]);
  }

  selectedHistroyObject = ''
  callHistory(){
    this.selectedHistroyObject = JSON.parse(JSON.stringify(this.selectedObject));

    let htmlElement: HTMLElement = document.getElementById('cs-dropdown-'+this.layoutId);
    htmlElement.innerHTML = '';

    this.slickgridpopoverservice.appendComponentToElement_View('cs-dropdown-' + this.layoutId ,cs_status_workflow_history,{
      selectedObject: this.selectedHistroyObject,
      dbServiceProvider: this.dbServiceProvider,
      fieldDisplayName: this.labelValue,
      fieldName: this.workflowFieldName,
      objectname: this.selectedHistroyObject['type']
     });
  }
  
   async presentHistoryPopOver(result) {

    const popover = await this.popoverController.create({
      component: cs_status_workflow_history,
      cssClass: !this.appUtilityConfig.isMobileResolution ? 'cs-status-history-popover' : '',
      componentProps: {

        callingFrom: 'internal',
        selectedObject: this.selectedObject,
        historyObject: result
      },
      translucent: true
    });
    return await popover.present();

  }



  
}
