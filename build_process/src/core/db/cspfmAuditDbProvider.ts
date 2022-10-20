import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { dbConfiguration } from './dbConfiguration';
import { appUtility } from '../utils/appUtility';
import { appConfiguration } from '../utils/appConfiguration';
import PouchDBAllDB from 'pouchdb-all-dbs';
import { cspfmFieldTrackingMapping } from '../pfmmapping/cspfmFieldTrackingMapping';
import { HttpClient } from '@angular/common/http';

PouchDB.plugin(PouchDBAllDB);



@Injectable()

export class cspfmAuditDbProvider {
  private failed = "FAILED"
  private success = 'SUCCESS';
  private batchLimit:number=2000

  constructor(public dbConfigurationObj: dbConfiguration, private httpClient:HttpClient,
   
    public appUtilityObj: appUtility, public appconfig: appConfiguration, public fieldTrackMapping: cspfmFieldTrackingMapping) {
  }

  initializeAuditDB(type, newDoc, previousDoc, newDocId, newDocRevId) {
    const stringToSplit = type;
    const splitValue = stringToSplit.split("pfm");
    
    const objectId = splitValue[1]

    const auditdatabseName = "pfm" + '_' + this.appUtilityObj.orgId + '_' +
      objectId + '_' + "audit";
    let db;
    if (this.appUtilityObj.isMobile) {
      db = new PouchDB(auditdatabseName + '.db', { adapter: 'cordova-sqlite', location: 'default' });
    } else {
      db = new PouchDB(auditdatabseName, { size: 50 });
    }
    const fieldTrackObject = this.fieldTrackMapping.mappingDetail[type]
    const trackingFields = fieldTrackObject["tracking_fields"]
    return this.saveAuditRecord(trackingFields, newDoc, previousDoc, db, newDocId, newDocRevId).then(res => {
      if (res["status"] === this.success) {
        const allresult = res["records"]
        const resultObject = allresult[0];
        const pouchdb = resultObject["db"];
        pouchdb.close();
        return Promise.resolve(this.success);
      } else {
        return Promise.resolve(this.failed);
      }
    }).catch(function (err) {
      return Promise.resolve(err.message);
    });
  }

  saveAuditRecord(trackingFields, newDoc, previousDoc, pouchDB, newDocId, newDocRevId) {
    const saveTrackingRecords = [];
    if (previousDoc !== undefined) {
      previousDoc = JSON.parse(previousDoc)
    } else {
      previousDoc = {}
    }
    trackingFields.forEach(fieldName => {
      const previousDocFieldValue = previousDoc[fieldName] ? previousDoc[fieldName] : "";
      const newDocFieldValue = newDoc[fieldName];
      const saveRecord = {
        "tracking_field_name": fieldName,
        "current_value": newDocFieldValue,
        "prev_value": previousDocFieldValue ? previousDocFieldValue : "",
        "maindoc_id": newDocId,
        "maindoc_rev": newDocRevId,
        "modifiedon": new Date().getTime(),
        "modifiedby": this.appUtilityObj.userId,
        "fromoffline": true,
        "conflict": false
      }
      saveTrackingRecords.push(pouchDB.post(saveRecord).then(res => {
        return { reposnse: res, db: pouchDB };
      }));
    });
    return Promise.all(saveTrackingRecords).then(allresult => {
      return { status: this.success, message: '', records: allresult };
    }).catch(error => {
      return { status: this.failed, message: error.message };
    });
  }

  startSyncOperation() {
    const auditDBSyncStatus = []
    return PouchDB.allDbs().then(dbs => {
        dbs.forEach(element => {
          if (element.includes("audit")) {
            let db;
            if (this.appUtilityObj.isMobile) {
              db = new PouchDB(element, { adapter: 'cordova-sqlite', location: 'default' });
            } else {
              db = new PouchDB(element, { size: 50 });
            }
            const splitValue = element.split(".db");
            const dbName = splitValue[0]
            auditDBSyncStatus.push(this.oneTimeReplicationToServer(db, dbName).then(res => {
              
              if (res.status === 'complete') {
                return db.destroy().then(response => {
                  return this.success;
                }).catch(err => {
                  return this.failed;
                })
              } else {
                return this.failed;
              }
            }).catch(error => {
              return this.failed;
            }));
          }
        });
        return Promise.all(auditDBSyncStatus).then(allresult => {
          return { status: this.success, message: '', records: allresult };
        }).catch(error => {
          return { status: this.failed, message: error.message };
        });
    }).catch(function (err) {
      return Promise.resolve(err.message);
    });
  }
  // One time replication to server
  oneTimeReplicationToServer(pouchDB, dbName) {
    const remote = this.dbConfigurationObj.remoteDbUrl + dbName;
    const options = this.getSyncOption();
    return pouchDB.replicate.to(remote, options)
  }
  // Get sync option
  private getSyncOption() {
    return {
      live: false,
      retry: true,
      auth: this.appUtilityObj.addCredentialforMobile('AUTH', this.dbConfigurationObj)
    };
  }
  
