

/* 
 *    File: calendarBridge.ts 
 *    Copyright(c) 2022 Chain-Sys Corporation Inc.
 *    Duplication or distribution of this code in part or in whole by any media
 *    without the express written permission of Chain-Sys Corporation or its agents is
 *    strictly prohibited.
 */
import { Injectable } from '@angular/core';
import { dbProvider } from '../db/dbProvider';
import { Platform } from '@ionic/angular';
import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { couchdbProvider } from '../db/couchdbProvider';
import { dataProvider } from '../utils/dataProvider';
import { appConstant } from '../utils/appConstant';
import { dbConfiguration } from '../db/dbConfiguration';
@Injectable({
  providedIn: 'root'
})
export class calendarBridge {
  public subscription;
  public alldocs;
  public pagination = {
      enabled: true,
      view: {
          itemCount: 100
      },
      bookmark: '',
      total_rows: 0
  }
  public layoutDataRestrictionSet = [];
  public dataSource = "";
  public dataFetched = []
  constructor(public serviceProvider: dbProvider,
    public platform: Platform, public broadcaster: Broadcaster, public file: File, private appPreferences: AppPreferences,
    public couchDBProvider : couchdbProvider, public dataProviderObj: dataProvider, public dbConfigurationObj: dbConfiguration) {
  }

  startObserver() {
    this.subscription = this.broadcaster.addEventListener('FetchCalendarEvents').subscribe((userinfo) => {
      

      const syncDetail = JSON.parse(userinfo.syncInfo);
      if (syncDetail.syncType === 'StopObserver') {
        this.stopObserver();
      } else if (syncDetail.syncType === 'SingleRecord') {
        this.fetchSelectedObject(syncDetail)
      } else if (syncDetail.syncType === 'AllRecords') {
        // this.fetchDataFromPouch(syncDetail);
        this.fetchAllData(syncDetail)
      } else {
        console.log('Invalid input');
      }
    }, err => {
      console.log('Subscription error', err);
    });
  }

  stopObserver() {
    this.subscription.unsubscribe();
  }
  async fetchAllData(fetchDetail) {
    const tablelist = fetchDetail.fetchData[0];
    const offlineAttachmentObjects = this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors;
      offlineAttachmentObjects.forEach(offlineDataTypeRes => {
          if (offlineDataTypeRes['data.type'] === tablelist.tableName) {
            
            this.dataSource = "PouchDB"
          }
      })
      if (this.dataSource === "") {
        this.dataSource = "CouchDB"
      }
    const fetchParams = {
        'objectHierarchyJSON': tablelist.calendarHierarchyJson,
        'layoutDataRestrictionSet': this.layoutDataRestrictionSet,
        'dataSource': this.dataSource
    }
    if (this.dataSource === appConstant.couchDBStaticName) {
          fetchParams['searchListQuery'] = "type:" +  tablelist.tableName
          this.fetchRecordsFromCouch(fetchParams, tablelist);
    } else {
      this.fetchAllDataFromPouch(fetchParams, tablelist);
    }
    
}
  async fetchRecordsFromCouch(fetchParams, tabledata) {
    fetchParams['pagination'] = {
        limit: this.pagination['view']['itemCount'],
        bookmark: this.pagination['bookmark']
    }
    this.dataProviderObj.fetchDataFromDataSource(fetchParams).then(res => {
      if (res['status'] === 'SUCCESS') {
        this.pagination['bookmark'] = res['bookmark'];
        const records = res['records'];
        records.forEach(element => {
          console.log('records to push', element);
          this.dataFetched.push(element);
        });
        if (res['total_rows']) {
            this.pagination['total_rows'] = res['total_rows']
        }
        if (this.dataFetched.length === res['total_rows']) {
          const data = this.dataFetched;
          if (data.length > 0) {
            const resultData = {
              records: data,
              recordsCount: data.length
            };
            this.writeDataAsJson(tabledata.calendarName, JSON.stringify(resultData));
          } else {
            this.sendResponceToNative(tabledata.calendarName, 'NoData', '');
          }
        } else {
          this.fetchRecordsFromCouch(fetchParams, tabledata);
        }
      } else {
        this.sendResponceToNative("Record not found", 'NoData', '');
      }
  }).catch(error => {
    this.sendResponceToNative("Record not found", 'NoData', '');
  });
  }


  async fetchAllDataFromPouch(fetchParams, tabledata) {
    this.dataProviderObj
        .queryDataFromDataSource(fetchParams)
        .then(res => {
      if (res['status'] === 'SUCCESS') {
        if (res['records'].length !== 0) {
        const records = res['records'];
        records.forEach(element => {
          this.dataFetched.push(element);
        });
        this.fetchAllDataFromPouch(fetchParams, tabledata);
      } else {
        const data = this.dataFetched;
        if (data.length > 0) {
          const resultData = {
            records: data,
            recordsCount: data.length
          };
          this.writeDataAsJson(tabledata.calendarName, JSON.stringify(resultData));
        } else {
          this.sendResponceToNative(tabledata.calendarName, 'NoData', '');
        }
      }
    } else {
      this.sendResponceToNative(tabledata.calendarName, 'NoData', '');
    }
  }).catch(error => {
    this.sendResponceToNative("Record not found", 'NoData', '');
  });
}
  // COUCH/POUCH ENABLED LAYOUT CODE
  // Get single document by id

