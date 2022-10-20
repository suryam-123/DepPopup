/* 
 *   File: cs_status_workflow_bulkapproval.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { appUtility } from 'src/core/utils/appUtility';
declare const $: any;
declare const window: any;
@Component({
  selector: 'cs_status_workflow_bulkapproval',
  templateUrl: './cs_status_workflow_bulkapproval.html',
  styleUrls: ['./cs_status_workflow_bulkapproval.scss'],
})
export class cs_status_workflow_bulkapproval implements OnInit {
  public approvalPopupId;
  public multiplePopupId;
  public singlePopUpId;
  public defaultOptionValue;
  public ispopUploaded;
  public selectedObject;
  public approvedButtonName;
  public rejectedButtonName;
  public selectedStatusObject;
  public commentRequired = false;
  public commentValidation = false;
  public entryValidationNeed = false;
  public entryComments = '';
  public selectedStatus;
  public applicableStatus = [];
  public statusValidation = false;
  public statusValidationMessage;
  public dropDownAttribute;
  @Output() onStatusChanged: EventEmitter<any> = new EventEmitter();

  constructor(
    public appUtilityConfig: appUtility

  ) {
    this.approvalPopupId = new Date().getUTCMilliseconds().toString() + 'approvalPopupId';
    this.multiplePopupId = new Date().getUTCMilliseconds().toString() + 'multiplePopupId';
    this.singlePopUpId = new Date().getUTCMilliseconds() + 'singlePopUpId';
  } 

  public displayName;
  public displayType;
  public configStyle;
  public selectedRecords;
  public parent;
  public statusWorkFlowList;
  public previousStatus;
  public callingFrom :'internal' | 'external';
  public objectname = '';
  public fieldName = '';
  public fieldId = '';
  public selectedItems;
  public layoutId;


  @Input() set setDisplayName(displayName) {
    this.displayName = displayName;
  }

  @Input() set setDisplayType(displayType) {
    this.displayType = displayType;
  }

  @Input() set setConfigStyle(configStyle) {
    this.configStyle = configStyle;
  }

  @Input() set setSelectedRecords(selectedRecords) {
    this.selectedRecords = selectedRecords;
  }

  @Input() set setParent(parent) {
    this.parent = parent;
  }

  @Input() set setSatusWorkFlowList(statusWorkFlowList) {
    this.statusWorkFlowList = statusWorkFlowList;
  }

  @Input() set setPreviousStatus(previousStatus) {
    this.previousStatus = previousStatus;
  }

  @Input() set setCallingFrom(callingFrom) {
    this.callingFrom = callingFrom;
  }

  @Input() set setObjectname(objectname) {
    this.objectname = objectname;
  }

  @Input() set setFieldName(fieldName) {
    this.fieldName = fieldName;
  }

  @Input() set setFieldIde(fieldId) {
    this.fieldId = fieldId;
  }

  @Input() set setLayoutId(layoutId) {
    this.layoutId = layoutId;
    this.dropDownAttribute = '#cs-dropdown-' + this.layoutId;
  }

  @Input() set setSelectedItems(selectedItems) {
    this.selectedItems = selectedItems;
  }


  ngOnInit() {  
 
    if (this.displayName) {
      this.ispopUploaded = true;
      this.selectedObject = this.selectedRecords[0];
    }

      if (this.displayType === 'Approval') {
        const selectedStatus = this.statusWorkFlowList[this.previousStatus['statusValue']].filter(item => {
          return item['statusType'].toLowerCase() === 'approved' &&
            this.previousStatus['statusValue'] !== item['statusValue'];
        })[0];

        const approvedStatusObject = this.statusWorkFlowList[this.previousStatus['statusValue']].filter(item => {
          return item['statusType'].toLowerCase() === 'approved' &&
            this.previousStatus['statusValue'] !== item['statusValue'];
        })[0];
        this.approvedButtonName = approvedStatusObject["statusLabel"];

        const rejctedStatusObject = this.statusWorkFlowList[this.previousStatus['statusValue']].filter(item => {
          return item['statusType'].toLowerCase() === 'reject' &&
            this.previousStatus['statusValue'] !== item['statusValue'];
        })[0];
        this.rejectedButtonName = rejctedStatusObject["statusLabel"]
        if(selectedStatus['isCommentRequired']==='Y'){
          this.commentRequired = true;
        } else if(rejctedStatusObject['isCommentRequired']==='Y'){
          this.commentRequired = true;
        }
      } else if (this.displayType === 'Single') {
        this.selectedItems = this.statusWorkFlowList[this.previousStatus['statusValue']].filter(item => {
          return this.previousStatus['statusValue'] !== item['statusValue']
        });
        
        this.defaultOptionValue = this.selectedItems[0]['statusValue'];
        this.checkCommentRequiredValidation(this.selectedItems[0])
      } else {
        this.selectedItems = this.selectedItems;
        const selectedObject = this.statusWorkFlowList[this.previousStatus['statusValue']].filter(item => {
          return this.previousStatus['statusValue'] !== item['statusValue']
        });
        selectedObject.forEach(statusObject => {
          this.applicableStatus.push(statusObject);
        });
        
        this.selectedStatusObject = selectedObject[0]['statusValue']
        this.selectedStatus = selectedObject[0];
        this.checkCommentRequiredValidation(selectedObject[0]);
      }
      setTimeout(() => {
        window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
      }, 100);
    }

  singleClickAction(actionName) {
    const destinationStatus = this.parent.approvalConfig.destinationStatus
    if (this.commentValidation && actionName !== 'cancel') {
      if (this.entryComments !== undefined && this.entryComments !== null && this.entryComments.length > 0) {
        this.entryValidationNeed = false;
      } else {
        this.entryValidationNeed = true;
        return
      }
    }
    if (this.callingFrom === 'internal') {
      if (actionName === 'cancel') {
        this.closePopUp();
      } else if (actionName === 'submit') {
        const selectedStatus = this.statusWorkFlowList[this.previousStatus['statusValue']].filter(item => {
          return destinationStatus[0] === item['statusValue']
        })[0];
        const data = {
          'selectedStatus': selectedStatus,
          'selectedRecords': this.selectedRecords,
          'fieldId': this.fieldId,
          'workFlowFieldName': this.fieldName,
          'objectId': this.objectname,
          'comments': this.entryComments
        }
        this.parent.updateStatusAction(data)
        this.closePopUp();
      }
    }
  }

  approveRejectClickAction(actionName?) {
    if (this.commentValidation && actionName !== 'cancel') {
      if (this.entryComments !== undefined && this.entryComments !== null && this.entryComments.length > 0) {
        this.entryValidationNeed = false;
      } else {
        this.entryValidationNeed = true;
        return
      }
    }
    if (actionName === "Approve") {
      this.selectedStatus = this.statusWorkFlowList[this.previousStatus['statusValue']].filter(item => {
        return item['statusType'].toLowerCase() === 'approved' &&
          this.previousStatus['statusValue'] !== item['statusValue']
      })[0];
      const data = {
        'selectedStatus': this.selectedStatus,
        'selectedRecords': this.selectedRecords,
        'fieldId': this.fieldId,
        'workFlowFieldName': this.fieldName,
        'objectId': this.objectname,
        'comments': this.entryComments
      }
      this.parent.updateStatusAction(data)
      this.closePopUp()
    } else if (actionName === "Reject") {
      this.selectedStatus = this.statusWorkFlowList[this.previousStatus['statusValue']].filter(item => {
        return item['statusType'].toLowerCase() === 'reject' &&
          this.previousStatus['statusValue'] !== item['statusValue']
      })[0];
      const data = {
        'selectedStatus': this.selectedStatus,
        'selectedRecords': this.selectedRecords,
        'fieldId': this.fieldId,
        'workFlowFieldName': this.fieldName,
        'objectId': this.objectname,
        'comments': this.entryComments
      }
      this.parent.updateStatusAction(data)
      this.closePopUp();
    } else if (actionName === "cancel") {
      this.closePopUp();
    }
  }

  multipleClickAction(actionName) {
    if (this.commentValidation && actionName !== 'cancel') {
      if (this.entryComments !== undefined && this.entryComments !== null && this.entryComments.length > 0) {
        this.entryValidationNeed = false;
      } else {
        this.entryValidationNeed = true;
        return
      }
    }
    if (this.callingFrom === 'internal') {
      if (actionName === 'cancel') {
        this.closePopUp()
      } else if (actionName === 'submit') {
         const data = {
          'selectedStatus': this.selectedStatus,
          'selectedRecords': this.selectedRecords,
          'fieldId': this.fieldId,
          'workFlowFieldName': this.fieldName,
          'objectId': this.objectname,
          'comments': this.entryComments
        }
           this.parent.updateStatusAction(data);
        this.closePopUp();
      }
    }
  }

  onSelectionChange(event) {
    
    const selectedStatus = this.selectedItems.filter(item => {
      return event === item['statusValue'];
    })[0];

    const applicableStatusObject = this.applicableStatus.filter(statusObject => {
      return statusObject['statusValue'] === event;
    })
    this.statusValidation = false;
    if (applicableStatusObject.length === 0) {
      this.statusValidation = true;
      this.statusValidationMessage = selectedStatus['statusLabel'] + ' is not applicable for the selected record(s)';
      return;
    }
    this.selectedStatus = selectedStatus;
    this.checkCommentRequiredValidation(selectedStatus);
  }

  checkCommentRequiredValidation(selectedStatus) {
    const isCommentRequired = selectedStatus['isCommentRequired'];
    this.commentRequired = (isCommentRequired === 'Y') ? true : false;
    if (this.commentRequired) {
      const isCommentValidationNeed = selectedStatus['isCommentValidationNeed']
      this.commentValidation = (isCommentValidationNeed === 'Y') ? true : false;
    }
  }
  closePopUp() {
    $('.cs-dropdown').removeClass('dontCloseInGloablClick cs-fabDropDown');
    window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown']);
    $('.cs-dropdown').empty();
  }
}
