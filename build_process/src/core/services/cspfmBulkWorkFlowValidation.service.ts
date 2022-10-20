import { Injectable } from '@angular/core';
import { metaDbConfiguration } from '../db/metaDbConfiguration';
import { appUtility } from '../utils/appUtility';
import { DatePipe } from '@angular/common';
import { dataProvider } from '../utils/dataProvider';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
import * as lodash from 'lodash';
import { cspfmObjectConfiguration } from '../pfmmapping/cspfmObjectConfiguration';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { cspfmAlertDialog } from '../components/cspfmAlertDialog/cspfmAlertDialog';
import {
  appConstant
} from 'src/core/utils/appConstant';
import { cspfmStatusWorkFlowService } from './cspfmStatusWorkFlow.service';
import { cspfmExecutionPouchDbConfiguration } from '../db/cspfmExecutionPouchDbConfiguration';
import { objectTableMapping } from '../pfmmapping/objectTableMapping';
import { cspfmDataTraversalUtils } from "src/core/dynapageutils/cspfmDataTraversalUtils";
declare const $: any;
declare const window: any;
import { SlickgridPopoverService } from "./slickgridPopover.service";
import { cspfmOnDemandFeature } from '../utils/cspfmOnDemandFeature';
import {
  cspfmSlickgridUtils
} from 'src/core/dynapageutils/cspfmSlickgridUtils';

@Injectable({
  providedIn: 'root'
})
export class cspfmBulkWorkFlowValidation {

