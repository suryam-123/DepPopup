import { Injectable } from "@angular/core";
import { Column } from 'angular-slickgrid';
import { FieldInfo } from 'src/core/pipes/cspfm_data_display';
import { appConstant } from './appConstant';
import { DatePipe } from '@angular/common';
import { appUtility } from './appUtility';
import { dataProvider } from "src/core/utils/dataProvider";
import * as lodash from "lodash";
import { metaDataDbProvider } from "../db/metaDataDbProvider";
import { attachmentCouchDbProvider } from '../db/attachmentCouchDbProvider';
import { cspfmLayoutConfiguration } from '../pfmmapping/cspfmLayoutConfiguration';
import { couchdbProvider } from "../db/couchdbProvider";
import * as moment from 'moment';

@Injectable({
  providedIn: "root"
})
export class cspfmCustomFieldProvider {

  constructor(private datePipe: DatePipe, private appUtilityConfig: appUtility, public dataProvider: dataProvider, public metaDataDbProvider: metaDataDbProvider,public cspfmLayoutConfig: cspfmLayoutConfiguration,public attachmentCouchDbObject: attachmentCouchDbProvider,public couchdbProviderObject:couchdbProvider) {

  }
  attachmentAndDocumentInfo(objectIds, layoutId, actionElementId, dataObject) {
    let taskList = [];
    objectIds.forEach(element => {
      const queryFlags = { 'include_docs': true, 'include_fields': false };
      const fileManageObject = this.cspfmLayoutConfig['layoutConfiguration'][layoutId]['fileManageInfo'][actionElementId][element];
      const traversalPath = fileManageObject['traversalPath'];
      const involvedDocumentIds = fileManageObject['involvedDocumentIds'];
      if (fileManageObject['isFormulaForAttachmentEnable'] === true) {
        const query = 'type:' + element + 'att' + ' AND ' + element + ':' + dataObject[traversalPath].id + ' AND ' + 'status:finished' + ' AND ' + 'isRemoved:' + false;
        taskList.push(this.attachmentCouchDbObject.callSearchDesignDocs(query, 'filemanage_search', '', queryFlags).then((response) => {
          if (response && response['rows'] && response['rows'].length > 0) {
            const convertToRecords = this.couchdbProviderObject.handleGlobalSearchResponse(response['rows']);
            let fileSizeOfAttachment = lodash.sumBy(convertToRecords, 'file_size');
            let sizeOfAttachemntToMb = parseFloat((fileSizeOfAttachment/ 1024).toFixed(2));
            dataObject[traversalPath]['cspfm_countOfAttachment'] = convertToRecords.length;
            dataObject[traversalPath]['cspfm_fileSizeOfAttachment'] = sizeOfAttachemntToMb;
          } else {
            dataObject[traversalPath]['cspfm_countOfAttachment'] = 0;
            dataObject[traversalPath]['cspfm_fileSizeOfAttachment'] = 0;
          }
          return dataObject;
        }));
      } else {
        return dataObject;
      }
      if (fileManageObject['isFormulaForDocumentEnable'] === true) {
        if (involvedDocumentIds.length > 0) {
          const query = 'type:' + element + 'doc' + ' AND ' + element + ':' + dataObject[traversalPath].id + ' AND ' + 'document_config_id:(' + involvedDocumentIds.join(' ') + ')' + ' AND ' + 'status:finished' + ' AND ' + 'isRemoved:' + false;
          taskList.push(this.attachmentCouchDbObject.callSearchDesignDocs(query, 'filemanage_search', '', queryFlags).then((response) => {
            if (response && response['rows'] && response['rows'].length > 0) {
              const convertToRecords = this.couchdbProviderObject.handleGlobalSearchResponse(response['rows']);
              const documentDetails = lodash.groupBy(convertToRecords, function (arrayObj) { return arrayObj.obj_document_config_id });
              involvedDocumentIds.forEach(documentId => {
                const countofDocument = 'cspfm_countOfDocument_' + documentId;
                const sizeOfDocument = 'cspfm_fileSizeOfDocument_' + documentId;
                if (documentDetails[documentId] && documentDetails[documentId].length > 0) {
                  let fileSizeOfDocument = lodash.sumBy(documentDetails[documentId], 'file_size');
                  let sizeOfDocumentToMb = parseFloat((fileSizeOfDocument / 1024).toFixed(2));
                  dataObject[traversalPath][countofDocument] = documentDetails[documentId].length;
                  dataObject[traversalPath][sizeOfDocument] = sizeOfDocumentToMb;
                } else {
                  dataObject[traversalPath][countofDocument] = 0;
                  dataObject[traversalPath][sizeOfDocument] = 0;
                }
              }
              )
            }
            return dataObject;
          }))
        } else {
          const query = 'type:' + element + 'doc' + ' AND ' + element + ':' + dataObject[traversalPath].id + ' AND ' + 'isRemoved:' + false + ' AND ' + 'status:finished';
          taskList.push(this.attachmentCouchDbObject.callSearchDesignDocs(query, 'filemanage_search', '', queryFlags).then((response) => {
            if (response && response['rows'] && response['rows'].length > 0) {
              const convertToRecords = this.couchdbProviderObject.handleGlobalSearchResponse(response['rows']);
              let fileSizeOfDocument = lodash.sumBy(convertToRecords, 'file_size');
              let sizeOfDocumentToMb = parseFloat((fileSizeOfDocument / 1024).toFixed(2));
              dataObject[traversalPath]['cspfm_countOfDocument'] = convertToRecords.length;
              dataObject[traversalPath]['cspfm_fileSizeOfDocument'] = sizeOfDocumentToMb;
            } else {
              dataObject[traversalPath]['cspfm_countOfDocument'] = 0;
              dataObject[traversalPath]['cspfm_fileSizeOfDocument'] = 0;
            }
            return dataObject
          }))
        }
      } else {
        return dataObject
      }
    }
    )
    return Promise.all(taskList).then(res => {
      return Promise.resolve(dataObject);
    });
  }
  makeSlickGridCustomFields(data: Array<any> | any, columnDefinition: Array<Column>) {
    columnDefinition.forEach(column => {
      if (Array.isArray(data)) {
        if (column['queryField']) {
          this.makeCustomFields(data, column['params']['fieldInfo'], appConstant['customFieldSuffix']['slickgrid']);
        }
      } else {
        if (column['queryField']) {
          this.getCustomFieldValue(data, column['params']['fieldInfo'], appConstant['customFieldSuffix']['slickgrid']);
        }
      }
    })

    return this.handleIdOfResultList(data)
  }

