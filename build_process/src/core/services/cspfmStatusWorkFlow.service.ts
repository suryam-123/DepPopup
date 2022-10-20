import { Injectable } from '@angular/core';
import { cspfmExecutionPouchDbProvider } from '../db/cspfmExecutionPouchDbProvider';
import { metaDbConfiguration } from '../db/metaDbConfiguration';
import { appUtility } from '../utils/appUtility';
import { metaDataDbProvider } from '../db/metaDataDbProvider';
import { DatePipe } from '@angular/common';
import { dataProvider } from '../utils/dataProvider';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
import * as lodash from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class cspfmStatusWorkFlowService {

  constructor(private cspfmExecutionPouchDbProviderObject: cspfmExecutionPouchDbProvider, private metaDbConfigurationObject: metaDbConfiguration, 
    private appUtilityConfig: appUtility, private metaDataDbProviderObject: metaDataDbProvider, public dataProvider: dataProvider,
    private datePipe: DatePipe,
    public metaDbConfig: metaDbConfiguration,
    public cspfmMetaCouchDbProvider : cspfmMetaCouchDbProvider) { }

  checkLoggedUserIsApprover(selectedObject, fieldIdValue): Promise<{}> {
    if (!selectedObject || !fieldIdValue) {
      return Promise.resolve({ staus: true, approverType: "", fieldId: "" });
    }

    if (selectedObject.hasOwnProperty('systemAttributes')) {
      const obj = selectedObject['systemAttributes']
      if (obj['fieldId'] !== fieldIdValue) {
        return Promise.resolve({ staus: false, approverType: "", fieldId: fieldIdValue });
      }
      if (obj['lockedStatus'] === 'INPROGRESS') {

        const pfmApproveUserHierarchyJSON = {
          "objectId": this.metaDbConfigurationObject.pfmApproveValueUserObject,
          "objectName": this.metaDbConfigurationObject.pfmApproveValueUserObject,
          "fieldId": 0,
          "objectType": "PRIMARY",
          "relationShipType": null,
          "childObject": [

          ]
        };

        const options = {};
        const selector = {}
        selector['data.type'] = this.metaDbConfigurationObject.pfmApproveValueUserObject
        selector['data.user_id'] = Number(this.appUtilityConfig.userId);
        selector['data.field_id'] = Number(fieldIdValue)
        selector['data.status_wf_config_id'] = Number(obj['statusWFConfigId'])
        selector['data.is_active'] = true
        options['selector'] = selector;
        pfmApproveUserHierarchyJSON['options'] = options;

        return this.metaDataDbProviderObject.fetchDataWithReference(pfmApproveUserHierarchyJSON).then(result => {
          if (result && result.status === 'SUCCESS') {

            if (result.records.length === 0) {
              return Promise.resolve({ staus: false, approverType: "non approver", fieldId: fieldIdValue });
            } else {
              return Promise.resolve({ staus: true, approverType: "approver", fieldId: fieldIdValue });
            }
          } else {
            console.log("result = ", result);
          }
        }).catch(err => {
        });
      } else {
        return Promise.resolve({ staus: true, approverType: "", fieldId: fieldIdValue });
      }
    } else {
      return Promise.resolve({ staus: true, approverType: "", fieldId: fieldIdValue });
    }
  }

  fetchWorkFlowUserApprovalStatusObject(selectedObject, executionDbConfigObject, dbServiceProvider) {

    const pfmApproveUserStatusHierarchyJSON = {
      "objectId": executionDbConfigObject.workFlowUserApprovalStatusObject,
      "objectName": executionDbConfigObject.workFlowUserApprovalStatusObject,
      "fieldId": 0,
      "objectType": "PRIMARY",
      "relationShipType": null,
      "childObject": [

      ]
    };
    const options = {};
    const selector = {}
    selector['data.type'] = executionDbConfigObject.workFlowUserApprovalStatusObject
    selector['data.workflowExectionId'] = Number(selectedObject['systemAttributes']['workFlowExecID'])
    selector['data.statusWFConfigId'] = Number(selectedObject['systemAttributes']['statusWFConfigId'])

    options['selector'] = selector;

    pfmApproveUserStatusHierarchyJSON['options'] = options;
    const query = "type:" + executionDbConfigObject.workFlowUserApprovalStatusObject +
      " AND " + "workflowExectionId:" + selectedObject['systemAttributes']['workFlowExecID']
      + " AND " + "statusWFConfigId:" + selectedObject['systemAttributes']['statusWFConfigId']
    const dataFetchInput = {
      "objectHierarchyJSON": pfmApproveUserStatusHierarchyJSON,
      "query": query,
      "dataSource": dbServiceProvider
    }
    return this.dataProvider.executionDBDataFetching(dataFetchInput).then(result => {
      if (result && result.status === 'SUCCESS') {

        let returnData = {
          WorkFlowUserApprovalStatusDataObject: '',
          cscomponentactionInfo: {

          },
          executionInfoDetail: {}
        };
        if (result['records'].length > 0) {
          const data = result['records'][0];
          const approvalStatusList = result['records'][0]['approvalStatus']
          if (data['approvalType'] && data['approvalType'].toLowerCase() === 'hierarchical') {
            returnData['approvalType'] = 'hierarchical'
          }else {
            returnData['approvalType'] = ''
          }
          returnData['WorkFlowUserApprovalStatusDataObject'] = result['records'][0];
          let loggedUserStatus = approvalStatusList.filter(userDataObject => userDataObject.userId === this.appUtilityConfig.userId);


          if (loggedUserStatus.length > 0) {
            returnData['cscomponentactionInfo']['workflowApproveStatusObject'] = loggedUserStatus[0]
          } else {
            returnData['cscomponentactionInfo']['workflowApproveStatusObject'] = ""
          }
        } else {
          returnData['approvalType'] = ''
          returnData['cscomponentactionInfo']['workflowApproveStatusObject'] = ""
        }
        returnData['executionInfoDetail'] = (returnData['cscomponentactionInfo'] !== undefined
          && returnData['cscomponentactionInfo'] !== null) ? returnData['cscomponentactionInfo'] : "";

        return returnData;
      } else {
        console.log("result = ", result);
      }
    }).catch(err => {

    });
  }


  setExecutionData(selectedObject, fieldIdValue, data: { cscomponentactionInfo: any, executionInfoDetail: any, executionDbConfigObject: any, approverType: any, selectedStatus: any, dbServiceProvider: any }) {
    if (selectedObject['systemAttributes']
      && selectedObject['systemAttributes']['lockedStatus'] === 'INPROGRESS') { 
        
        const obj = selectedObject['systemAttributes']
      if (obj['fieldId'] !== fieldIdValue) {
        data['approverType'] = ''
        return
      }
      data['cscomponentactionInfo']['executionId'] = selectedObject['systemAttributes']['workFlowExecID']

      if (selectedObject['systemAttributes']['workFlowExecID'] !== "") {
        return this.fetchWorkFlowUserApprovalStatusObject(selectedObject, data['executionDbConfigObject'], data['dbServiceProvider']).then(res => {
          var excutionData = res['WorkFlowUserApprovalStatusDataObject']
          if (res['cscomponentactionInfo'] && res['cscomponentactionInfo']['workflowApproveStatusObject']) {


            if (excutionData['approvalType'] && excutionData['approvalType'].toLowerCase() === 'hierarchical' &&
              res['cscomponentactionInfo']['workflowApproveStatusObject']['userLevel'] !== excutionData['currentApprovalLevel']) {
              data['approverType'] = "non approver"
            }else {
              data['approverType'] = "approver"
            }
          } else {
            data['approverType'] = "non approver"
          }
          Object.assign(data, res)
          let approvalDetails = this.setApproveProcessStatus(data['approverType'], data['executionInfoDetail'], data['selectedStatus'], data['approvalType'])
          Object.assign(res, approvalDetails)
          return res;
        })
      } else {
        data['executionInfoDetail'] = (data['cscomponentactionInfo'] !== undefined
          && data['cscomponentactionInfo'] !== null) ? data['cscomponentactionInfo'] : "";

          data['approverType'] = 'non approver'
          let approvalDetail = this.setApproveProcessStatus(data['approverType'], data['executionInfoDetail'], data['selectedStatus'], data['approvalType'])
        return Promise.resolve(approvalDetail)
      }
    } else {
      return Promise.resolve({})
    }
  }

  fetchWorkFlowUserApprovalStatus(selectedObject, executionDbConfigObject, WorkFlowUserApprovalStatusDataObject, cscomponentactionInfo, executionInfoDetail, selectedStatus, approverType, dbServiceProvider) {
    return this.fetchWorkFlowUserApprovalStatusObject(selectedObject, executionDbConfigObject, dbServiceProvider).then(res => {
      WorkFlowUserApprovalStatusDataObject = res['WorkFlowUserApprovalStatusDataObject']
      var data = res['WorkFlowUserApprovalStatusDataObject']  
      if (res['cscomponentactionInfo'] && res['cscomponentactionInfo']['workflowApproveStatusObject']) {
        if (data['approvalType'] && data['approvalType'].toLowerCase() === 'hierarchical' &&
          res['cscomponentactionInfo']['workflowApproveStatusObject']['userLevel'] !== data['currentApprovalLevel']) {
          approverType = "non approver"
        }else {
          approverType = "approver"
        }

      } else {
        approverType = "non approver"
      }
      cscomponentactionInfo['workflowApproveStatusObject'] = res['cscomponentactionInfo']['workflowApproveStatusObject']
      executionInfoDetail = res['executionInfoDetail']
      res['approverType'] = approverType;
      let approvalDetails = this.setApproveProcessStatus(approverType, executionInfoDetail, selectedStatus, res['approvalType'])
      Object.assign(res, approvalDetails)
      return res;
    })
  }

  setApproveProcessStatus(approverType, executionInfoDetail, selectedStatus, approvalType) {
    let approvalDetail = {
      approveActionMessage: "",
      allowApproveAction: false
    }
    if (approverType === 'non approver' && executionInfoDetail['workflowApproveStatusObject'] === '') {
      if (selectedStatus && selectedStatus['statusType'].toLowerCase() === 'approved'){
        approvalDetail['approveActionMessage'] = 'Next workflow process initiated'
      } else{
        approvalDetail['approveActionMessage'] = 'Workflow process initiated'
      }
    } else if (executionInfoDetail['executionId'] === "") {
      approvalDetail['allowApproveAction'] = false;
      approvalDetail['approveActionMessage'] = 'Workflow process initiated'
    } else if (approvalType === 'hierarchical' && approverType === 'non approver' && executionInfoDetail['workflowApproveStatusObject'] &&
      executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === '') {

      approvalDetail['approveActionMessage'] = 'Workflow process initiated'
    } else if (executionInfoDetail['executionId'] !== ""
      && executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === '') {
      approvalDetail['allowApproveAction'] = true;
      approvalDetail['approveActionMessage'] = '';
    } else if (executionInfoDetail['executionId'] !== ""
      && executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === 'INPROGRESS') {
      approvalDetail['allowApproveAction'] = false;
      approvalDetail['approveActionMessage'] = 'Approve inprogress';
    } else if (executionInfoDetail['executionId'] !== ""
      && executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === 'ERROR') {
      approvalDetail['allowApproveAction'] = true;
      alert(executionInfoDetail['workflowApproveStatusObject']['comment'])
      approvalDetail['approveActionMessage'] = '';
    } else if ((executionInfoDetail['executionId'] !== ""
      && executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === 'APPROVED') || (executionInfoDetail['executionId'] !== ""
        && executionInfoDetail['workflowApproveStatusObject']['approvalExecutionStatus'] === 'REJECT')) {
      approvalDetail['allowApproveAction'] = false;

      approvalDetail['approveActionMessage'] = executionInfoDetail['workflowApproveStatusObject']['comment'];
    }

    return approvalDetail;
  }

  fetchLockedUserDetail(data) {
    var systemAttributes = data['systemAttributes']
    var userId = systemAttributes['lockedBy']
    var date = new Date(systemAttributes['lockedDate']);
    if (navigator.onLine) {
      const query = "type: " + this.metaDbConfig.corUsersObject + " AND " + "user_id: " + Number(userId);
      const corUsersObjectHierarchyJSON = {
        "objectId": this.metaDbConfig.corUsersObject,
        "objectName": this.metaDbConfig.corUsersObject,
        "fieldId": 0,
        "objectType": "PRIMARY",
        "relationShipType": null,
        "childObject": []
      };
      return this.cspfmMetaCouchDbProvider.fetchRecordsBySearchFilterPhrases(query,
        corUsersObjectHierarchyJSON).then(corUserResult => {
          if (corUserResult.status !== 'SUCCESS' ||
            (corUserResult.status === 'SUCCESS' && corUserResult['records'].length === 0)) {
            return {
              lockedUser: userId,
              lockedDate: this.datePipe.transform(date, this.appUtilityConfig.userDateTimeFormat)
            }
          }
          return {
            lockedUser: corUserResult['records'][0]['first_name'],
            lockedDate: this.datePipe.transform(date, this.appUtilityConfig.userDateTimeFormat)
          }
        }).catch(err => {
          return {
            lockedUser: userId,
            lockedDate: this.datePipe.transform(date, this.appUtilityConfig.userDateTimeFormat)
          }
        });
    } else {
      return this.metaDataDbProviderObject.getUserNameAgainstUserId(userId).then(corUserResult => {
        if (corUserResult.status !== 'SUCCESS' ||
          (corUserResult.status === 'SUCCESS' && corUserResult['records'].length === 0)) {
          return {
            lockedUser: userId,
            lockedDate: this.datePipe.transform(date, this.appUtilityConfig.userDateTimeFormat)
          }
        }
        return {
          lockedUser: corUserResult['records'][0]['first_name'],
          lockedDate: this.datePipe.transform(date, this.appUtilityConfig.userDateTimeFormat)
        }
      }).catch(er => {
        return {
          lockedUser: userId,
          lockedDate: this.datePipe.transform(date, this.appUtilityConfig.userDateTimeFormat)
        }
      })
    }
  }
  handleSelectedObjectValue(selectedObject, objectId){
    let childobjects = Object.keys(selectedObject).filter(key => key.startsWith('pfm') && key.endsWith('s'))
    let result;
    childobjects.forEach(childobj => {
      if(selectedObject[childobj].length > 0){
      if(selectedObject[childobj][0]['type'] === objectId){
        result = selectedObject[childobj][0];
      } else if(!result) {
        result =  this.handleSelectedObjectValue(selectedObject[childobj][0], objectId);
      }
    }
    })
    return result;
  }

  callHistoryRecord(selectedObject, fieldName, dbServiceProvider, objectName?) {

    if(objectName && objectName !== selectedObject['type']){
      selectedObject = this.handleSelectedObjectValue(selectedObject, objectName);
    }
    if(!selectedObject){
      return Promise.resolve('')
    }

    const pfmApproveUserStatusHierarchyJSON = {
      "objectId": "WorkFlowHistory",
      "objectName": "WorkFlowHistory",
      "fieldId": 0,
      "objectType": "PRIMARY",
      "relationShipType": null,
      "childObject": []
    };
    let objectId = objectName ? objectName : selectedObject['type'];
    var query = "type:" + objectId + "_WorkFlowHistory" + " AND " + "fieldName:" + fieldName + " AND " + "referenceid:" + selectedObject['id']

    const dataFetchInput = {

      "query": query,
      "dataSource": dbServiceProvider,
      "objectHierarchyJSON": pfmApproveUserStatusHierarchyJSON
    }
    return this.dataProvider.executionDBDataFetching(dataFetchInput).then(res => {
      if (res['status'] !== "SUCCESS" ||
        (res['status'] === "SUCCESS" && res['records'].length === 0)) {
          return ''
      }else{
        return res['records'][0]
      }

    })
  }
  

  fetchWorkFlowUserApprovalStatusByWorkFlowExeId(workflowExecutionId,  dbServiceProvider) {

    const pfmApproveUserStatusHierarchyJSON = {
      "objectId": "WorkFlowUserApprovalStatus",
      "objectName": "WorkFlowUserApprovalStatus",
      "fieldId": 0,
      "objectType": "PRIMARY",
      "relationShipType": null,
      "childObject": [

      ]
    };
    const options = {};
    const selector = {}
    selector['data.type'] = "WorkFlowUserApprovalStatus"
    selector['data.workflowExectionId'] = Number(workflowExecutionId)
   // selector['data.statusWFConfigId'] = Number(selectedObject['systemAttributes']['statusWFConfigId'])

    options['selector'] = selector;

    pfmApproveUserStatusHierarchyJSON['options'] = options;
    const query = "type:" + 'WorkFlowUserApprovalStatus' +
      " AND " + "workflowExectionId:" + workflowExecutionId
      // + " AND " + "statusWFConfigId:" + selectedObject['systemAttributes']['statusWFConfigId']
    const dataFetchInput = {
      "objectHierarchyJSON": pfmApproveUserStatusHierarchyJSON,
      "query": query,
      "dataSource": dbServiceProvider
    }
    return this.dataProvider.executionDBDataFetching(dataFetchInput).then(result => {
      if (result && result.status === 'SUCCESS') {
        if (result['records'].length > 0) {
         return result['records'][0];
        }else{
          return '';
        }
      } else {
        return '';
      
      }
    }).catch(err => {

    });
  }
}