  public statusWorkList;
  private parentPage: any;
  private objectId;
  private objectName;
  private fieldName;
  private fieldDisplayName;
  private selectedRecords = [];
  private approvalConfig;
  private displayType;
  private workFlowMappingDetails;
  private layoutId;
  public slickGridArgs;
  public pageType;
  constructor(private appUtilityConfig: appUtility, 
    public dataProvider: dataProvider,
    private datePipe: DatePipe,
    public metaDbConfig: metaDbConfiguration,
    public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider,
    public pfmObjectConfig: cspfmObjectConfiguration,
    public matDialog: MatDialog,
    public cspfmStatusWorkFlowServiceObject: cspfmStatusWorkFlowService,
    private executionDbConfigObject: cspfmExecutionPouchDbConfiguration,
    private objMapping : objectTableMapping,
    private cspfmDataTraversalUtilsObject : cspfmDataTraversalUtils,
    private slickgridpopoverservice: SlickgridPopoverService,private cspfmOnDemandFeature :cspfmOnDemandFeature,
    private slickGridutils: cspfmSlickgridUtils) { }
   
public childObject;
  validateWorkFlowStatus(bulkWorkFlowConfig, pageType,slickGridArgs?) {
    this.filteredApproverRecord = []
    this.pageType = pageType;
 
    this.layoutId = bulkWorkFlowConfig['layoutId'];
    this.approvalConfig = bulkWorkFlowConfig['workFlowConfig']
    this.parentPage = bulkWorkFlowConfig['parent']
    const records = bulkWorkFlowConfig['selectedRecords']
    this.objectId = this.approvalConfig['objectId']
    this.childObject = bulkWorkFlowConfig['childObject']
    const objectMappingDetail = this.objMapping.mappingDetail;
    this.objectName = Object.keys(objectMappingDetail).find(key => objectMappingDetail[key] === this.objectId);
    this.fieldName = this.approvalConfig['fieldName']
    this.fieldDisplayName = this.approvalConfig['fieldDisplayName']
    const applicableStatusArray = this.approvalConfig["sourceStatus"]
    this.displayType = this.approvalConfig["actionDisplayType"]
    this.slickGridArgs = slickGridArgs
    const destinationStatus = this.approvalConfig["destinationStatus"]

    this.selectedRecords = []
    records.forEach(recordObject => {
      const traversalPath = this.approvalConfig['traversalPath']
      const traversalConfigJson = this.approvalConfig['traversalConfigJson']
      const workFlowDataObject = this.cspfmDataTraversalUtilsObject.traversalParse(recordObject, traversalConfigJson, traversalPath)
      this.selectedRecords.push(workFlowDataObject)
    });

    const fieldId = this.pfmObjectConfig.objectConfiguration[this.objectId]['workflow'][this.fieldName]['fieldId'];
    this.statusWorkList = this.pfmObjectConfig.objectConfiguration[this.objectId]['workflow'][this.fieldName]['configJson'];
    this.workFlowMappingDetails = this.pfmObjectConfig.objectConfiguration[this.objectId]['workflow'][this.fieldName]['mappingDetails'];

    // Make Validation Message based on source status
    let applicableStatusString = ""
    applicableStatusArray.forEach(applicableStatus => {
      const statusDisplayName = this.workFlowMappingDetails[applicableStatus]
      if (applicableStatusString === "" && applicableStatusString.length === 0) {
        applicableStatusString = applicableStatusString + statusDisplayName + " or "
      } else {
        applicableStatusString = applicableStatusString + statusDisplayName + " or "
      }
    });
    applicableStatusString = applicableStatusString.slice(0, -4);

    // Validate if selected records are same
    const allEqualValues = this.selectedRecords.every((v, i, a) => v[this.fieldName] === a[0][this.fieldName])
    console.log("allEqual = > ", allEqualValues);
    if (!allEqualValues) {
      console.log(allEqualValues);
      const response = {
        "status": "Failed",
        "message" : "Selected records should be of same work flow status",
        'childObject':this.childObject
      }
      this.parentPage.bulkApprovalResponse(response)
      return
    }

    // Validate selected records are in source status
    let finalStatus = lodash.filter(Object.keys(this.statusWorkList),stz => {
      if(this.statusWorkList[stz].length === 1){
        return stz
      }
    })
    let recordDataFilter = [];
    let finalStatusArray = [];

  lodash.map(this.selectedRecords, (selectedObject) =>{
    if(applicableStatusArray.includes(selectedObject[this.fieldName])){
      recordDataFilter.push(selectedObject);
    }else if(finalStatus.includes(selectedObject[this.fieldName])){
      finalStatusArray.push(selectedObject);
    }
  })
    console.log("recordDataFilter => ", recordDataFilter);
    if(finalStatusArray.length > 0){
      const response = {
        "status": "Failed",
        "message" : "work flow process already completed",
        'childObject':this.childObject
      }
      this.parentPage.bulkApprovalResponse(response)
      return
    }
    if (recordDataFilter.length === 0) {
      console.log(recordDataFilter);
      const response = {
        "status": "Failed",
        "message" : applicableStatusString + " status records only applicable for this action",
        'childObject':this.childObject
      }
      this.parentPage.bulkApprovalResponse(response)
      return
    }

    const dataObject = this.selectedRecords[0]
    const defaultStatus = this.statusWorkList[dataObject[this.fieldName]].filter(item => {
         return item['statusValue'] === dataObject[this.fieldName]
    })[0]


    const selectedItems = this.statusWorkList[defaultStatus['statusValue']].filter(item => {
      return defaultStatus['statusValue'] !== item['statusValue']  && destinationStatus.includes(item['statusValue'])
    });
    const isCommentRequired = selectedItems[0]['isCommentRequired']
    const defaultOptionValue = selectedItems[0]['statusValue']
    const selectedStatus = this.statusWorkList[defaultStatus['statusValue']].filter(item => {
      return defaultOptionValue === item['statusValue']
    })[0];
    const isApproveInitiateEnabled = selectedStatus["isApproveInitiateEnabled"]
    if (this.displayType === 'Single') {
      if (isCommentRequired === 'Y') { // With Comment
        const statusType = selectedStatus["statusType"]
        if (statusType === 'Approved' || statusType === 'Reject') {
          this.validateUserForApproval(this.selectedRecords).then(res => {
     
            if (res['status'] === "Failed") {
              const response = {
                "status": "Failed",
                "message" : res['message'],
                'childObject':this.childObject
              }
              this.parentPage.bulkApprovalResponse(response)
            } else { // Success
              this.showApprovalDialog(fieldId, defaultStatus)
            }
          })
        } else if (isApproveInitiateEnabled === 'Y') {
          // Check if multiple work flow field is used in Object and don't allow to system attribute
          let systemattributeAvailable = false
          this.selectedRecords.forEach(selectedRecord => {
            if (selectedRecord["systemAttributes"] !== undefined && selectedRecord["systemAttributes"] !==
             null && Object.keys(selectedRecord["systemAttributes"]).length > 0) {
              systemattributeAvailable = true
            }
          });
          if (!systemattributeAvailable) {
            this.showApprovalDialog(fieldId, defaultStatus)
          } else {
            const response = {
              "status": "Failed",
              "message" : "Make sure another work flow process is completed.",
              'childObject':this.childObject
            }
            this.parentPage.bulkApprovalResponse(response)
          }

        } else {
          this.showApprovalDialog(fieldId, defaultStatus)
        }
      } else { // WithOut Comment
        const statusType = selectedStatus["statusType"]
        if (statusType === 'Approved' || statusType === 'Reject') {
          // Same Condition For similar to previous
          // Save WorkFlowExecutionDB
          this.validateUserForApproval(this.selectedRecords).then(res => {

            if (res['status'] === "Failed") {
              const response = {
                "status": "Failed",
                "message" : res['message'],
                'childObject':this.childObject
              }
              this.parentPage.bulkApprovalResponse(response)
            } else { // Success
              this.saveWorkFlowExecutionDB(selectedStatus)
            }
          })
        } else if (isApproveInitiateEnabled === 'Y') {
          const systemAttributeObject = this.addSystemAttributes(selectedStatus, fieldId)
          // Add this systemAttributeObject and status in selectedRecords and save it
          // After save success, Save WorkFlowHistoryObject

          // Check if multiple work flow field is used in Object and don't allow to system attribute
          let systemattributeAvailable = false
          this.selectedRecords.forEach(selectedRecord => {
            if (selectedRecord["systemAttributes"] !== undefined && selectedRecord["systemAttributes"] !==
             null && Object.keys(selectedRecord["systemAttributes"]).length > 0) {
              systemattributeAvailable = true
            }
          });
          if (!systemattributeAvailable) {
            this.saveBulkRecords(this.selectedRecords, selectedStatus['statusValue'], "", systemAttributeObject)
          } else {
            const response = {
              "status": "Failed",
              "message" : "Make sure another work flow process is completed.",
              'childObject':this.childObject
            }
            this.parentPage.bulkApprovalResponse(response)
          }

        } else if (isApproveInitiateEnabled === 'N') {
          // Update the status in selectedRecords and save it.
          // After save success, Save WorkFlowHistoryObject
          this.saveBulkRecords(this.selectedRecords, selectedStatus['statusValue'], "")
        }
      }
    } else if (this.displayType === 'Approval') {
      this.validateUserForApproval(this.selectedRecords).then(res => {
     
        if (res['status'] === "Failed") {
          const response = {
            "status": "Failed",
            "message" : res['message'],
            'childObject':this.childObject
          }
          this.parentPage.bulkApprovalResponse(response)
        } else { // Success
          this.showApprovalDialog(fieldId, defaultStatus)
        }
      })
    } else if (this.displayType === 'Multiple') {
      const destinationStatusArray = this.makeDestinationStatusArray(destinationStatus, this.statusWorkList)
      if (isApproveInitiateEnabled === 'Y') {
        // Check if multiple work flow field is used in Object and don't allow to system attribute
        let systemattributeAvailable = false
        this.selectedRecords.forEach(selectedRecord => {
          if (selectedRecord["systemAttributes"] !== undefined && selectedRecord["systemAttributes"] !==
           null && Object.keys(selectedRecord["systemAttributes"]).length > 0) {
            systemattributeAvailable = true
          }
        });
        if (systemattributeAvailable) {
          const response = {
            "status": "Failed",
            "message" : "Make sure another work flow process is completed.",
            'childObject':this.childObject
          }
          this.parentPage.bulkApprovalResponse(response)
          return;
        }
      }
      this.showApprovalDialog(fieldId, defaultStatus, destinationStatusArray)
    }
  }
  // Save Execution DB
  saveWorkFlowExecutionDB(selectedStatus, comments?) {
    const fetchWorkFlowTaskList = []
    this.filteredApproverRecord.forEach(selectedObject => {
      fetchWorkFlowTaskList.push(this.
        fetchWorkFlowUserBulkApprovalStatus(selectedObject, selectedStatus, this.
          executionDbConfigObject, appConstant.couchDBStaticName, comments))
    });
    return Promise.all(fetchWorkFlowTaskList).then(result => {
      if (result.includes(undefined)) {
        // Approve Reject Failed
        const response = this.makeResponseObject("Failed", selectedStatus['statusValue'])
        this.parentPage.bulkApprovalResponse(response)
      }
      this.dataProvider.excutionDataBulkSave(this.executionDbConfigObject.
        workFlowUserApprovalStatusObject, result, appConstant.couchDBStaticName).then(saveResultResponse => {
       
          // Approve Reject Success
          const response = this.makeResponseObject("Success", selectedStatus['statusValue'])
        this.parentPage.bulkApprovalResponse(response)
        }).catch(err => {
          console.log("approveRejectClickAction err => ", err);
          // Approve Reject Failed
          const response = this.makeResponseObject("Failed", selectedStatus['statusValue'])
          this.parentPage.bulkApprovalResponse(response)
        })
    })
  }
  // Save Mobile Platform Records
  saveBulkRecords(selectedRecords, status, comments, systemAttribute?) {
    if (systemAttribute !== undefined && systemAttribute !== null && Object.keys(systemAttribute).length > 0) {
      selectedRecords.forEach(selectedRecord => {
        selectedRecord[this.fieldName] = status
        selectedRecord["systemAttributes"] = systemAttribute
      });
    } else {
      selectedRecords.forEach(selectedRecord => {
        selectedRecord[this.fieldName] = status
      });
    }
    this.dataProvider.saveBulkDocument(this.objectId, selectedRecords,
      appConstant.couchDBStaticName).then(saveResultResponse => {
        if (saveResultResponse['status'] === "SUCCESS") {
          // Save Success
          // Save WorkFlow History Object
          this.fetchWorkFlowHistoryData(selectedRecords, this.objectId, this.objectName, this.fieldName, comments, status)
        } else {
          // Failure
          const response = this.makeResponseObject("Failed", status)
          this.parentPage.bulkApprovalResponse(response)
        }
      }).catch(err => {
        // Failure
        const response = this.makeResponseObject("Failed", status)
        this.parentPage.bulkApprovalResponse(response)
      })
  }