  async fetchSelectedObject(syncDetail) {

    const offlineAttachmentObjects = this.dbConfigurationObj.configuration.pouchDBSyncEnabledObjectSelectors;
    offlineAttachmentObjects.forEach(offlineDataTypeRes => {
        if (offlineDataTypeRes['data.type'] === syncDetail.fetchData.tableName) {
          this.dataSource = "PouchDB"
        }
    })
    if (this.dataSource === "") {
      this.dataSource = "CouchDB"
    }

    const additionalObjectdata = {}
    additionalObjectdata["id"] = syncDetail.fetchData.id;
    const fetchParams = {
      objectHierarchyJSON: syncDetail.calendarHierarchyJson,
      additionalInfo: additionalObjectdata,
      dataSource: this.dataSource
    };
    this.dataProviderObj
      .querySingleDoc(fetchParams)
      .then(result => {
        console.log('result', result);
        if (result["status"] === "SUCCESS") {
          if (result['records'].length > 0) {
            const data = result['records'];
            this.writeDataAsJson("detailDoc", JSON.stringify(data));

          } else {
            this.sendSingleResponceToNative('Failed', 'Record not found');
          }
        } else {
          this.sendSingleResponceToNative('Failed', 'Record not found');
        }
      }).catch((err) => {
        this.sendSingleResponceToNative('Failed', 'Record not found');
      });
  }


  // Response to native
  sendResponceToNative(calendarName, status, filename) {
    setTimeout(() => {
      this.broadcaster.fireNativeEvent('CalendarSyncNotification',
      { 'calendarName': calendarName, 'status': status, 'fileName': filename }).then(() => {
      });
    }, 2000);
  }
  sendSingleResponceToNative(status, filename) {
    setTimeout(() => {
      this.broadcaster.fireNativeEvent('CalendarRecordDetailNotification', { 'status': status, 'recordDetail': filename }).then(() => {
      });
    }, 2000);

  }

  // Get all document

  fetchDataFromPouch(fetchDetail) {
    const tablelist = fetchDetail.fetchData;
    tablelist.forEach(tabledata => {

      // Make fields unique
      const uniqueFields = tabledata.fieldDetails.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });

      // //Check id field available if available then replace with _id
      // if (uniqueFields.indexOf('id') > -1) {
      //   uniqueFields.splice(uniqueFields.indexOf('id'), 1, '_id');
      // }

      // //Modify rel style fields (All elements within data key)
      // var fieldsWithRelStyle = uniqueFields.map(function (val) {
      //   if (val != '_id') {
      //     val = 'data.' + val
      //   }
      //   return val
      // });

      // Check _id is available in fields array if not available then add the _id, because _id must for rel fetch
      if (uniqueFields.indexOf('_id') < 0) {
        uniqueFields.push('_id');
      }


      // Updated data validation
      if (!tabledata.lastmodifiedon || tabledata.lastmodifiedon === 0) {
        tabledata.lastmodifiedon = 0;
      }
      // 'data.last_modified_on': { $gte: tabledata.last_modified_on },
      const selector = { 'data.lastmodifiedon': { $gte: tabledata.lastmodifiedon }, 'data.type': tabledata.tableName };
      const options = {};
      options['selector'] = selector;
      

      this.serviceProvider.fetchDocsWithRelationshipUsingFindOption(options, false)
        .then(res => {

          if (res['status'] === 'SUCCESS') {
            const data = res['records'];
            if (data.length > 0) {
              const resultData = {
                records: data,
                recordsCount: data.length
              };
              this.writeDataAsJson(tabledata.calendarName, JSON.stringify(resultData));
            } else {
              this.sendResponceToNative(tabledata.calendarName, 'NoData', '');
            }
          } else {
            this.sendResponceToNative(tabledata.calendarName, 'NoData', '');
          }
        });

    });

  }
  // Write all documents as json in local directory(ios:library/nocloud,Android:files)
  writeDataAsJson(CalendarName, jsondata) {
    this.getPath().then((path) => {
      if (path) {
        const options = {
          replace: true
        };
        const fileName = CalendarName;
        this.file.writeFile(path, fileName + '.json', jsondata, options).then(() => {
          if (fileName === "detailDoc") {
            this.sendSingleResponceToNative('Success', fileName);
          } else {
          this.sendResponceToNative(CalendarName, 'Success', fileName);
          }
        }).catch((err) => {
          this.sendResponceToNative(CalendarName, 'Failed', '');

        });
      } else {
        this.sendResponceToNative(CalendarName, 'Failed', '');
      }
    }).catch((err) => {
      this.sendResponceToNative(CalendarName, 'Failed', '');
    });
  }

  // Get directory path, if directory not available then create it
  getPath() {
    return this.appPreferences.fetch('selectedappId').then((res) => {
      
      return Promise.resolve(this.file.checkDir(this.file.dataDirectory, 'Dyna_UI/' + res + '/CalendarData/').then(
        (exists) => {
          return this.file.dataDirectory + 'Dyna_UI/' + res + '/CalendarData/';
        })
        .catch((exception) => {
          return this.file.createDir(this.file.dataDirectory, 'Dyna_UI/' + res + '/CalendarData/', false).then(
            (dirEntry) => {
              return this.file.dataDirectory + 'Dyna_UI/' + res + '/CalendarData/';
            }).catch((error) => {
              if (error.message = 'PATH_EXISTS_ERR') {
                return this.file.dataDirectory + 'Dyna_UI/' + res + '/CalendarData/';
              }
            });
        }));
    });
  }

  // Fetch Calendar Record From CouchDB
  fetchCalendarRecordFromCouchDB(query, hierarchyJson) {
    return this.couchDBProvider.fetchRecordsBySearchFilterPhrases(query, hierarchyJson).then(result => {
      const status = result["status"]
      if (status === "SUCCESS") {
        return {
          "status": result["status"],
          "records": result["records"]
        }
      } else {
        return {
          "status": "FAILED",
          "message": "Server error. Please contact admin."
        }
      }
    }).catch((err) => {
      return {
        "status": "FAILED",
        "message": "Server error. Please contact admin."
      }
    });
  }
}