  // Query based recursive fetch
  callSearchDesignDocs(query,  objectId,response?, queryFlags?: { include_docs: boolean, include_fields: boolean }) {
    let postParam = {}
    let responseInfo = {
        "rows": [],
        "bookmark": ""
    }
  
    if (response) {
        postParam = {
            "q": query,
            "include_docs": true,
            "limit": this.batchLimit,
            "bookmark": response['bookmark']
        }
        responseInfo['rows'] = response['rows']
    } else {
        postParam = {
            "q": query,
            "include_docs": true,
            "limit": this.batchLimit
        }
    }
    if (queryFlags) {
        if (queryFlags['include_docs'] !== undefined && queryFlags['include_docs'] === false) {
            postParam['include_docs'] = false;
        }
        if (queryFlags['include_fields'] !== undefined && queryFlags['include_fields'] === false) {
            postParam['include_fields'] = [];
        }
    }

    const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.dbConfigurationObj)
    return new Promise(resolve => {
    
      var obj = objectId.slice(3)
        const url = `${this.dbConfigurationObj.remoteDbUrl}pfm_${this.appUtilityObj.orgId}_${obj}_audit/_design/audit_search/_search/audit_search`;
        this.httpClient.post(url, postParam, headerstring).toPromise()
            .then(res => {
                const jsonObj = res

                if (jsonObj['rows'].length < this.batchLimit) {
                    Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                    var responseResult ={}
                    responseResult['status'] = this.success
                    responseResult['message'] = "Data Fetched"
                    responseResult['records'] = responseInfo['rows']
                    return resolve(responseResult)
                } else {
                    Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                    responseInfo['bookmark'] = jsonObj['bookmark']
                    return resolve(this.callSearchDesignDocs(query,  responseInfo));
                }
            }, error => {
                console.log('error==>' + error)
                return resolve({ 'status': this.failed, 'message': 'Server error. Please contact admin.' })
            })
    }).catch(err=>{
        console.log(err);
        return { 'status': this.failed, 'message': 'Server error. Please contact admin.' }
       
        
      })
}

  //Query based given count
callSearchDesignDocsByLimit(query,  objectId,recordLimit,response?, queryFlags?: { include_docs: boolean, include_fields: boolean }) {
  let postParam = {}
  let responseInfo = {
      "rows": [],
      "bookmark": ""
  }

  if (response) {
      postParam = {
          "q": query,
          "include_docs": true,
          "limit": recordLimit,
          "bookmark": response['bookmark']
      }
      responseInfo['rows'] = response['rows']
  } else {
      postParam = {
          "q": query,
          "include_docs": true,
          "limit": recordLimit
      }
  }
  if (queryFlags) {
      if (queryFlags['include_docs'] !== undefined && queryFlags['include_docs'] === false) {
          postParam['include_docs'] = false;
      }
      if (queryFlags['include_fields'] !== undefined && queryFlags['include_fields'] === false) {
          postParam['include_fields'] = [];
      }
  }

  const headerstring = this.appUtilityObj.addCredentialforMobile('AJAX', this.dbConfigurationObj)
  return new Promise(resolve => {
  
    var obj = objectId.slice(3)
    const url = `${this.dbConfigurationObj.remoteDbUrl}pfm_${this.appUtilityObj.orgId}_${obj}_audit/_design/audit_search/_search/audit_search`;
      this.httpClient.post(url, postParam, headerstring).toPromise()
          .then(res => {
              const jsonObj = res

                  Array.prototype.push.apply(responseInfo['rows'], jsonObj['rows'])
                  var responseResult ={}
                  responseResult['status'] = this.success
                  responseResult['message'] = "Data Fetched"
                  responseResult['records'] = responseInfo['rows']
                  return resolve(responseResult)
             
          }, error => {
              console.log('error==>' + error)
              return resolve({ 'status': this.failed, 'message': 'Server error. Please contact admin.' })
          })
  }).catch(err=>{
      console.log(err);
      return { 'status': this.failed, 'message': 'Server error. Please contact admin.' }
     
      
    })
}
  public getAuditIsAvailable() {
    let auditDBAvailable = false;
    return PouchDB.allDbs().then(dbs => {
      dbs.forEach(element => {
        if (element.includes('audit')) {
          auditDBAvailable = true
        }
      })
      return auditDBAvailable;
    })
  }
}
