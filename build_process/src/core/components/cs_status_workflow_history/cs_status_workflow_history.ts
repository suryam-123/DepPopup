/* 
 *   File: cs_status_workflow_history.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, Input } from "@angular/core";
import { appUtility } from "src/core/utils/appUtility";
import * as lodash from "lodash";
import { DatePipe } from "@angular/common";
import { cspfmStatusWorkFlowService } from "src/core/services/cspfmStatusWorkFlow.service";
import { TranslateService } from '@ngx-translate/core';
declare const $: any;
declare const window: any;
@Component({
  selector: "cs_status_workflow_history",
  templateUrl: "./cs_status_workflow_history.html",
  styleUrls: ["./cs_status_workflow_history.scss"],
})
export class cs_status_workflow_history  {
  approveType = '';
  public dataLoaded: boolean = false;
  public expandCollapseButtonclicked = false;
  public workflowExcutionId;
  public hisDataObj = {};

  public unOrderWorkflowHistoryRecords = [];
  public groupHistoryRecordsByDate = {};
  public historyDateList = [];
  public historyDisplayData = [];
  public approverList = '';
  public historyRecordLength = null;
  public selectedDataObject = '';
  @Input() set selectedObject(label: string) {
    this.dataLoaded = false;
    this.selectedDataObject = label;
    if (this.selectedDataObject && this.workflowFieldName && this.dbProvider && this.objectName) {
      this.callHistory();
    }
  }
  public dbProvider:string = '';
  @Input() set dbServiceProvider(dbProvider: string){
    this.dbProvider = dbProvider
    if (this.selectedDataObject && this.workflowFieldName && this.dbProvider && this.objectName) {
      this.callHistory();
    }
  } 
  fieldLableName
  @Input() set fieldDisplayName(label: string){
    this.fieldLableName =   (label !== undefined && label !== null) ? label : 'Status';
  
    this.translate.get(  this.fieldLableName ).subscribe(res => {
      this.fieldLableName = res;
    });
  }
  public workflowFieldName = '';
  
  @Input() set fieldName(label: string) {
    this.workflowFieldName = label;
    if (this.selectedDataObject && this.workflowFieldName && this.dbProvider && this.objectName) {
      this.callHistory();
    }
  }

  public objectName = ""
  @Input() set objectname(label: string){
    this.objectName = label;
    if (this.selectedDataObject && this.workflowFieldName && this.dbProvider && this.objectName) {
      this.callHistory();
    }
  }
  public approvalType = '';

  constructor(
    public cspfmStatusWorkFlowServiceObject: cspfmStatusWorkFlowService,
    public appUtilityConfig: appUtility,
    public datePipe: DatePipe,
    private readonly translate: TranslateService
  ) {}

 

  makeData() {
    this.historyDisplayData = [];
    this.groupHistoryRecordsByDate = {};
    this.unOrderWorkflowHistoryRecords = [];
    this.expandCollapseButtonclicked = false;

    this.historyDateList = [];

   
    if (!this.hisDataObj) {
      setTimeout(() => {
        window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
      }, 100);
      return;
    }


    if (this.hisDataObj) {
      this.unOrderWorkflowHistoryRecords = lodash.orderBy(
        this.hisDataObj['workFlowHistory'],
        ['updatetime'],
        ['asc']
      );
      this.fetchAndMapApproverList().then((res) => {
        return this.getCurrentIniaitedApproverList().then((result) => {
          return this.groupHistroyRecordsByDateWise();
        });
      });
    }
  }

  callHistory() {
  
    this.historyRecordLength = null;
    
    this.cspfmStatusWorkFlowServiceObject
      .callHistoryRecord(
        this.selectedDataObject,
        this.workflowFieldName,
        this.dbProvider,
        this.objectName
      )
      .then((res) => {
        if (!res)  {
          this.historyRecordLength = [];
          this.dataLoaded = true;
        }
     
        this.hisDataObj = JSON.parse(JSON.stringify(res));
        if (this.hisDataObj && this.hisDataObj['workFlowHistory']) {
          this.historyRecordLength = this.hisDataObj['workFlowHistory'].length;
        } else {
          this.historyRecordLength = [];
        }
        this.makeData();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  fetchAndMapApproverList() {
    var rec = this.unOrderWorkflowHistoryRecords.filter((item) => {
      return (
        (item['statusType'] === 'Approved' || item['statusType'] === 'Reject') &&
        item['workFlowExecID']
      );
    });
    if (rec && rec.length === 0) {
      return Promise.resolve(true);
    }
    const taskList = [];
    for (let i = 0; i < rec.length; i++) {
      taskList.push(this.fetchExecutionData(rec[i]['workFlowExecID'], rec[i]));
    }
    return Promise.all(taskList).then((allRes) => {
      return Promise.resolve(true);
    });
  }

  groupHistroyRecordsByDateWise() {
    for (let i = 0; i < this.unOrderWorkflowHistoryRecords.length; i++) {
      var val = this.prepareDateKeyForMapping(
        this.unOrderWorkflowHistoryRecords[i]['updatetime']
      );
      if (!this.groupHistoryRecordsByDate[val]) {
        this.groupHistoryRecordsByDate[val] = [];
        this.historyDateList.push(val);
        this.groupHistoryRecordsByDate[val].push(this.unOrderWorkflowHistoryRecords[i]);
      } else {
        this.groupHistoryRecordsByDate[val].push(this.unOrderWorkflowHistoryRecords[i]);
      }
    }
    this.makeHistoryDataToDispaly();
  }

  //Method to make create the history popup ui records
  makeHistoryDataToDispaly() {
    for (let i = 0; i < this.historyDateList.length; i++) {
      var historyDate = this.historyDateList[i];
      var histroyRecordsByDateWise = this.groupHistoryRecordsByDate[historyDate];
      histroyRecordsByDateWise = lodash.orderBy(histroyRecordsByDateWise,['updatetime'],['asc']);
      for (let j = 0; j < histroyRecordsByDateWise.length; j++) {
        histroyRecordsByDateWise[j]['buttonClicked'] = false;
        if (i === 0 && j === 0) {
          histroyRecordsByDateWise[j]['date'] = historyDate;
          histroyRecordsByDateWise[j]['isNewDate'] = 'Y';
          histroyRecordsByDateWise[j]['datekey'] = historyDate.split('-')[0];
          histroyRecordsByDateWise[j]['year'] = this.datePipe.transform(
            histroyRecordsByDateWise[j]['updatetime'],'MMM,yyyy hh:mm a',this.appUtilityConfig.userZoneOffsetValue);
          histroyRecordsByDateWise[j]['TimeDiffernce'] = '';
          histroyRecordsByDateWise[j]['userId'] =
            histroyRecordsByDateWise[j]['updatedBy'];
          histroyRecordsByDateWise[j]['userimg'] = this.appUtilityConfig.getUserImageURL(histroyRecordsByDateWise[j]['userId']);
            
          this.historyDisplayData.push(histroyRecordsByDateWise[j]);
        }  else {
          if (this.historyDisplayData[this.historyDisplayData.length - 1]['date'] === historyDate) {
            histroyRecordsByDateWise[j]['date'] = historyDate;
            histroyRecordsByDateWise[j]['isNewDate'] = 'N';
            histroyRecordsByDateWise[j]['datekey'] = historyDate.split('-')[0];
            histroyRecordsByDateWise[j]['year'] = this.datePipe.transform(histroyRecordsByDateWise[j]['updatetime'],
            'MMM,yyyy hh:mm a',this.appUtilityConfig.userZoneOffsetValue);
            histroyRecordsByDateWise[j]['time'] = this.datePipe.transform(histroyRecordsByDateWise[j]['updatetime'], this.appUtilityConfig.hoursFormat,this.appUtilityConfig.userZoneOffsetValue);
            histroyRecordsByDateWise[j]['userId'] =histroyRecordsByDateWise[j]['updatedBy'];
            histroyRecordsByDateWise[j][ 'TimeDiffernce'] = this.calculateTimeDifference(
              this.historyDisplayData[this.historyDisplayData.length - 1]['updatetime'],
              histroyRecordsByDateWise[j]['updatetime'],'time');
            histroyRecordsByDateWise[j]['userimg'] = this.appUtilityConfig.getUserImageURL(histroyRecordsByDateWise[j]['userId'])

            this.historyDisplayData.push(histroyRecordsByDateWise[j]);
          }  else {
            histroyRecordsByDateWise[j]['date'] = historyDate;
            histroyRecordsByDateWise[j]['isNewDate'] = 'Y';
            histroyRecordsByDateWise[j]['datekey'] = historyDate.split('-')[0];
            var prevDat = this.historyDisplayData[this.historyDisplayData.length - 1]['date'];
            histroyRecordsByDateWise[j]['year'] = this.datePipe.transform(
              histroyRecordsByDateWise[j]['updatetime'],
              'MMM,yyyy hh:mm a',this.appUtilityConfig.userZoneOffsetValue);
            histroyRecordsByDateWise[j]['time'] = this.datePipe.transform(histroyRecordsByDateWise[j]['updatetime'],
            this.appUtilityConfig.hoursFormat,this.appUtilityConfig.userZoneOffsetValue);
            histroyRecordsByDateWise[j]['userId'] =histroyRecordsByDateWise[j]['updatedBy'];
            histroyRecordsByDateWise[j]['TimeDiffernce'] = this.calculateTimeDifference(
              this.groupHistoryRecordsByDate[prevDat][0]['updatetime'],
              histroyRecordsByDateWise[j]['updatetime'], 'day');
            histroyRecordsByDateWise[j]['userimg'] = this.appUtilityConfig.getUserImageURL(histroyRecordsByDateWise[j]["userId"])

            this.historyDisplayData.push(histroyRecordsByDateWise[j]);
          }
        }
      }
    }
 

    this.historyDisplayData.reverse();
    this.dataLoaded = true;
    setTimeout(() => {
      this.setLineHeight();
    }, 100);
  }

  setLineHeight() {
    let list = document.getElementsByClassName(
      'cs-sh-individual-segment'
    ) as HTMLCollectionOf<HTMLElement>;
    let popupLineHeightConcatenate = 0;
    let assign_height = Array.from(
      document.getElementsByClassName(
        "cs-date-line"
      ) as HTMLCollectionOf<HTMLElement>
    );
    for (let index = 0; index < list.length; index++) {
      popupLineHeightConcatenate += list[index].offsetHeight;
    }
    assign_height[0].setAttribute(
      'style',
      `height:${popupLineHeightConcatenate - 48}px`
    );
    window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown']);
  }

  prepareDateKeyForMapping(dateVal) {
    let keyDate = new Date(dateVal);
    keyDate.setHours(0, 0, 0, 0);
    var dateValue = keyDate.getDate();
    var monthValue = keyDate.getMonth() + 1;
    var yearValue = keyDate.getFullYear();
    return dateValue + '-' + monthValue + '-' + yearValue;
  }
  prepareTimeStamp(dateVal) {
    let keyDate = new Date();
    keyDate.setDate(dateVal.split('-')[0]);
    keyDate.setMonth(dateVal.split('-')[1] - 1);
    keyDate.setFullYear(dateVal.split('-')[2]);

    return keyDate.getTime();
  }
  buttonclick(userData) {
    userData['buttonClicked'] = !userData['buttonClicked'];
    setTimeout(() => {
      this.setLineHeight();
    }, 100);
  }
  calculateTimeDifference(date1, date2, format) {
    var res = Math.abs(date1 - date2) / 1000;
    var days = Math.floor(res / 86400);
    var hours = Math.floor(res / 3600) % 24;
    var minutes = Math.floor(res / 60) % 60;
    var seconds = res % 60;
    console.log(seconds);
    if (format === 'day') {
      
      if (days > 1 && hours===0) {
        return days + ' Days';
      }else if(days === 0 && hours===1 && minutes===0){
        return  hours +' Hr';
      }else if(days === 0 && hours>0 && minutes>0){
        return  hours +' Hr' + minutes + ' Min';
      }else if(days > 1 && hours>1){
        return days + ' Days ' + hours +' Hrs';
      }else if(days === 0 && hours>1){
        return  hours +' Hrs';
      }else if(days === 0 && hours === 0 && minutes>0){
        return  minutes +' Min';
      }else {
        return days + ' day';
      }
    } else {
      if (hours > 0 && minutes === 0 && seconds === 0) {
        return hours + ' Hr ';
      } else if (hours > 0 && minutes > 0 && (seconds === 0 || seconds > 0)) {
        return hours + ' Hr ' + minutes + ' Min ';
      } else if (hours === 0 && minutes > 0 && seconds === 0) {
        return minutes + ' Mins ';
      } else if (hours === 0 && minutes > 0 && seconds > 0) {
        return minutes + ' Mins ' + Math.round(seconds) + ' Secs ';
      } else {
        return Math.round(seconds) + ' Secs ';
      }
    }
  }



  fetchExecutionData(workflowExcutionId, rec) {
    var approverListRecords;

    return this.cspfmStatusWorkFlowServiceObject
      .fetchWorkFlowUserApprovalStatusByWorkFlowExeId(
        workflowExcutionId,
        this.dbProvider
      )
      .then((res) => {
        if (res) {
          var approvalStatusRec = res['approvalStatus'];
          this.approveType = res['approvalType'];

          if (res['approvalType'] === 'HIERARCHICAL') {
            approverListRecords = approvalStatusRec.sort(function (a, b) {
              return Number(a.userLevel) - Number(b.userLevel);
            }).reverse()
          } else {
            approverListRecords = approvalStatusRec;
          }

          approverListRecords.forEach(approverRec => {
            approverRec['userimg'] = this.appUtilityConfig.getUserImageURL(approverRec['userId']);
          });

          if (rec === ''){
            this.approverList = approverListRecords;
          } 
          if(rec){
            rec['approverAction'] = approverListRecords;
          }
         
          return res;
        } else {
          rec['approverAction'] = [];
          return '';
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
 
  getCurrentIniaitedApproverList() {
    if (
      this.selectedDataObject &&
      this.selectedDataObject['systemAttributes'] &&
      this.selectedDataObject['systemAttributes']['workFlowExecID']
    ) {
      this.workflowExcutionId = this.selectedDataObject['systemAttributes'][
        'workFlowExecID'
      ];
    }
  
    if (this.workflowExcutionId) {
      return this.fetchExecutionData(this.workflowExcutionId, '')
        .then((res) => {
          return Promise.resolve(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return Promise.resolve(true);
    }
  }
}