  //SWF ML
  saveWorkflowHistoryForMultiline(selectedRecords, historyRecords, fieldName, objectName){
    const workflowHistoryObjectName = fieldName + "_WorkFlowHistory"
    const workFlowHistoryArray = [];
    selectedRecords.forEach(selectedObject => {
      let workflowHistoryObject = {};
      workflowHistoryObject = historyRecords.filter(historyRecordObject => {
        return historyRecordObject['referenceid'] === selectedObject['id']
      })[0]
      if (workflowHistoryObject !== undefined && workflowHistoryObject !== null && Object.keys(workflowHistoryObject).length > 0) {
        const workFlowHistory = workflowHistoryObject['workFlowHistory']
        let selectedStatus = selectedObject[fieldName]
        let updatedWorkFlowStatusObject = this.pfmObjectConfig['objectConfiguration'][objectName]['workflow'][fieldName]['configJson'][selectedStatus][0];
        let statusobject = workFlowHistory.filter(elem => {
          return elem['statusValue'] === updatedWorkFlowStatusObject['statusValue']
        })[0]
        if (statusobject !== undefined && statusobject !== null && Object.keys(statusobject).length > 0) {
          // Skip Save this record
        } else {
          let refIdforHistory = selectedObject['refId'] ? selectedObject['refId'] : selectedObject['id']
          statusobject = {}
          statusobject['userName'] = this.appUtilityConfig.loggedUserName;
          statusobject['updatedBy'] = this.appUtilityConfig.userId;
          statusobject['comments'] = this.slickGridutils.workflowCommentsInfo[refIdforHistory+'$$'+fieldName];
          statusobject['updatetime'] = new Date().getTime()
          statusobject['workFlowExecID'] = ''
          statusobject['statusValue'] = updatedWorkFlowStatusObject['statusValue']
          statusobject['statusLabel'] = updatedWorkFlowStatusObject['statusLabel']
          statusobject['statusType'] = updatedWorkFlowStatusObject['statusType']
          statusobject['isApproveInitiateEnabled'] = updatedWorkFlowStatusObject['isApproveInitiateEnabled']
          workflowHistoryObject['workFlowHistory'].push(statusobject)
          workFlowHistoryArray.push(workflowHistoryObject)
        }
      } else {
        let selectedStatus = selectedObject[fieldName]
        let updatedWorkFlowStatusObject = this.pfmObjectConfig['objectConfiguration'][objectName]['workflow'][fieldName]['configJson'][selectedStatus][0];
        workflowHistoryObject = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()['workflowhistory']));
        workflowHistoryObject['fieldName'] = fieldName
        workflowHistoryObject['objectName'] = objectName
        workflowHistoryObject['referenceid'] = selectedObject['id']
        const statusobject = {}
        let refIdforHistory = selectedObject['refId'] ? selectedObject['refId'] : selectedObject['id']
        statusobject['userName'] = this.appUtilityConfig.loggedUserName;
        statusobject['updatedBy'] = this.appUtilityConfig.userId;
        statusobject['comments'] = this.slickGridutils.workflowCommentsInfo[refIdforHistory+'$$'+fieldName];
        statusobject['updatetime'] = new Date().getTime()
        statusobject['workFlowExecID'] = ''
        statusobject['statusValue'] = updatedWorkFlowStatusObject['statusValue']
        statusobject['statusLabel'] = updatedWorkFlowStatusObject['statusLabel']
        statusobject['statusType'] = updatedWorkFlowStatusObject['statusType']
        statusobject['isApproveInitiateEnabled'] = updatedWorkFlowStatusObject['isApproveInitiateEnabled']
        workflowHistoryObject['workFlowHistory'].push(statusobject)
        workFlowHistoryArray.push(workflowHistoryObject)
      }
    })
    console.log("Workflow History : ", workFlowHistoryArray)
    this.dataProvider.excutionDataBulkSave(objectName + "_WorkFlowHistory",
      workFlowHistoryArray, appConstant.couchDBStaticName).then(saveResultResponse => {
        // Work Flow History Save Success
        console.log("Workflow history ==> ",saveResultResponse)
        //this.parentPage.bulkApprovalResponse(response)
      }).catch(err => {
        console.log("approveRejectClickAction err => ", err);
        // Work Flow History Save Failed
        const response = this.makeResponseObject("Failed", 'workflow')
          //this.parentPage.bulkApprovalResponse(response)
      })
  }

  saveWorkFlowHistory(selectedRecords, historyRecords, comments, updatedWorkFlowStatusObject) {
    const workflowHistoryObjectName = this.fieldName + "_WorkFlowHistory"
    const workFlowHistoryArray = []
    selectedRecords.forEach(selectedObject => {
      let workflowHistoryObject = {}
      workflowHistoryObject = historyRecords.filter(historyRecordObject => {
        return historyRecordObject['referenceid'] === selectedObject['id']
      })[0]
      if (workflowHistoryObject !== undefined && workflowHistoryObject !== null && Object.keys(workflowHistoryObject).length > 0) {
        const workFlowHistory = workflowHistoryObject['workFlowHistory']

        let statusobject = workFlowHistory.filter(elem => {
          return elem['statusValue'] === updatedWorkFlowStatusObject['statusValue']
        })[0]

        if (statusobject !== undefined && statusobject !== null && Object.keys(statusobject).length > 0) {
          // Skip Save this record
        } else {
          statusobject = {}
          statusobject['userName'] = this.appUtilityConfig.loggedUserName;
          statusobject['updatedBy'] = this.appUtilityConfig.userId;
          statusobject['comments'] = comments
          statusobject['updatetime'] = new Date().getTime()
          statusobject['workFlowExecID'] = null
          statusobject['statusValue'] = updatedWorkFlowStatusObject['statusValue']
          statusobject['statusLabel'] = updatedWorkFlowStatusObject['statusLabel']
          statusobject['statusType'] = updatedWorkFlowStatusObject['statusType']
          statusobject['isApproveInitiateEnabled'] = updatedWorkFlowStatusObject['isApproveInitiateEnabled']
          workflowHistoryObject['workFlowHistory'].push(statusobject)
          workFlowHistoryArray.push(workflowHistoryObject)
        }
      } else {
        workflowHistoryObject = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()['workflowhistory']));
        workflowHistoryObject['fieldName'] = this.fieldName
        workflowHistoryObject['objectName'] = this.objectName
        workflowHistoryObject['referenceid'] = selectedObject['id']
        const statusobject = {}
        statusobject['userName'] = this.appUtilityConfig.loggedUserName;
        statusobject['updatedBy'] = this.appUtilityConfig.userId;
        statusobject['comments'] = comments
        statusobject['updatetime'] = new Date().getTime()
        statusobject['workFlowExecID'] = null
        statusobject['statusValue'] = updatedWorkFlowStatusObject['statusValue']
        statusobject['statusLabel'] = updatedWorkFlowStatusObject['statusLabel']
        statusobject['statusType'] = updatedWorkFlowStatusObject['statusType']
        statusobject['isApproveInitiateEnabled'] = updatedWorkFlowStatusObject['isApproveInitiateEnabled']
        workflowHistoryObject['workFlowHistory'].push(statusobject)
        workFlowHistoryArray.push(workflowHistoryObject)
      }
    });
    this.dataProvider.excutionDataBulkSave(this.objectId + "_WorkFlowHistory",
      workFlowHistoryArray, appConstant.couchDBStaticName).then(saveResultResponse => {
        // Work Flow History Save Success
        const response = this.makeResponseObject("Success", updatedWorkFlowStatusObject['statusValue'])
        this.parentPage.bulkApprovalResponse(response)
      }).catch(err => {
        console.log("approveRejectClickAction err => ", err);
        // Work Flow History Save Failed
        const response = this.makeResponseObject("Failed", updatedWorkFlowStatusObject['statusValue'])
          this.parentPage.bulkApprovalResponse(response)
      })
  }

  addSystemAttributes(selectedStatus, fieldId) {
    const systemAttributeObject = {};
    const date = new Date();
    systemAttributeObject['lockedBy'] = this.appUtilityConfig.userId;
    systemAttributeObject['lockedDate'] = date.getTime();
    systemAttributeObject['fieldId'] = fieldId;
    systemAttributeObject['lockedStatus'] = 'INPROGRESS';
    systemAttributeObject['statusWFConfigId'] = selectedStatus["statusWFConfigId"];
    systemAttributeObject['workFlowExecID'] = '' // development
    return systemAttributeObject
  }
  showApprovalDialog(fieldId, defaultStatus, destinationStatusArray?) {
    const dialogConfig = new MatDialogConfig()
    
           if(this.pageType==='VIEW'){
                  let htmlElement: HTMLElement = document.getElementById('cs-dropdown-'+this.layoutId);
                  if(htmlElement) {
                    htmlElement.innerHTML = "";
                  }
                
 const bulkApprovalClassName = 'cs_status_workflow_bulkapproval';
         import(`../components/cs_status_workflow_bulkapproval/${bulkApprovalClassName}.ts`).then(bulkApprovalInstance =>{
            if(bulkApprovalInstance?.['cs_status_workflow_bulkapproval']){
              this.slickgridpopoverservice.appendComponentToElement_View('cs-dropdown-' + this.layoutId,bulkApprovalInstance['cs_status_workflow_bulkapproval'],{
                displayName: this.fieldDisplayName,
                displayType: this.displayType,
                configStyle: "configStyleWeb",
                selectedRecords: this.selectedRecords,
                parent: this,
                statusWorkFlowList: this.statusWorkList,
                previousStatus: defaultStatus,
                callingFrom: 'internal',
                objectName: this.objectId,
                fieldName: this.fieldName,
                fieldId: fieldId,
                selectedItems: destinationStatusArray,
                layoutId:this.layoutId,
                buttonInfo: [
                  {
                    "name": "OK"
                  }
                ],
                parentContext: this,
                type: "Alert"
              })
              setTimeout(()=>{
                window.$(".cs-dropdown-open").jqDropdown("show", [".cs-dropdown"]);
              },100)
            }else{
                console.error('cs_status_workflow_bulkapproval component file is missing')
            }
        }).catch(error=>{
            console.error('cs_status_workflow_bulkapproval component file is missing',error)
        })
               
   }else{
       
    const additionalInfo = {
      displayName: this.fieldDisplayName,
      displayType: this.displayType,
      configStyle: "configStyleWeb",
      selectedRecords: this.selectedRecords,
      parent: this,
      statusWorkFlowList: this.statusWorkList,
      previousStatus: defaultStatus,
      callingFrom: 'internal',
      objectName: this.objectId,
      fieldName: this.fieldName,
      fieldId: fieldId,
      selectedItems: destinationStatusArray,
      layoutId:this.layoutId,
      actionType: "WORK FLOW"
  
     }
     const bulkApprovalClassName = 'cs_status_workflow_bulkapproval';
     import(`../components/cs_status_workflow_bulkapproval/${bulkApprovalClassName}.ts`).then(bulkApprovalInstance =>{
        if(bulkApprovalInstance?.['cs_status_workflow_bulkapproval']){
          this.cspfmOnDemandFeature.appendComponentToElement('cs-dropdown-' + this.
                  layoutId, bulkApprovalInstance['cs_status_workflow_bulkapproval'], this.slickGridArgs, additionalInfo);
        }else{ 
            console.error('cs_status_workflow_bulkapproval component file is missing')
        }
    }).catch(error=>{
        console.error('cs_status_workflow_bulkapproval component file is missing',error)
    })
   }
  

  }

  updateStatusAction(data) {
    const selectedStatus = data["selectedStatus"]
    const selectedRecords = data["selectedRecords"]
    const fieldId = data["fieldId"]
    const workFlowFieldName = data["workFlowFieldName"]
    const objectId = data["objectId"]
    const isApproveInitiateEnabled = selectedStatus["isApproveInitiateEnabled"]
    const statusType = selectedStatus["statusType"]
    const comments = data["comments"]
    if (statusType === 'Approved' || statusType === 'Reject') {
      // Save WorkFlowExecutionDB
      this.validateUserForApproval(selectedRecords).then(res => {
        if (res['status'] === "Failed") {
          const response = {
            "status": "Failed",
            "message" : res['message']
          }
          this.parentPage.bulkApprovalResponse(response)
        } else { // Success
          this.saveWorkFlowExecutionDB(selectedStatus, comments)
        }
      })
    } else if (isApproveInitiateEnabled === 'Y') {
      const systemAttributeObject = this.addSystemAttributes(selectedStatus, fieldId)
      // Add this systemAttributeObject and status in selectedRecords and save it
      // After save success, Save WorkFlowHistoryObject
      this.saveBulkRecords(selectedRecords, selectedStatus['statusValue'], comments, systemAttributeObject)
    } else if (isApproveInitiateEnabled === 'N') {
      // Update the status in selectedRecords and save it.
      // After save success, Save WorkFlowHistoryObject
      this.saveBulkRecords(selectedRecords, selectedStatus['statusValue'], comments)
    }
  }

  makeDestinationStatusArray(detinationStatus, statusWorkFlowList) {
    const destinationStatusWorkFlowList = []
    detinationStatus.forEach(detinationStatusValue => {
      const statusArray = statusWorkFlowList[detinationStatusValue]
      const statusObject = statusArray[0]
      destinationStatusWorkFlowList.push(statusObject)
    });
    return destinationStatusWorkFlowList
  }

  validateUserForApproval(selectedRecords) {
    this.filteredApproverRecord = []
    let systemattributeAvailable = true
    selectedRecords.forEach(recordDataObject => {
      if (!recordDataObject['systemAttributes'] || recordDataObject['systemAttributes']['workFlowExecID'] === '') {
        systemattributeAvailable = false;
      }
    });
    if (!systemattributeAvailable) {
      const response = {
        "status": "Failed",
        "message" : "Workflow initiate is processing for some records.Please try again..."
      }
      this.parentPage.bulkApprovalResponse(response)
      return
    }
    const workFlowExecIDs = []
    const statusWFConfigIds = []
    selectedRecords.forEach(element => {
      workFlowExecIDs.push(element.systemAttributes.workFlowExecID)
      statusWFConfigIds.push(element.systemAttributes.statusWFConfigId)
    })
    const taskApprovalList = [];
    taskApprovalList.push(this.fetchExecutionData
      (workFlowExecIDs, statusWFConfigIds, selectedRecords, this.executionDbConfigObject, "CouchDB").then(taskRes => {
        
        return taskRes
      }))
    return Promise.all(taskApprovalList).then(result => {
      return result[0]
    })
  }
  

  fetchWorkFlowHistoryData(selectedRecords, objectId, objectName, fieldName, comments, status, isMultiline?) {
    const referenceids =[]
    selectedRecords.forEach(element => {
      referenceids.push(element.id)
    })
    const workFlowHistoryHierarchyJSON = {
      "objectId": this.executionDbConfigObject.workFlowHistoryObject,
      "objectName": this.executionDbConfigObject.workFlowHistoryObject,
      "fieldId": 0,
      "objectType": "PRIMARY",
      "relationShipType": null,
      "childObject": []
    };
    const query = "type:" + objectId + "_WorkFlowHistory" + " AND " +
     "referenceid: ( " + referenceids.join(" ") + " ) " + " AND " + "fieldName:" + fieldName
    const dataFetchInput = {
      "query": query,
      "dataSource": appConstant.couchDBStaticName,
      "objectHierarchyJSON": workFlowHistoryHierarchyJSON
    }
    this.dataProvider.executionDBDataFetching(dataFetchInput).then(result => {
      if (result && result.status === 'SUCCESS') {
        const historyRecords = result['records']//swf
        if(isMultiline){
          this.saveWorkflowHistoryForMultiline(selectedRecords, historyRecords, fieldName, objectId)
        } else {
          const updatedStatus = this.statusWorkList[status]
          const updatedWorkFlowStatusObject = updatedStatus[0]
          this.saveWorkFlowHistory(selectedRecords, historyRecords, comments, updatedWorkFlowStatusObject)
        }
      } else {
        const response = this.makeResponseObject("Failed", status)
        this.parentPage.bulkApprovalResponse(response)
      }
    })
  }
  
  makeResponseObject(responsestatus, updatedWorkFlowStatus) {
    let message = "";
    if (responsestatus === 'Success') {
       message = this.workFlowMappingDetails[updatedWorkFlowStatus] + " is completed successfully."
    } else {
      message = this.workFlowMappingDetails[updatedWorkFlowStatus] + " is failed."
    }
    const response = {
      "status": responsestatus,
      "message" : message,
      'childObject':this.childObject
    }
    return response;
  }