  private makeCustomFields(data: Array<any>, fieldInfo: FieldInfo | "", customFieldSuffix: string) {
    data.forEach(item => {
      this.getCustomFieldValue(item, fieldInfo, customFieldSuffix)
    })
  }

  private getCustomFieldValue(data, fieldInfo: FieldInfo | "", customFieldSuffix: string) {
    if (fieldInfo === "") {
      return;
    }
    if (data[fieldInfo["fieldName"]] === null || data[fieldInfo["fieldName"]] === undefined) {
      if (typeof data == 'object') {
        data[fieldInfo["fieldName"] + customFieldSuffix] = null
      }
      return;
    }
    if (fieldInfo["fieldType"] === "DATE") {
      if (data[fieldInfo["fieldName"]]) {
        if (fieldInfo['isDateConversionNeeded']) {
          data[fieldInfo["fieldName"] + customFieldSuffix] = this.datePipe.transform(data[fieldInfo["fieldName"]], appConstant.orgTimeZoneDateFormat, this.appUtilityConfig.userZoneOffsetValue)
        } else {
          data[fieldInfo["fieldName"] + customFieldSuffix] = this.datePipe.transform(data[fieldInfo["fieldName"]], appConstant.orgTimeZoneDateFormat, this.appUtilityConfig.utcOffsetValue)
        }
      } else {
        data[fieldInfo["fieldName"]] = "";
      }
    } else if (fieldInfo["fieldType"] === "TIMESTAMP") {
      if (typeof data[fieldInfo["fieldName"]] === "number") {
        let userTimeZoneMilliseconds = this.appUtilityConfig.getUserTimeZoneMillisecondsFromUtcTimeZoneMilliSeconds(data[fieldInfo["fieldName"]], 'user')
        data[fieldInfo["fieldName"] + customFieldSuffix] = moment(userTimeZoneMilliseconds).toDate()
      }
    } else if (fieldInfo["fieldType"] === "MULTISELECT" ||
      fieldInfo["fieldType"] === "CHECKBOX") {
      var displayValue = [];
      if (data[fieldInfo["fieldName"]]) {
        const values = data[fieldInfo["fieldName"]];
        if(typeof(values)==='string'){
          let modifiedValue;
          modifiedValue = values.split(','); 
          for (const element of modifiedValue) {
            displayValue.push(fieldInfo["mappingDetails"][element.trim()]);
          }
        } else {
          for (const element of values) {
            displayValue.push(fieldInfo["mappingDetails"][element]);
          }
        }
      }
      if (displayValue.length > 0) {
        data[fieldInfo["fieldName"] + customFieldSuffix] = displayValue.join(", ");
      } else {
        data[fieldInfo["fieldName"] + customFieldSuffix] = "";
      }
    } else if (fieldInfo["fieldType"] === "LOOKUP" || fieldInfo['fieldType'] === "HEADER") {
      if (data[fieldInfo["fieldName"]]) {
        this.getCustomFieldValue(data[fieldInfo["fieldName"]], fieldInfo["child"], customFieldSuffix);
      }
    } else if (fieldInfo["fieldType"] === "MASTERDETAIL") {
      if (data[fieldInfo["fieldName"]] &&
        data[fieldInfo["fieldName"]].length > 0) {
        this.getCustomFieldValue(data[fieldInfo["fieldName"]][0], fieldInfo["child"], customFieldSuffix);
      }
    } else if (fieldInfo["fieldType"] === "RADIO" ||
      fieldInfo["fieldType"] === "DROPDOWN"||
      fieldInfo["fieldType"] === "STATUSWORKFLOW") {
      if (data[fieldInfo["fieldName"]] && data[fieldInfo["fieldName"]] !== "") {
        data[fieldInfo["fieldName"] + customFieldSuffix] = fieldInfo["mappingDetails"][data[fieldInfo["fieldName"]]];
      } else {
        data[fieldInfo["fieldName"] + customFieldSuffix] = "";
      }
    } else if (fieldInfo["fieldType"] === "COMMONLOOKUP") {
      if (data[fieldInfo["fieldName"]] && data[fieldInfo["fieldName"]] !== null) {
        const commonLookUpDropDownKeyValue = data[fieldInfo["commonLookupDropDownKey"]];
        const commonLookUpResultColumn = fieldInfo["commonLookUpMappingDetail"][commonLookUpDropDownKeyValue];
        const commonLookupObject = data[fieldInfo["fieldName"]]
        const commonLookupValue  = commonLookupObject[commonLookUpResultColumn["field"]]
        data[fieldInfo["fieldName"] + customFieldSuffix] = commonLookupValue
      } else {
        data[fieldInfo["fieldName"] + customFieldSuffix] = "";
      }
    }
  }

  handleIdOfResultList(data) {
    var index = 0
    if (Array.isArray(data)) {
      let tempDataArray = []
      data.forEach(item => {

        // Coruser records have 'created_by' key and dynamic object records have 'createdby' key. 
        // By these keys here we have identified the record is coruser record or dynamic object record.
        if(item['type'] && !item['created_by']) {  
          let tableStructure = this.dataProvider.tableStructure()
          let tempData = JSON.parse(JSON.stringify(tableStructure[item['type']]));
          item = lodash.extend({}, tempData, item)
        } else if(item['type'] && item['created_by']) {
          let tableStructure = this.metaDataDbProvider.tableStructure
          let tempData = JSON.parse(JSON.stringify(tableStructure[item['type']]));
          item = lodash.extend({}, tempData, item)
        }

        if(!item['id']) {
          item['id'] = String(index)
          index = index + 1
        }
        tempDataArray.push(item)
      })
      return tempDataArray
    } else if(!data['id']) {
      data['id'] = String(index)
      return data
    }
  } 
}