public filteredApproverRecord = []
  fetchExecutionData(workFlowIds, statusConfigIds, recordArray, executionDbConfigObject, dataSource) {
    const pfmApproveUserStatusHierarchyJSON = {
      "objectId": executionDbConfigObject.workFlowUserApprovalStatusObject,
      "objectName": executionDbConfigObject.workFlowUserApprovalStatusObject,
      "fieldId": 0,
      "objectType": "PRIMARY",
      "relationShipType": null,
      "childObject": []
    };
    const query = "type:" + executionDbConfigObject.workFlowUserApprovalStatusObject +
      " AND " + "workflowExectionId: ( " + workFlowIds.join(" ")
      + " ) AND " + "statusWFConfigId: ( " + statusConfigIds.join(" ") + " )"
    const dataFetchInput = {
      "query": query,
      "dataSource": dataSource,
      "objectHierarchyJSON": pfmApproveUserStatusHierarchyJSON
    }
    const approverArray = []
    return this.dataProvider.executionDBDataFetching(dataFetchInput).then(result => {
      if (result && result.status === 'SUCCESS') {
        if (result['records'].length > 0) {
          const executionDataAry = result['records'];
          executionDataAry.forEach(element => {
            const currentApprovalLevel = element['currentApprovalLevel']
            const approvalStatusAry = element['approvalStatus']
            if (element["approvalType"] === "HIERARCHICAL") {
              const userId = this.appUtilityConfig.userId
              const approverDataFilter = lodash.filter(approvalStatusAry, function (approverObj) {
                return (approverObj['userId'] === userId);
              })
           
              
              let userValidation = {}
              userValidation["approvalType"] = "HIERARCHICAL"
              if (approverDataFilter.length > 0) {
                // IS VALID APPROVER
                userValidation["isApprover"] = true
                // Check Logged user as Current User Level
                const eligibleActionArray = lodash.filter(approverDataFilter, function (eligibleActionObject) {
                  return (eligibleActionObject['userLevel'] === currentApprovalLevel && eligibleActionObject['approvalExecutionStatus']==='');
                })
                if (eligibleActionArray.length > 0) {
                  userValidation["eligibleAction"] = true
                  userValidation['workflowExectionId'] =  element['workflowExectionId']
                 
                } else {
                  userValidation["eligibleAction"] = false
                  userValidation["message"] = "Waiting for another user, to approve this action"
                }
                approverArray.push(userValidation)
              } else {
                // NOT AN APPROVER
                userValidation["isApprover"] = false
                userValidation["eligibleAction"] = false
                userValidation["message"] = "Selected records are not eligible to you for approval action"
                approverArray.push(userValidation)
              }
            } else if (element["approvalType"] === "PARALLEL") {
              const userId = this.appUtilityConfig.userId
              const approverDataFilter = lodash.filter(approvalStatusAry, function (approverObj) {
                return (approverObj['userId'] === userId);
              })
              let userValidation = {}
              userValidation["approvalType"] = "PARALLEL"
              if (approverDataFilter.length > 0) {
                // IS VALID APPROVER
                userValidation["isApprover"] = true
                // Check Logged user is ApprovalExecutionStatus as APPROVED or REJECT
                const eligibleActionArray = lodash.filter(approverDataFilter, function (eligibleActionObject) {
                  return (
                   eligibleActionObject['approvalExecutionStatus'] === '');
                })
                if (eligibleActionArray.length > 0) {
                  userValidation["eligibleAction"] = true
                  userValidation['workflowExectionId'] =  element['workflowExectionId']
                } else {
                  userValidation["eligibleAction"] = false
                  userValidation["message"] = "Waiting for another user, to approve this action"
                }
                approverArray.push(userValidation)
              } else {
                // NOT AN APPROVER
                userValidation["isApprover"] = false
                userValidation["eligibleAction"] = false
                userValidation["message"] = "Selected records are not eligible to you for approval action"
                approverArray.push(userValidation)
              }
            } else if (element["approvalType"] === "SINGLE") {
              const userId = this.appUtilityConfig.userId
              const approverDataFilter = lodash.filter(approvalStatusAry, function (approverObj) {
                return (approverObj['userId'] === userId && approverObj['approvalExecutionStatus']==='');
              })
              let userValidation = {}
              userValidation["approvalType"] = "SINGLE"
              if (approverDataFilter.length > 0) {
                // IS VALID APPROVER
                userValidation["isApprover"] = true
                userValidation["eligibleAction"] = true
                 userValidation['workflowExectionId'] =  element['workflowExectionId']
                approverArray.push(userValidation)
              } else {
                // NOT AN APPROVER
                userValidation["isApprover"] = false
                userValidation["eligibleAction"] = false
                userValidation["message"] = "Selected records are not eligible to you for approval action"
                approverArray.push(userValidation)
              }
            }
          });
          const recordDataFilter = lodash.filter(approverArray, function (selectedObject) {
            return (selectedObject['isApprover'] === true);
          })
          if (recordDataFilter.length > 0) { // Approver
            const eligibleArray = lodash.filter(recordDataFilter, function (selectedObject) {
              return (selectedObject['eligibleAction'] === true);
            })
            const executionIdList = lodash.filter(approverArray, function (selectedObject) {
              return (selectedObject['isApprover'] === true && selectedObject['workflowExectionId']);
            })
        
            if (executionIdList.length > 0) { // Approver
              for(let i=0;i<recordArray.length;i++){
                for(let j=0;j<executionIdList.length;j++){
                  if(recordArray[i]['systemAttributes']['workFlowExecID']===executionIdList[j]['workflowExectionId']){
                    this.filteredApproverRecord.push(recordArray[i])
                  }
                }
              }
            }
            if (eligibleArray.length > 0) { // Approval Eligible Action
              return {
                "status": "Success",
                "message": "Proceed save"
              }
            } else {
              return {
                "status": "Failed",
                "message": "Waiting for another user, to approve this action"
              }
            }
          } else { // Non Approver
            return {
              "status": "Failed",
              "message": "Selected records are not eligible to you for approval action"
            }
          }
        } else {
          return {
            "status": "Failed",
            "message": "Selected records are not eligible to you for approval action"
          }
        }
      } else {
        return {
          "status": "Failed",
          "message": "Selected records are not eligible to you for approval action"
        }
      }
    })
  }


  fetchWorkFlowUserBulkApprovalStatus(selectedRecordbject, statusReviewObject, executionDbConfigObject, dataSource, comments) {
    const pfmApproveUserStatusHierarchyJSON = {
      "objectId": executionDbConfigObject.workFlowUserApprovalStatusObject,
      "objectName": executionDbConfigObject.workFlowUserApprovalStatusObject,
      "fieldId": 0,
      "objectType": "PRIMARY",
      "relationShipType": null,
      "childObject": []
    };
    const query = "type:" + executionDbConfigObject.workFlowUserApprovalStatusObject +
      " AND " + "workflowExectionId:" + Number(selectedRecordbject['systemAttributes']['workFlowExecID'])
      + " AND " + "statusWFConfigId:" + Number(selectedRecordbject['systemAttributes']['statusWFConfigId'])
    const dataFetchInput = {
      "query": query,
      "dataSource": dataSource,
      "objectHierarchyJSON": pfmApproveUserStatusHierarchyJSON
    }
    return this.dataProvider.executionDBDataFetching(dataFetchInput).then(result => {
      if (result && result.status === 'SUCCESS') {
        if (result['records'].length > 0) {
          const approvalStatusList = result['records'][0]['approvalStatus']
          const WorkFlowUserApprovalStatusDataObject = result['records'][0];
          const loggedUserStatus = approvalStatusList.filter(userDataObject => userDataObject.userId === this.appUtilityConfig.userId);
          WorkFlowUserApprovalStatusDataObject['lastModifiedBy'] = this.appUtilityConfig.userId
          const userObjectList = WorkFlowUserApprovalStatusDataObject['approvalStatus'].
            filter(userDataObject => userDataObject.userId === this.appUtilityConfig.userId);
          // Users should not allow to modify status workflow configuration while approval process is triggered.
          if (userObjectList.length === 0) {
            return undefined
          }
          const userObject = userObjectList[0]
          userObject['userId'] = this.appUtilityConfig.userId
          userObject['userName'] = this.appUtilityConfig.loggedUserName
          userObject['statusValue'] = statusReviewObject['statusValue']
          userObject['statusType'] = statusReviewObject['statusType']
          userObject['statusLabel'] = statusReviewObject['statusLabel']
          userObject['approvalExecutionStatus'] = "INPROGRESS"
          userObject['execStatusMessage'] = ""
          userObject['comment'] = ""
          userObject['userComment'] = comments
          return WorkFlowUserApprovalStatusDataObject
        }
      } else {
        return undefined
      }
    })
  }
}
